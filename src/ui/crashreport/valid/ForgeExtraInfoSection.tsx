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
import {SimpleDivider} from "../../utils/simple/SimpleDivider";
import {Require} from "crash-parser/src/util/Utils";
import {Text, TextTheme} from "../../utils/simple/Text";
import {StackTraceElementUi} from "./StackTraceUi";
import {LazyColumn} from "../../utils/LazyColumn";
import {VisibleSelection} from "../../utils/VisibleSelection";
import {DropdownSelection} from "../../utils/DropdownSelection";
import {EmptyMappings, Mappings} from "../../../mappings/Mappings";

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
            <Spacer flexGrow={1}/>
            {isTraceSection && <DropdownSelection variant={"outlined"}
                                                  index={currentTrace} onIndexChange={setCurrentTrace}
                                                  values={allFei.map(fei => fei.name)}
            />}
        </Row>

        {isTraceSection ? <TraceFeiUi fei={allFei[currentTrace]}/> : <ModsFei report={report}/>}
    </Column>
}



function TraceFeiUi(props: { fei: TraceFei}) {
    //TODO: implement mappings selection here
    const mappings = EmptyMappings;
    return <Column>
        <Spacer height={5}/>
        <SimpleDivider height={1}/>
        <Spacer height={5}/>
        {props.fei.metadata.map((element, i) =>
            <TraceFeiElement key={i} element={element} mappings={mappings}/>)}
    </Column>
}

function TraceFeiElement({element, mappings}: { element: ElementWithFei, mappings: Mappings }) {
    const metadata = element.forgeMetadata;
    return <Column>
        <StackTraceElementUi withMarginLeft={false} traceElement={element} mappings={mappings}/>

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
