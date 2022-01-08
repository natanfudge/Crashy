import {Column, Row} from "../../utils/simple/Flex";
import {SimpleSpan, Text, TextTheme} from "../../utils/simple/Text";
import React, {Fragment, useEffect, useState} from "react";
import {Button, Divider, Typography} from "@mui/material";
import {clickableColor, fadedOutColor} from "../../Colors";
import {
    javaClassFullName,
    javaMethodFullNameName,
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
import {buildsOf} from "../../../mappings/Mappings";
import {MappingsState, withVersion} from "../../../mappings/MappingsState";

//TODO: mappings selection for other sections


export function StackTraceUi({report}: { report: RichCrashReport }) {
    const causerList = unfoldRichStackTrace(report.stackTrace);
    const [currentCauserIndex, setCauserIndex] = useState(0)
    const currentTrace = causerList[currentCauserIndex];

    const [mappingsState, setMappingsState] = useMappingsState(report.context.minecraftVersion);

    const screen = useScreenSize();

    const mappingsProps: MappingsSelectionProps = {
        mappings: mappingsState,
        onMappingsChange: setMappingsState,
        isPortrait: screen.isPortrait,
        minecraftVersion: report.context.minecraftVersion
    }

    return <Row width={"max"}>
        <Column alignSelf={"start"}>
            {CausationButtons(currentCauserIndex, causerList, setCauserIndex)}

            {screen.isPortrait && <MappingsSelection props={mappingsProps}/>}
            <Row flexWrap={"wrap"}>
                {StackTraceMessageUi(currentTrace.title)}
            </Row>

            <Divider/>
            <StackTraceElementsUi elements={currentTrace.elements}/>
        </Column>
        <Spacer flexGrow={1}/>
        {!screen.isPortrait && <MappingsSelection props={mappingsProps}/>}
    </Row>
}

export function useMappingsState(minecraftVersion: string): [MappingsState, React.Dispatch<React.SetStateAction<MappingsState>>] {
    // Initially, immediately show a mapping, and since getting what versions are available takes time, we'll set the version to undefined
    // for now and what the available versions load we will set it to the first available one.
    const [state, setState] = useState<MappingsState>(
        {namespace: "Yarn", version: undefined}
    )

    // useEffect(() => void buildsOf("Yarn", minecraftVersion).then(builds => setState(old => withVersion(old, builds[0]))),[])


    return [state, setState];
}


export function StackTraceElementsUi({elements}: { elements: RichStackTraceElement[] }) {
    return <div>
        {elements.map((traceElement, i) => <StackTraceElementUi withMarginLeft={true} key={i}
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

function StackTraceMessageUi(title: StackTraceMessage) {
    const [open, setOpen] = React.useState(false)

    const text = open ? javaClassFullName(title.class) : title.class.simpleName;

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
                                        withMarginLeft
                                    }: { traceElement: RichStackTraceElement, withMarginLeft: boolean }) {
    const [open, setOpen] = React.useState(false)
    const text = getTraceElementText(traceElement, open)
    const isXMore = typeof traceElement === "number"

    return <Row margin={{left: withMarginLeft ? 30 : 0}}>
        <Typography color={fadedOutColor} marginRight={"10px"}>
            at
        </Typography>
        <Text color={open || isXMore ? undefined : clickableColor} wordBreak="break-word" text={text}
              onClick={isXMore ? undefined : () => setOpen(!open)}/>

    </Row>;
}

function getTraceElementText(traceElement: RichStackTraceElement, open: boolean): string {
    if (typeof traceElement === "number") return `${traceElement} more...`
    if (open) {
        const inBracketText = traceElement.line.number === undefined ? "Native Method" : `${traceElement.line.file}:${traceElement.line.number}`
        return javaMethodFullNameName(traceElement.method) + ` (${inBracketText})`
    } else {
        const inBracketText = traceElement.line.number === undefined ? "Native Method" : `Line ${traceElement.line.number}`
        return javaMethodSimpleName(traceElement.method) + ` (${inBracketText})`
    }
}


