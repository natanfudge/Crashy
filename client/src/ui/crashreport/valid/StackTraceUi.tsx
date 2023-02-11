import {WithMappings} from "./mappings/MappingsUi";
import {
    MappingContext,
    MappingStrategy,
    useMappingFor,
    useMappingForName
} from "../../../mappings/resolve/MappingStrategy";
import {MappingsController} from "./mappings/MappingsController";
import {SimpleSpan, Text, TextTheme} from "../../../fudge-commons/simple/Text";
import {
    RichCrashReport,
    RichStackTrace,
    RichStackTraceElement,
    StackTraceMessage,
    unfoldRichStackTrace
} from "../../../crash/model/RichCrashReport";
import {Fragment, useState} from "react";
import {ActiveColor, clickableColor, fadedOutColor} from "../../Colors";
import {ClickCallback} from "../../../fudge-commons/simple/GuiTypes";
import {Button, Divider, Typography} from "@mui/material";
import {Column, Row} from "../../../fudge-commons/simple/Flex";
import {JavaClass} from "../../../crash/model/Mappable";

export function StackTraceUi({report}: { report: RichCrashReport }) {
    const causerList = unfoldRichStackTrace(report.stackTrace);
    const [currentCauserIndex, setCauserIndex] = useState(0)
    const currentTrace = causerList[currentCauserIndex];

    const mappingsController = new MappingsController(report)
    const mappings = mappingsController.getContext();

    return <Column width={"max"}>
        <WithMappings controller={mappingsController}>
            <div>
                {causerList.length > 1 && <CausationButtons causerList={causerList}
                                                            mappings={mappings}
                                                            onCauserIndexChanged={setCauserIndex}
                                                            currentCauserIndex={currentCauserIndex}/>}

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

function CausationButtons(props: {
    currentCauserIndex: number,
    causerList: RichStackTrace[],
    onCauserIndexChanged: (index: number) => void,
    mappings: MappingContext
}) {
    return <div  style = {{flexFlow: "wrap", display: "flex", flexDirection: "row"}}>
        {props.causerList.map((causer, i) => {
            const causerClass = props.causerList[i].title.class
            return <CausationButton key = {i} selected={props.currentCauserIndex === i} index={i}
                                    causer={causerClass}
                                    totalAmount={props.causerList.length} mappings={props.mappings}
                                    onClick={() => props.onCauserIndexChanged(i)}/>;
        })}
    </div>
}

function causationButtonPrefix(index: number, totalAmount: number): string {
    switch (index) {
        case 0:
            // First exception
            return "Top-level Exception"
        case 1:
            // The one that caused the first exception
            return "Caused By"
        case totalAmount - 1:
            // Many exceptions, the last one is the root cause
            return "Root Cause"
        case 2:
            // third but not last
            return "Third Exception"
        default:
            // 4th, 5th, etc
            return `${index + 1}th Exception`
    }
}


function CausationButton(props: { causer: JavaClass, mappings: MappingContext, index: number, totalAmount: number, selected: boolean, onClick: ClickCallback }) {
    const mappingMethod = useMappingForName(props.causer, props.mappings)
    const prefix = causationButtonPrefix(props.index, props.totalAmount)
    return <Button style={{
        wordBreak: "break-word",
        margin: 4,
        backgroundColor: props.selected ? ActiveColor : undefined,
        // color: "#ff5e5e"
    }} disableRipple={true} variant={"outlined"} size={"small"}
                   onClick={(e) => props.onClick(e.currentTarget)}>
        {`${prefix}: `}
        <p style = {{color:"#ff5e5e", marginLeft: 4}}>
            {`${props.causer.simpleName(mappingMethod)}`}
        </p>
        {/*<TextTheme color={}>*/}
        {/*    */}
        {/*</TextTheme>*/}

    </Button>
}

function StackTraceMessageUi({title, mappingContext}: { title: StackTraceMessage, mappingContext: MappingContext }) {
    const [open, setOpen] = useState(false)
    const mappingMethod = useMappingForName(title.class, mappingContext);

    const text = open ? title.class.fullName(mappingMethod) : title.class.simpleName(mappingMethod);
    const variant = title.message === undefined || title.message.length < 150 ? "h5" : "body1"
    return <TextTheme wordBreak={"break-word"} variant={variant}>
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
    const [open, setOpen] = useState(false)
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
        return traceElement.method.simpleName(mappings) + ` (${inBracketText})`
    }
}


