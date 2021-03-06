import {Column, Row} from "../../utils/simple/Flex";
import {SimpleSpan, Text, TextTheme} from "../../utils/simple/Text";
import React, {Fragment, useEffect, useRef, useState} from "react";
import {Button, Divider, Typography} from "@mui/material";
import {clickableColor, fadedOutColor} from "../../Colors";
import {
    RichCrashReport,
    RichStackTrace,
    RichStackTraceElement,
    StackTraceMessage,
    unfoldRichStackTrace
} from "crash-parser/src/model/RichCrashReport";
import {Spacer} from "../../utils/simple/SimpleDiv";
import {ClickCallback} from "../../utils/simple/GuiTypes";
import {WithMappings} from "./mappings/MappingsUi";
import {MappingContext, MappingStrategy, useMappingFor, useMappingForName} from "../../../mappings/resolve/MappingStrategy";
import {MappingsController} from "./mappings/MappingsController";

export function StackTraceUi({report}: { report: RichCrashReport }) {
    const causerList = unfoldRichStackTrace(report.stackTrace);
    const [currentCauserIndex, setCauserIndex] = useState(0)
    const currentTrace = causerList[currentCauserIndex];

    const mappingsController = new MappingsController(report)
    const mappings = mappingsController.getContext();

    return <Column width={"max"}>
        <WithMappings controller={mappingsController}>
            <div>
                {causerList.length > 1 && CausationButtons(currentCauserIndex, causerList, setCauserIndex)}

                    <StackTraceMessageUi title={currentTrace.title} mappingContext={mappings}/>

                <Divider/>
                <StackTraceElementsUi elements={currentTrace.elements} mappings={mappings}/>
            </div>
        </WithMappings>

    </Column>
}


export function StackTraceElementsUi(props: { elements: RichStackTraceElement[], mappings: MappingContext }) {
    return <div>
        {props.elements.map((traceElement, i) =>
            <StackTraceElementUi mappings={props.mappings} withMarginLeft={true}
                                 key={i}
                                 traceElement={traceElement}/>)}
    </div>
}

function CausationButtons(currentCauserIndex: number, causerList: RichStackTrace[], onCauserIndexChanged: (index: number) => void) {
    //TODO: I'm reworking these (next implementation needs to use mappings)
    return <Fragment/>
    // return <Row>
    //     <Spacer width={5}/>
    //     {currentCauserIndex > 0 && <CausationButton
    //         text={`Caused: ${causerList[currentCauserIndex - 1].title.class.getSimpleName()}`}
    //         onClick={() => onCauserIndexChanged(currentCauserIndex - 1)}
    //     />}
    //     {currentCauserIndex > 0 && <Spacer width={20}/>}
    //     {currentCauserIndex < causerList.length - 1 && <CausationButton
    //         text={`Caused By: ${causerList[currentCauserIndex + 1].title.class.getSimpleName()}`}
    //         onClick={() => onCauserIndexChanged(currentCauserIndex + 1)}
    //     />}
    // </Row>;
}


function CausationButton(props: { text: string, onClick: ClickCallback }) {
    return <Button style={{wordBreak: "break-word"}} disableRipple={true} variant={"outlined"} size={"small"}
                   onClick={(e) => props.onClick(e.currentTarget)}>
        {props.text}
    </Button>
}

function StackTraceMessageUi({title, mappingContext}: { title: StackTraceMessage, mappingContext: MappingContext }) {
    const [open, setOpen] = React.useState(false)
    const mappingMethod = useMappingForName(title.class, mappingContext);
    const text = open ? title.class.fullName(mappingMethod) : title.class.simpleName(mappingMethod);

    return <TextTheme wordBreak={"break-word"} variant={"h5"}>
        <SimpleSpan text={text} color={open ? undefined : clickableColor}
                    onClick={() => setOpen(!open)}/>
        {title.message !== undefined && <Fragment>
            : {title.message}
        </Fragment>}
    </TextTheme>
}
function useTraceUpdate(props: Record<string,unknown>) {
    const prev = useRef(props);
    useEffect(() => {
        const changedProps = Object.entries(props).reduce((ps: Record<string, unknown>, [k, v]) => {
            if (prev.current[k] !== v) {
                ps[k] = [prev.current[k], v];
            }
            return ps;
        }, {});
        if (Object.keys(changedProps).length > 0) {
            console.log('Changed props:', changedProps);
        }
        prev.current = props;
    });
}
export function StackTraceElementUi({
                                        traceElement,
                                        withMarginLeft,
                                        mappings
                                    }: { traceElement: RichStackTraceElement, withMarginLeft: boolean, mappings: MappingContext }) {
    const [open, setOpen] = React.useState(false)
    const mappingMethod = useMappingFor(traceElement, mappings);
    const text = getTraceElementText(traceElement, open, mappingMethod)
    const isXMore = typeof traceElement === "number"

    return <Row margin={{left: withMarginLeft ? 30 : 0}}>
        <Typography color={fadedOutColor} marginRight={"10px"}>
            at
        </Typography>
        <Text color={open || isXMore ? undefined : clickableColor} wordBreak="break-word" text={text}
              onClick={isXMore ? undefined : () => setOpen(!open)}/>

    </Row>;
}

function getTraceElementText(traceElement: RichStackTraceElement, open: boolean, mappings: MappingStrategy): string {
    if (typeof traceElement === "number") return `${traceElement} more...`
    if (open) {
        const fileName = traceElement.method.classIn.fullName(mappings)
            .removeBeforeLastExclusive(".").removeAfterFirstExclusive("$")
        const inBracketText = traceElement.line.number === undefined ? "Native Method" : `${fileName}:${traceElement.line.number}`
        return traceElement.method.fullName(mappings) + ` (${inBracketText})`
    } else {
        const inBracketText = traceElement.line.number === undefined ? "Native Method" : `Line ${traceElement.line.number}`
        return traceElement.method.simpleName(mappings)+ ` (${inBracketText})`
    }
}


