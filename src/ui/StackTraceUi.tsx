import {
    ForgeTraceMetadata,
    javaClassFullName,
    javaMethodFullNameName,
    javaMethodSimpleName,
    RichStackTrace,
    RichStackTraceElement,
    StackTraceMessage,
    unfoldRichStackTrace
} from "../model/RichCrashReport";
import {Column, Row} from "./improvedapi/Flex";
import {Text} from "./improvedapi/Text";
import {clickableColor, fadedOutColor, primaryColor} from "./App";
import React from "react";
import {Box, Button, ClickAwayListener, Divider, Popper, Typography} from "@mui/material";
import {Surface} from "./improvedapi/Material";
import {KeyboardArrowDown} from "@mui/icons-material";
import {WithChild} from "./improvedapi/Element";
import {Spacer} from "./improvedapi/Core";


export function StackTraceUi({stackTrace}: { stackTrace: RichStackTrace }) {
    const causerList = unfoldRichStackTrace(stackTrace);
    const [currentCauserIndex, setCauserIndex] = React.useState(0)
    const currentTrace = causerList[currentCauserIndex];

    return <Column alignSelf={"start"}>
        {CausationButtons(currentCauserIndex, causerList, setCauserIndex)}

        <Row flexWrap={"wrap"}>
            {StackTraceMessageUi(currentTrace.message)}
            <Text text={":"} variant="h5"/>
            <Spacer width={5}/>
            <Text  text={currentTrace.message.message}
                  variant={currentTrace.message.message.length > 200 ? "body1" : "h5"}/>
        </Row>

        <Divider/>
        <StackTraceElementsUi elements={currentTrace.elements}/>
    </Column>
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
    return <Button disableRipple={true} variant={"outlined"} size={"small"} onClick={props.onClick}>
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
        }} onClick={isXMore ? undefined : () => {
            setOpen(!open);
        }}/>
        {typeof traceElement !== "number" && traceElement.forgeMetadata && ForgeTraceMetadataUi(traceElement.forgeMetadata)}

    </Row>;
}

function getTraceElementText(traceElement: RichStackTraceElement, open: boolean): string {
    if (typeof traceElement === "number") return `${traceElement} more...`
    const isNativeMethod = traceElement.line.number === undefined;
    if (open) {
        const inBracketText = isNativeMethod ? "Native Method" : `${traceElement.line.file}:${traceElement.line.number}`
        return javaMethodFullNameName(traceElement.method) + ` (${inBracketText})`
    } else {
        const inBracketText = isNativeMethod ? "Native Method" : `Line ${traceElement.line.number}`
        return javaMethodSimpleName(traceElement.method) + ` (${inBracketText})`
    }
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
    const [anchorEl, setAnchorEl] = React.useState<null | Element>(null);

    const handleClick = (event: Element) => {
        setAnchorEl(anchorEl ? null : event);
    };

    const open = Boolean(anchorEl);

    return (
        <div>
            <Row onClick={handleClick}>
                <KeyboardArrowDown style={{filter: "brightness(0.5)"}}/>
            </Row>
            <Popper open={open} anchorEl={anchorEl}>
                <Box>
                    <MoreInfoButtonSurface closePopup={() => setAnchorEl(null)}>
                        {props.children}
                    </MoreInfoButtonSurface>
                </Box>
            </Popper>
        </div>
    );
}

function MoreInfoButtonSurface({closePopup, children}: { closePopup: () => void } & WithChild) {
    return <Surface style={{border: `solid ${primaryColor} 1px`}}>
        <ClickAwayListener onClickAway={() => closePopup()}>
            <div>
                {children}
            </div>
        </ClickAwayListener>
    </Surface>

}