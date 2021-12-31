import {
    FullRichStackTraceElement,
    Mod,
    RichCrashReport,
    RichCrashReportSection,
    RichStackTrace,
    RichStackTraceElement
} from "crash-parser/src/model/RichCrashReport";
import React, {Fragment, useState} from "react";
import {Column, Row} from "../../utils/simple/Flex";
import {Spacer} from "../../utils/simple/SimpleDiv";
import {FormControl, MenuItem, Select} from "@mui/material";
import {SimpleDivider} from "../../utils/simple/SimpleDivider";
import {Require} from "crash-parser/src/util/Utils";
import {Text, TextTheme} from "../../utils/simple/Text";
import {StackTraceElementUi} from "./StackTraceUi";
import {LazyColumn} from "../../utils/LazyColumn";
import {VisibleSelection} from "../../utils/VisibleSelection";
import {DropdownSelection} from "../../utils/DropdownSelection";

type ElementWithFei = Require<FullRichStackTraceElement, "forgeMetadata">;

interface TraceFei {
    name: string
    metadata: ElementWithFei[]
}

export function ForgeExtraInfoSection({report}: { report: RichCrashReport }) {
    const [isTraceSection, setIsTraceSection] = useState(true);
    const [currentTrace, setCurrentTrace] = React.useState(0);
    const allFei = allTraceFei(report)
    return <Column width="max">
        <Row alignItems={"center"} width={"max"}>
            <VisibleSelection showAll={true} values={["Trace Information", "Mod Information"]}
                              currentIndex={isTraceSection ? 0 : 1} onValueChange={i => setIsTraceSection(i === 0)}/>
            {/*<FeiSelection isTraceSection={isTraceSection} setIsTraceSection={setIsTraceSection}/>*/}
            {/*{FeiSelection(isTraceSection, setIsTraceSection)}*/}
            <Spacer flexGrow={1}/>
            {isTraceSection && <DropdownSelection variant={"outlined"}
                index={currentTrace} onIndexChange={setCurrentTrace} values={allFei.map(fei => fei.name)}
            />}
        </Row>

        {isTraceSection ? <TraceFei fei={allFei[currentTrace]}/> : <ModsFei report={report}/>}
    </Column>
}

// function TraceFeiSelection({fei, currentTrace, setCurrentTrace}:
//                                { fei: TraceFei[], currentTrace: number, setCurrentTrace: (trace: number) => void }) {
//     return <FormControl style={{minWidth: "fit-content", maxWidth: "fit-content"}} fullWidth>
//         <Select
//             variant={'outlined'}
//             value={fei[currentTrace].name}
//             onChange={(e) => setCurrentTrace(fei.findIndex(fei => fei.name === e.target.value))}
//         >
//             {fei.map(fei => <MenuItem key={fei.name} value={fei.name}>{fei.name}</MenuItem>)}
//         </Select>
//     </FormControl>
// }


// function FeiSelection({
//                           isTraceSection,
//                           setIsTraceSection
//                       }: { isTraceSection: boolean, setIsTraceSection: (prevState: boolean) => void }) {
//     return <ButtonGroup orientation="vertical" variant={"outlined"} style={{
//         alignSelf: "center",
//         width: "fit-content",
//         borderWidth: 2,
//         borderColor: primaryColor,
//         borderStyle: "solid",
//         borderRadius: 7,
//         maxWidth: "40%"
//     }}>
//         <ExtraInfoTypeButton active={isTraceSection} onClick={() => setIsTraceSection(true)}
//                              text={"Trace Information"}/>
//         <SimpleDivider backgroundColor={secondaryColor}/>
//         <ExtraInfoTypeButton active={!isTraceSection} onClick={() => setIsTraceSection(false)}
//                              text={"Mod Information"}/>
//
//     </ButtonGroup>;
// }
//
// function ExtraInfoTypeButton(props: { active: boolean, onClick: () => void, text: string }) {
//     return <SimpleButton style={{borderRadius: 7}} backgroundColor={props.active ? ActiveColor : undefined}
//                          onClick={props.onClick}>
//         <Text color={OnBackgroundColor} text={props.text}/>
//     </SimpleButton>
// }

function TraceFei({fei}: { fei: TraceFei }) {
    return <Column>
        <Spacer height={5}/>
        <SimpleDivider height={1}/>
        <Spacer height={5}/>
        {fei.metadata.map((element, i) => <TraceFeiElement key={i} element={element}/>)}
    </Column>
}

function TraceFeiElement({element}: { element: ElementWithFei }) {
    const metadata = element.forgeMetadata;
    return <Column>
        <StackTraceElementUi withMarginLeft={false} traceElement={element}/>

        <Column margin={{left: 20}}>
            <KeyValueTraceFei name={"Jar File"} value={metadata.jarFile}/>
            <KeyValueTraceFei name={"Version"} value={metadata.version}/>
            <ListTraceFei name={"Classloading Reasons"} value={metadata.classloadingReasons}/>
            <ListTraceFei name={"Plugin Transformer Reasons"} value={metadata.pluginTransformerReasons}/>
            <ListTraceFei name={"Additional Transforme Reasons"} value={metadata.additionalTransformerData}/>
        </Column>

    </Column>
}

function KeyValueTraceFei({name, value}: { name: string, value: string | undefined }) {
    return <Fragment>
        {value !== undefined && <TextTheme wordBreak={"break-word"}>
            {name}: <b>{value}</b>
        </TextTheme>}
    </Fragment>
}

function ListTraceFei({name, value}: { name: string, value: string[] }) {
    return <Fragment>
        {value.length > 0 && <Column>
            <Text text={name + ":"}/>
            {value.map(element => <Text wordBreak={"break-all"} margin={{left: 10}} text={"- " + element}
                                        fontWeight="bold"/>)}
        </Column>}
    </Fragment>
}

function ModsFei({report}: { report: RichCrashReport }) {
    return <LazyColumn data={report.mods!}
                       childProvider={(mod, i) => <ModFei key={i} mod={mod}/>}/>
}

function ModFei({mod}: { mod: Mod }) {
    const metadata = mod.forgeMetadata;
    return <Column alignItems={"center"}>
        <Text wordBreak={"break-all"} fontWeight={"bold"} text={mod.name}/>
        <SimpleDivider width={{percent: 50}} height={1}/>
        {metadata !== undefined && <Fragment>
            <Text wordBreak="break-all" text={metadata.file}/>
            <Text wordBreak="break-all" text={metadata.signature}/>
            <Text wordBreak="break-all" text={metadata.completeness}/>
        </Fragment>}
        <Spacer height={10}/>
    </Column>
}


function allTraceFei(report: RichCrashReport): TraceFei[] {
    return [
        mainStackTraceAsFei(report.stackTrace),
        ...(report.sections.map(section => sectionTraceAsFei(section)).filter(fei => fei !== undefined) as TraceFei[])
    ]
}

function mainStackTraceAsFei(trace: RichStackTrace): TraceFei {
    return {
        name: "Primary Stack Trace",
        metadata: onlyWithFei(trace.elements)
    };
}

function sectionTraceAsFei(section: RichCrashReportSection): TraceFei | undefined {
    if (section.stackTrace === undefined) return undefined;
    return {
        name: section.name,
        metadata: onlyWithFei(section.stackTrace)
    };
}

function onlyWithFei(elements: RichStackTraceElement[]): ElementWithFei[] {
    return elements.filter(element => typeof element !== "number" && element.forgeMetadata !== undefined) as ElementWithFei[];
}