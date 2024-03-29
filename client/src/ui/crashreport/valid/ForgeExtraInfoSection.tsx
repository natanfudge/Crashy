
import {WithMappings} from "./mappings/MappingsUi";
import {MappingContext, MappingStrategy} from "../../../mappings/resolve/MappingStrategy";
import {MappingsController, useMappings} from "./mappings/MappingsController";
import {
    FullRichStackTraceElement,
    Mod,
    RichCrashReport,
    RichCrashReportSection,
    RichStackTrace, RichStackTraceElement
} from "../../../crash/model/RichCrashReport";
import {VisibleSelection} from "../../../fudge-commons/components/VisibleSelection";
import {StackTraceElementUi} from "./StackTraceUi";
import {Text, TextTheme} from "../../../fudge-commons/simple/Text";
import {DropdownSelection} from "../../../fudge-commons/components/DropdownSelection";
import {LazyColumn} from "../../../fudge-commons/components/LazyColumn";
import {SimpleDivider} from "../../../fudge-commons/simple/SimpleDivider";
import {Column, Row} from "../../../fudge-commons/simple/Flex";
import {Spacer} from "../../../fudge-commons/simple/SimpleDiv";
import {Fragment, useState} from "react";
import {Require} from "../../../fudge-lib/types/Basic";

type ElementWithFei = Require<FullRichStackTraceElement, "forgeMetadata">;

interface TraceFei {
    name: string
    metadata: ElementWithFei[]
}

export function ForgeExtraInfoSection({report}: { report: RichCrashReport }) {
    const [isTraceSection, setIsTraceSection] = useState(true);
    const [currentTrace, setCurrentTrace] = useState(0);
    const allFei = allTraceFei(report)
    return <Column width="max">
        <Row alignItems={"center"} width={"max"} padding={{bottom: 5}}>
            <VisibleSelection showAll={true} values={["Trace Information", "Mod Information"]}
                              currentIndex={isTraceSection ? 0 : 1} onValueChange={i => setIsTraceSection(i === 0)}/>
            <Spacer flexGrow={1}/>
            {isTraceSection && <DropdownSelection variant={"outlined"}
                                                  index={currentTrace} onIndexChange={setCurrentTrace}
                                                  values={allFei.map(fei => fei.name)}
            />}
        </Row>

        {isTraceSection ? <TraceFeiUi report={report} fei={allFei[currentTrace]}/> : <ModsFei report={report}/>}
    </Column>
}



function TraceFeiUi(props: {report: RichCrashReport, fei: TraceFei}) {
    const mappingsController = useMappings(props.report)
    return <WithMappings controller={mappingsController}>
        <Column style = {{wordBreak: "break-all"}}>
            <Spacer height={5}/>
            <SimpleDivider height={1}/>
            <Spacer height={5}/>
            <LazyColumn data={props.fei.metadata} batchSize={10}
                        childProvider={(element, i) => <TraceFeiElement key={i} element={element} mappings={mappingsController.strategy}/>}/>
        </Column>
    </WithMappings>
}

function TraceFeiElement({element, mappings}: { element: ElementWithFei, mappings: MappingStrategy }) {
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
        {value !== undefined && <Fragment>
            {name}: <b>{value}</b>
        </Fragment>}
    </Fragment>
}

function ListTraceFei({name, value}: { name: string, value: string[] }) {
    return <Fragment>
        {value.length > 0 && <Column>
            {name + ":"}
            <span style={{marginLeft: 10, fontWeight: "bold"}}>
                {value.map((element, i) => <Fragment>
                    {"- " + element}
                    <br/>
                </Fragment> )}

            </span>

        </Column>}
    </Fragment>
}
// {/*<Text key = {i} /*wordBreak={"break-all"}*/ margin={{left: 10}} text={"- " + element}*/}
//     // fontWeight="bold"/>)}
//     {/*<Text text={name + ":"}/>*/}
//     {/*{value.map((element, i) =>*/}
//     {/*    <Text key = {i} /*wordBreak={"break-all"}*/ margin={{left: 10}} text={"- " + element}*/}
//         // fontWeight="bold"/>)}
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
