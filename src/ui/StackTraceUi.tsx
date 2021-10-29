import {
    ForgeTraceMetadata,
    javaClassFullName,
    javaMethodFullNameName,
    javaMethodSimpleName, RichExceptionDetails,
    RichStackTrace,
    RichStackTraceElement,
    StackTraceMessage,
    unfoldRichStackTrace
} from "../../parser/src/model/RichCrashReport";
import {Column, Row} from "./utils/improvedapi/Flex";
import {Text, TextTheme} from "./utils/improvedapi/Text";
import React, {Fragment} from "react";
import {Button, Divider, Typography} from "@mui/material";
import {Spacer} from "./utils/improvedapi/Core";
import {clickableColor, fadedOutColor} from "./Colors";
import {ExpandingButton, MoreInfoButton} from "./utils/Crashy";
import {ClickCallback} from "./utils/improvedapi/Element";
import {CButton} from "./utils/improvedapi/Material";


export function StackTraceUi({stackTrace}: { stackTrace: RichStackTrace }) {
    const causerList = unfoldRichStackTrace(stackTrace);
    const [currentCauserIndex, setCauserIndex] = React.useState(0)
    const currentTrace = causerList[currentCauserIndex];

    return <Column alignSelf={"start"}>
        {CausationButtons(currentCauserIndex, causerList, setCauserIndex)}

        <Row flexWrap={"wrap"}>
            {StackTraceMessageUi(currentTrace.title)}

            {currentTrace.title.message !== undefined && <Fragment>
                <Text text={":"} variant="h5"/>
                <Spacer width={5}/>
                <Text text={currentTrace.title.message}
                      variant={currentTrace.title.message.length > 200 ? "body1" : "h5"}/>
            </Fragment>}
            {currentTrace.details !== undefined && <JVMDetailsButton details = {currentTrace.details}/>}
        </Row>

        <Divider/>
        <StackTraceElementsUi elements={currentTrace.elements}/>
    </Column>
}

export function JVMDetailsButton(props: {details: RichExceptionDetails}) {
    return <ExpandingButton button={handleClick => <CButton margin={{left: 10, bottom: 3}} padding={3} size={"small"} variant={"outlined"}  onClick={handleClick}>
        <TextTheme variant={"subtitle2"}>
            JVM Details
        </TextTheme>
    </CButton>} sticky={false}>
        <TextTheme style={{maxHeight: "500px", maxWidth: "1500px", overflow: "auto", padding: "5px", whiteSpace: "pre"}}>
            {JSON.stringify(props.details,null,2).split("\n").map(line => <Fragment>
                    {line}
                    <br/>
            </Fragment>)}
        </TextTheme>
    </ExpandingButton>

}

export function StackTraceElementsUi({elements}: { elements: RichStackTraceElement[] }) {
    return <div>
        {elements.map((traceElement, i) => <StackTraceElementUi key={i} traceElement={traceElement}/>)}
    </div>
}

function CausationButtons(currentCauserIndex: number, causerList: RichStackTrace[], onCauserIndexChanged: (index: number) => void) {
    return <Row>
        <span style={{paddingLeft: 5}}/>
        {currentCauserIndex > 0 && <CausationButton
            text={`Caused: ${causerList[currentCauserIndex - 1].title.class.simpleName}`}
            onClick={() => onCauserIndexChanged(currentCauserIndex - 1)}
        />}
        {currentCauserIndex > 0 && <span style={{paddingLeft: 20}}/>}
        {currentCauserIndex < causerList.length - 1 && <CausationButton
            text={`Caused By: ${causerList[currentCauserIndex + 1].title.class.simpleName}`}
            onClick={() => onCauserIndexChanged(currentCauserIndex + 1)}
        />}
    </Row>;
}


function CausationButton(props: { text: string, onClick: ClickCallback }) {
    return <Button disableRipple={true} variant={"outlined"} size={"small"} onClick={(e) => props.onClick(e.currentTarget)}>
        {props.text}
    </Button>
}

function StackTraceMessageUi(message: StackTraceMessage) {
    const [open, setOpen] = React.useState(false)
    // const className = open ? undefined : "glow"
    const style = open ? {} : {color: "rgb(0 173 239)"}

    const text = open ? javaClassFullName(message.class) : message.class.simpleName;

    return <Text style={style} text={text}
                 onClick={() => setOpen(!open)} variant={"h5"}/>
}

function StackTraceElementUi({traceElement}: { traceElement: RichStackTraceElement }) {
    const [open, setOpen] = React.useState(false)
    const text = getTraceElementText(traceElement, open)
    const isXMore = typeof traceElement === "number"

    return <Row margin={{left: 30}}>
        <Typography color={fadedOutColor} marginRight={"10px"}>
            at
        </Typography>
        <Text color={open || isXMore ? undefined : clickableColor} text={text} style={{
            whiteSpace: "pre-wrap",
            wordBreak: "break-word"
        }} onClick={isXMore ? undefined : () => setOpen(!open)}/>
        {typeof traceElement !== "number" && traceElement.forgeMetadata &&
            <ForgeTraceMetadataUi metadata={traceElement.forgeMetadata}/>}

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

function ForgeTraceMetadataUi({metadata}: { metadata: ForgeTraceMetadata }) {
    return <MoreInfoButton>

        <Column padding={10}>
            <Text text={"Forge Metadata"} variant={"h6"}/>
            {metadata.jarFile !== undefined && <Text text={`File: ${metadata.jarFile}`}/>}
            {metadata.version !== undefined && <Text text={`Version: ${metadata.version}`}/>}
            {metadata.pluginTransformerReasons.length > 0 && metadata.pluginTransformerReasons.map((reason, i) =>
                <Text key={i} text={`Plugin Transformer Reason: ${reason}`}/>)}
            {metadata.classloadingReasons.length > 0 && metadata.classloadingReasons.map((reason, i) =>
                <Text key={i} text={`Class Loading Reason: ${reason}`}/>)}
            {metadata.additionalTransformerData.length > 0 && metadata.additionalTransformerData.map((reason, i) =>
                <Text key={i} text={`Additional Transformer Data: ${reason}`}/>)}
        </Column>
    </MoreInfoButton>
}

