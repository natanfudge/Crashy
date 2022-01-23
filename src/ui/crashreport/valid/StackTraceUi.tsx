import {Column, Row} from "../../utils/simple/Flex";
import {SimpleSpan, Text, TextTheme} from "../../utils/simple/Text";
import React, {Fragment, useState} from "react";
import {Button, Divider, Typography} from "@mui/material";
import {clickableColor, fadedOutColor} from "../../Colors";
import {
    javaClassFullName,
    javaMethodFullName,
    javaMethodSimpleName,
    RichCrashReport,
    RichStackTrace,
    RichStackTraceElement,
    StackTraceMessage,
    unfoldRichStackTrace
} from "crash-parser/src/model/RichCrashReport";
import {Spacer} from "../../utils/simple/SimpleDiv";
import {ClickCallback} from "../../utils/simple/GuiTypes";
import {MappingsSelection, MappingsSelectionProps} from "./MappingsSelection";
import {useScreenSize} from "../../../utils/Gui";
import {buildsOf, EmptyMappings, getMappingsCached, Mappings} from "../../../mappings/Mappings";
import {MappingsState, withBuild} from "../../../mappings/MappingsState";
import {usePromise} from "../../utils/PromiseBuilder";
import {getYarnMappings} from "../../../mappings/YarnMappingsProvider";
import {IntermediaryToYarnMappingsProvider} from "../../../mappings/MappingsProvider";

//TODO: mappings selection for other sections




export function StackTraceUi({report}: { report: RichCrashReport }) {
    const causerList = unfoldRichStackTrace(report.stackTrace);
    const [currentCauserIndex, setCauserIndex] = useState(0)
    const currentTrace = causerList[currentCauserIndex];

    //TODO: figure out a way of deduplicating this
    const [mappingsState, setMappingsState] = useMappingsState(report.context.minecraftVersion);

    const mappings = useMappings(mappingsState);
    // const mappings = loadingMappings
    const screen = useScreenSize();

    const mappingsProps: MappingsSelectionProps = {
        mappings: mappingsState,
        onMappingsChange: setMappingsState,
        isPortrait: screen.isPortrait,
        minecraftVersion: report.context.minecraftVersion
    }

    console.log("Mappings: " + JSON.stringify(mappings))

    return <Row width={"max"}>
        <Column alignSelf={"start"}>
            {CausationButtons(currentCauserIndex, causerList, setCauserIndex)}

            {screen.isPortrait && <MappingsSelection props={mappingsProps}/>}
            <Row flexWrap={"wrap"}>
                <StackTraceMessageUi title={currentTrace.title} mappings={mappings}/>
            </Row>

            <Divider/>
            <StackTraceElementsUi elements={currentTrace.elements} mappings={mappings}/>
        </Column>
        <Spacer flexGrow={1}/>
        {!screen.isPortrait && <MappingsSelection props={mappingsProps}/>}
    </Row>
}

export function useMappingsState(minecraftVersion: string): [MappingsState, (newState: MappingsState) => void] {
    // Initially, immediately show a mapping, and since getting what versions are available takes time, we'll set the version to undefined
    // for now and what the available versions load we will set it to the first available one.
    const [state, setState] = useState<MappingsState>(
        {namespace: "Yarn",
            build: undefined
        }
    )

    const allBuilds = usePromise(buildsOf(state.namespace,minecraftVersion),[state.namespace])

    //TODO: solution: have seperate variables for the state and the promise; if something is chosen use the state, else use the promise.
    //TODO: see how this aligns with MappingsSelectiona

    const actualState = withBuild(state,state.build ?? allBuilds?.[0]);
    return [actualState, setState];
}

//TODO: indicate that mappings are loading
export function useMappings(mappingsState: MappingsState): Mappings {
    const build = mappingsState.build
    console.log("Build: " + build)
    const promise = build !== undefined ? getMappingsCached(IntermediaryToYarnMappingsProvider, build) : EmptyMappings
    console.log("Promise: " + promise)
    const value = usePromise(
        promise, [build]
    ) ?? EmptyMappings;
    console.log("Value: " + value)
    return value;
}


export function StackTraceElementsUi(props: { elements: RichStackTraceElement[], mappings: Mappings }) {
    return <div>
        {props.elements.map((traceElement, i) =>
            <StackTraceElementUi mappings={props.mappings} withMarginLeft={true}
                                                                      key={i}
                                                                      traceElement={traceElement}/>)}
    </div>
}

function CausationButtons(currentCauserIndex: number, causerList: RichStackTrace[], onCauserIndexChanged: (index: number) => void) {
    return <Row>
        <Spacer width={5}/>
        {currentCauserIndex > 0 && <CausationButton
            text={`Caused: ${causerList[currentCauserIndex - 1].title.class.simpleName}`}
            onClick={() => onCauserIndexChanged(currentCauserIndex - 1)}
        />}
        {currentCauserIndex > 0 && <Spacer width={20}/>}
        {currentCauserIndex < causerList.length - 1 && <CausationButton
            text={`Caused By: ${causerList[currentCauserIndex + 1].title.class.simpleName}`}
            onClick={() => onCauserIndexChanged(currentCauserIndex + 1)}
        />}
    </Row>;
}


function CausationButton(props: { text: string, onClick: ClickCallback }) {
    return <Button style={{wordBreak: "break-word"}} disableRipple={true} variant={"outlined"} size={"small"}
                   onClick={(e) => props.onClick(e.currentTarget)}>
        {props.text}
    </Button>
}

function StackTraceMessageUi({title, mappings}: { title: StackTraceMessage, mappings: Mappings }) {
    const [open, setOpen] = React.useState(false)

    const text = open ? javaClassFullName(title.class, mappings) : title.class.simpleName;

    return <TextTheme wordBreak={"break-word"} variant={"h5"}>
        <SimpleSpan text={text} color={open ? undefined : clickableColor}
                    onClick={() => setOpen(!open)}/>
        {title.message !== undefined && <Fragment>
            : {title.message}
        </Fragment>}
    </TextTheme>
}

export function StackTraceElementUi({
                                        traceElement,
                                        withMarginLeft,
                                        mappings
                                    }: { traceElement: RichStackTraceElement, withMarginLeft: boolean, mappings: Mappings }) {
    const [open, setOpen] = React.useState(false)
    const text = getTraceElementText(traceElement, open, mappings)
    const isXMore = typeof traceElement === "number"

    return <Row margin={{left: withMarginLeft ? 30 : 0}}>
        <Typography color={fadedOutColor} marginRight={"10px"}>
            at
        </Typography>
        <Text color={open || isXMore ? undefined : clickableColor} wordBreak="break-word" text={text}
              onClick={isXMore ? undefined : () => setOpen(!open)}/>

    </Row>;
}

function getTraceElementText(traceElement: RichStackTraceElement, open: boolean, mappings: Mappings): string {
    if (typeof traceElement === "number") return `${traceElement} more...`
    if (open) {
        const inBracketText = traceElement.line.number === undefined ? "Native Method" : `${traceElement.line.file}:${traceElement.line.number}`
        return javaMethodFullName(traceElement.method, mappings) + ` (${inBracketText})`
    } else {
        const inBracketText = traceElement.line.number === undefined ? "Native Method" : `Line ${traceElement.line.number}`
        return javaMethodSimpleName(traceElement.method, mappings) + ` (${inBracketText})`
    }
}


