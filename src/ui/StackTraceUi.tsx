import {
    ForgeTraceMetadata,
    javaClassFullName, javaMethodFullNameName, javaMethodSimpleName,
    RichCrashReport,
    RichStackTrace,
    RichStackTraceElement, StackTraceMessage,
    unfoldRichStackTrace
} from "../model/RichCrashReport";
import {Column, Row} from "./improvedapi/Flex";
import {Text} from "./improvedapi/Text";
import {clickableColor, errorColor, fadedOutColor} from "./App";
import {CDivider} from "./improvedapi/Core";
import React from "react";
import {Divider, Grow, Popper} from "@material-ui/core";
import {Surface} from "./improvedapi/Material";
import {KeyboardArrowDown} from "@material-ui/icons";
import {StackTraceElement} from "../model/CrashReport";
import {WithChild, WithChildren} from "./improvedapi/Element";




export function StackTraceUi({stackTrace}: { stackTrace: RichStackTrace }) {
    const causerList = unfoldRichStackTrace(stackTrace);
    const [currentCauserIndex, setCauserIndex] = React.useState(0)
    const currentTrace = causerList[currentCauserIndex];

    return <Column alignSelf={"start"}>
        {CausationButtons(currentCauserIndex, causerList, setCauserIndex)}

        <Row flexWrap={"wrap"}>
            {StackTraceMessageUi(currentTrace.message)}
            <Text text={": " + currentTrace.message.message} variant={"h5"}/>
        </Row>

        <Divider/>
        {StackTraceElementsUi(currentTrace.elements)}
    </Column>
}

export function StackTraceElementsUi(elements: RichStackTraceElement[]) {
    return elements.map((traceElement, i) => <StackTraceElementUi key={i} traceElement={traceElement}/>)
}

function CausationButtons(currentCauserIndex: number, causerList: RichStackTrace[], onCauserIndexChanged: (index: number) => void) {
    return <Row>
        <span style={{paddingLeft: 5}}/>
        {currentCauserIndex > 0 && <CausationButton
            text={`Caused: ${causerList[currentCauserIndex - 1].message.class.simpleName}`}
            onClick={() => onCauserIndexChanged(currentCauserIndex - 1)}
        />}
        {currentCauserIndex > 0 && <span style={{paddingLeft: 20}}/>}
        {currentCauserIndex < causerList.length - 1 && <CausationButton
            text={`Caused By: ${causerList[currentCauserIndex + 1].message.class.simpleName}`}
            onClick={() => onCauserIndexChanged(currentCauserIndex + 1)}
        />}
    </Row>;
}
function CausationButton(props: { text: string, onClick: () => void }) {
    return <Surface margin={{right: 20}} padding={{horizontal: 7, vertical: 2}}
                    className={"hoverable"}
                    backgroundColor={"#353535"}
                    width={"max-content"}
                    onClick={props.onClick}>
        <Text color = {clickableColor} text={props.text} variant={"caption"}/>
    </Surface>
}

function StackTraceMessageUi(message: StackTraceMessage) {
    const [open, setOpen] = React.useState(false)
    // const className = open ? undefined : "glow"
    const style = open ? {} : {/*cursor: "pointer",*/ color: "rgb(0 173 239)"}

    const text = open ? javaClassFullName(message.class) : message.class.simpleName;

    return <Text style={style} text={text}
                 onClick={() => setOpen(!open)} variant={"h5"}/>
}

function StackTraceElementUi({traceElement}: { traceElement: RichStackTraceElement }) {
    const [open, setOpen] = React.useState(false)
    const text = typeof traceElement === "number"? traceElement + " more..." : open ?
        javaMethodFullNameName(traceElement.method) + ` (${traceElement.line.file}:${traceElement.line.number})`
        : javaMethodSimpleName(traceElement.method) + ` (Line ${traceElement.line.number})`;

    return <Row margin={{left: 30}}>
        <Text text={"at"} color={fadedOutColor} margin={{right: 10}}/>
        <Text color = {open? undefined: clickableColor} text={text} style={{
            whiteSpace: "pre-wrap",
            wordBreak: "break-word"
        }} onClick={() => {
          if(typeof traceElement !== "number")  setOpen(!open);
        }}/>
        {typeof traceElement !== "number"&& traceElement.forgeMetadata && ForgeTraceMetadataUi(traceElement.forgeMetadata)}

    </Row>;
}

function ForgeTraceMetadataUi(metadata: ForgeTraceMetadata) {
    return <MoreInfoButton>

            <Column padding={10}>
                <Text text={"Forge Metadata"} variant={"h6"}/>
                {metadata.jarFile && <Text text={`File: ${metadata.jarFile}`}/>}
                {metadata.version && <Text text={`Version: ${metadata.version}`}/>}
                {metadata.pluginTransformerReasons.length > 0 && metadata.pluginTransformerReasons.map(reason =>
                    <Text text={`Plugin Transformer Reason: ${reason}`}/>)}
                {metadata.classloadingReasons.length > 0 && metadata.classloadingReasons.map(reason => <Text
                    text={`Class Loading Reason: ${reason}`}/>)}
                {metadata.additionalTransformerData.length > 0 && metadata.additionalTransformerData.map(reason =>
                    <Text text={`Additional Transformer Data: ${reason}`}/>)}
            </Column>
    </MoreInfoButton>
}

export function MoreInfoButton(props: WithChild) {
    const [open, setOpen] = React.useState(false);
    const anchorEl = React.useRef()
    return <div>
        <Row onClick={() => setOpen(!open)}>
            <KeyboardArrowDown innerRef={anchorEl}/>
        </Row>
        <Popper open={open} anchorEl={anchorEl.current} transition>
            {({TransitionProps}) => (
                <Grow {...TransitionProps}>
                    <Surface>
                        {props.children}
                    </Surface>
                </Grow>
            )}
        </Popper>
    </div>
}