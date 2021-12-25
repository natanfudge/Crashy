import {Column, Row} from "../../utils/simple/Flex";
import {SimpleSpan, Text, TextTheme} from "../../utils/simple/Text";
import React, {Fragment, useState} from "react";
import {Button, ButtonGroup, Divider, IconButton, Typography} from "@mui/material";
import {
    ActiveColor,
    clickableColor,
    fadedOutColor,
    OnBackgroundColor,
    primaryColor,
    secondaryColor
} from "../../Colors";
import {
    javaClassFullName,
    javaMethodFullNameName,
    javaMethodSimpleName,
    RichStackTrace,
    RichStackTraceElement,
    StackTraceMessage,
    unfoldRichStackTrace
} from "crash-parser/src/model/RichCrashReport";
import {Spacer} from "../../utils/simple/SimpleDiv";
import {ClickCallback} from "../../utils/simple/GuiTypes";
import {SimpleDivider} from "../../utils/simple/SimpleDivider";
import {SimpleButton} from "../../utils/simple/SimpleButton";
import {ArrowDropDown, ArrowDropUp} from "@mui/icons-material";


export function StackTraceUi({stackTrace}: { stackTrace: RichStackTrace }) {
    const causerList = unfoldRichStackTrace(stackTrace);
    const [currentCauserIndex, setCauserIndex] = React.useState(0)
    const currentTrace = causerList[currentCauserIndex];

    const [mappingsType, setMappingsType] = React.useState(0)

    return <Row width={"max"}>
        <Column alignSelf={"start"}>
            {CausationButtons(currentCauserIndex, causerList, setCauserIndex)}

            <Row flexWrap={"wrap"}>
                {StackTraceMessageUi(currentTrace.title)}
            </Row>

            <Divider/>
            <StackTraceElementsUi elements={currentTrace.elements}/>
        </Column>
        <Spacer flexGrow={1}/>
        {/*TODO: only show current selection (default yarn), and have a down button that reveals all options*/}
        <ExpandableVisibleSelection values={["Yarn","Official", "Mojang", "Intermediary",  "SRG", "MCP", "Quilt"]}
                                    currentIndex={mappingsType} onValueChange={setMappingsType}/>
    </Row>
}

//TODO: use this for FEI
function ExpandableVisibleSelection({values, currentIndex, onValueChange}:
                                        { values: string[], currentIndex: number, onValueChange: (value: number) => void }) {
    const [showAll, setShowAll] = useState(false);
    return <Column>
        <VisibleSelection showAll={showAll} values={values} currentIndex={currentIndex} onValueChange={onValueChange}/>
        <IconButton style={{padding: 0}} onClick={() => setShowAll((prev) => !prev)}>
            {showAll? <ArrowDropUp fontSize = "large"/> : <ArrowDropDown fontSize={"large"}/>}
        </IconButton>

    </Column>
}

function VisibleSelection({
                              showAll,
                              values,
                              currentIndex,
                              onValueChange
                          }: { showAll: boolean, values: string[], currentIndex: number, onValueChange: (value: number) => void }) {

    if (values.length === 0) throw new Error("A selection must have at least one item")

    const actualValues = showAll ? values : [values[0]]
    return <ButtonGroup orientation="vertical" variant={"outlined"} style={{
        height: "fit-content",
        width: "fit-content",
        borderWidth: 2,
        borderColor: primaryColor,
        borderStyle: "solid",
        borderRadius: 7,
    }}>
        {actualValues.map((value, i) =>
            <Fragment>
                {i > 0 && <SimpleDivider backgroundColor={secondaryColor} margin={{bottom: 0}}/>}
                <VisibleSelectionButton active={i === currentIndex} onClick={() => onValueChange(i)} text={value}/>
            </Fragment>)}
    </ButtonGroup>;
}



function VisibleSelectionButton(props: { active: boolean, onClick: () => void, text: string }) {
    return <SimpleButton style={{/*borderRadius: 7*/}} backgroundColor={props.active ? ActiveColor : undefined}
                         onClick={props.onClick}>
        <Text color={OnBackgroundColor} text={props.text}/>
    </SimpleButton>
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


