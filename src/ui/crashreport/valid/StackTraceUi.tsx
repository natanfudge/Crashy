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
import {MappingContext, MappingMethod, useMappingForName} from "../../../mappings/Mappings";
import {MappingsController, WithMappings} from "./mappings/MappingsUi";

export function StackTraceUi({report}: { report: RichCrashReport }) {
    const causerList = unfoldRichStackTrace(report.stackTrace);
    const [currentCauserIndex, setCauserIndex] = useState(0)
    const currentTrace = causerList[currentCauserIndex];

    const mappingsController = new MappingsController(report)
    const mappings = mappingsController.getContext();

    return <WithMappings controller={mappingsController}>
        <Column alignSelf={"start"}>
            {CausationButtons(currentCauserIndex, causerList, setCauserIndex)}

            <Row flexWrap={"wrap"}>
                <StackTraceMessageUi title={currentTrace.title} mappingContext={mappings}/>
            </Row>

            <Divider/>
            <StackTraceElementsUi elements={currentTrace.elements} mappings={mappings}/>
        </Column>
    </WithMappings>
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

function StackTraceMessageUi({title, mappingContext}: { title: StackTraceMessage, mappingContext: MappingContext }) {
    const [open, setOpen] = React.useState(false)
    const mappingMethod = useMappingForName(title.class, mappingContext);
    const text = open ? javaClassFullName(title.class, mappingMethod) : title.class.simpleName;

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

function getTraceElementText(traceElement: RichStackTraceElement, open: boolean, mappings: MappingMethod): string {
    if (typeof traceElement === "number") return `${traceElement} more...`
    if (open) {
        const fileName = javaClassFullName(traceElement.method.class, mappings)
            .removeBeforeLastExclusive(".").removeAfterFirstExclusive("$")
        const inBracketText = traceElement.line.number === undefined ? "Native Method" : `${fileName}:${traceElement.line.number}`
        return javaMethodFullName(traceElement.method, mappings) + ` (${inBracketText})`
    } else {
        const inBracketText = traceElement.line.number === undefined ? "Native Method" : `Line ${traceElement.line.number}`
        return javaMethodSimpleName(traceElement.method, mappings) + ` (${inBracketText})`
    }
}


