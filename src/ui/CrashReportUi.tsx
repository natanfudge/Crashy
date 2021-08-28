import React from "react";
import {Column, Row} from "./improvedapi/Flex";
import {CDivider, Wrap, Spacer} from "./improvedapi/Core";
import {Mod, RichCrashReport, RichCrashReportSection, RichStackTraceElement} from "../model/RichCrashReport";
import {Text} from "./improvedapi/Text";
import {errorColor} from "./App";
import {CrashContextUi} from "./CrashContextUi";
import {SectionNavigation} from "./SectionNavigation";
import {MoreInfoButton, StackTraceElementsUi, StackTraceUi} from "./StackTraceUi";
import {StackTraceElement, StringMap} from "../model/CrashReport";
import {CrashReportSectionUi} from "./CrashReportSectionUi";
import {ModListUi} from "./ModListUi";

export function CrashReportUi({report}: {report: RichCrashReport}) {
    const context = report.context;

    const [activeSectionIndex, setActiveSectionIndex] = React.useState(0)

    const sectionNames = ["Stack Trace", "Mods"]

    report.sections.forEach((section) => sectionNames.push(section.name));

    return <Row margin={{top: 70}}>

        <Wrap width={260} >
            {CrashContextUi(context)}
        </Wrap>

        {CenterView(report, activeSectionIndex)}

        <Wrap width={250} >
            <SectionNavigation sections={sectionNames}
                               activeSection={activeSectionIndex} onActiveSectionChanged={setActiveSectionIndex}/>
        </Wrap>
    </Row>
}

function CenterView(report: RichCrashReport, activeSectionIndex: number) {
    return <Column alignItems={"center"} flexGrow={1} padding={{horizontal: 50}}>
        <Column alignSelf="center" margin={{bottom: 10}}>
            <Text text={report.title} variant="h4" color={errorColor} margin={{horizontal: 150}}/>
            <CDivider width={"max"}/>
        </Column>

        <Text text={report.wittyComment} align={"center"} margin={{bottom: 10}}/>
        {
            activeSectionIndex === 0 ?
                <StackTraceUi stackTrace={report.stackTrace}/>
                : activeSectionIndex === 1 ?
                    ModListUi(report.mods)
                    // We already use up the 0 and 1 index for the main stack trace and mods, so we need to reduce the index by 2.
                    : CrashReportSectionUi(report.sections[activeSectionIndex - 2])
        }
    </Column>;
}




//TODO: add 'Copy Link/Share (mobile)/Modify Visibility/Delete' buttons to the banner
//TODO: add a mappings dropdown

//TODO: add option to create an issue in the mod author's github page instantly, and link to that issue in the crash log page
//TODO: index crashes in google and allow some way to communicate to solve crashes together, then maybe show an official 'solve with:' solution
//TODO: add many 'click to copy' buttons
//TODO: configurable UI that is retained

