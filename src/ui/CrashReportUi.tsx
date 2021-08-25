import React from "react";
import {Column, Row} from "./improvedapi/Flex";
import {CDivider, Parent, Spacer} from "./improvedapi/Core";
import {RichCrashReport, RichCrashReportSection, RichStackTraceElement} from "../model/RichCrashReport";
import {Text} from "./improvedapi/Text";
import {errorColor} from "./App";
import {CrashContextUi} from "./CrashContextUi";
import {SectionNavigation} from "./SectionNavigation";
import {StackTraceElementsUi, StackTraceUi} from "./StackTraceUi";
import {StackTraceElement, StringMap} from "../model/CrashReport";

export function CrashReportUi(report: RichCrashReport) {
    const context = report.context;

    const [activeSectionIndex, setActiveSectionIndex] = React.useState(0)

    const sectionsIncludingMainTrace = ["Stack Trace"]
    //TODO: make "mods" the second option
    report.sections.forEach((section) => sectionsIncludingMainTrace.push(section.name));

    return <Row margin={{top: 70}}>

        <Parent width={250} style={{minWidth: 250}}>
            {CrashContextUi(context)}
        </Parent>

        {CenterView(report, activeSectionIndex)}

        <Parent width={250} style={{minWidth: 250}}>
            <SectionNavigation sections={sectionsIncludingMainTrace}
                               activeSection={activeSectionIndex} onActiveSectionChanged={setActiveSectionIndex}/>
        </Parent>
    </Row>
}

function CenterView(report: RichCrashReport, activeSectionIndex: number) {
    return <Column alignItems={"center"} flexGrow={1} padding={{horizontal: 50}}>
        <Column alignSelf="center" margin={{bottom: 10}}>
            <Text text={report.title} variant="h4" color={errorColor} margin={{horizontal: 100}}/>
            <CDivider width={"max"}/>
        </Column>

        <Text text={report.wittyComment} align={"center"} margin={{bottom: 10}}/>
        {
            activeSectionIndex === 0 ?
                <StackTraceUi stackTrace={report.stackTrace}/>
                // We already use up the 0 index for the main stack trace, so we need to reduce the index by 1.
                : CrashReportSectionUi(report.sections[activeSectionIndex - 1])
        }
    </Column>;
}

function CrashReportSectionUi(section: RichCrashReportSection) {
    return <Column margin={{top: 10}} width={"max"}>
        <Column width={300} alignSelf={"center"}>
            <Text text={section.name} variant={"h4"} alignSelf={"center"}/>
            <CDivider width={"max"}/>
        </Column>

        {CrashReportSectionDetails(section.details)}

        <Column alignSelf={"start"}>
            {
                section.stackTrace && CrashReportSectionTrace(section.stackTrace)
            }
        </Column>
    </Column>
}

function CrashReportSectionTrace(trace: RichStackTraceElement[]) {
    return [
        <Spacer height={20}/>,
        <Text text={"Stack Trace"} variant={"h5"}/>,
        <CDivider width={"max"}/>,
        StackTraceElementsUi(trace)
    ]
}

function CrashReportSectionDetails(details: StringMap) {
    return <Row>
        <Column>
            {objectMap(details, (name, _) =>
                <Text text={name} color={"#cbebe9"} style={{fontWeight: "bold"}}/>
            )}
        </Column>
        <Spacer width = {5}/>
        <CDivider height={"max"} width={1}/>
        <Spacer width = {10}/>
        <Column>
            {objectMap(details, (_, detail) =>
                <Text text={detail}/>
            )}
        </Column>
    </Row>
}

function objectMap(object: StringMap, mapFn: (key: string, value: string, index: number) => any) {
    return Object.keys(object).map(function (key, index) {
        return mapFn(key, object[key], index);
    }, {})
}

//TODO: make sure we display information in the most efficient way possible:
// - 0-clicks:
//  - Java Version
//  - Minecraft Version
//  - Forge/Fabric
//  - Time
//  - Main Crash Message
//  - Main Stack Trace (but in a simplified format, click to expand)
//  - Operating System
//  - Witty message
// - 1-clicks:
//  - Mod List
//  - System Details names
//  - Section List
// - 2-clicks:
//  - System Detail details
//  - Section Detail Stack Trace
//  - Section Detail names + details

//TODO: i think i want a server sided parser
//TODO: add 'Copy Link/Share (mobile)/Modify Visibility/Delete' buttons to the banner
//TODO: cleanup the way stacktrace lines are displayed...
//TODO: add a 'raw' button
//TODO: add a mappings dropdown

//TODO: add option to create an issue in the mod author's github page instantly, and link to that issue in the crash log page
//TODO: index crashes in google and allow some way to communicate to solve crashes together, then maybe show an official 'solve with:' solution
//TODO: add many 'click to copy' buttons
//TODO: configurable UI that is retained

