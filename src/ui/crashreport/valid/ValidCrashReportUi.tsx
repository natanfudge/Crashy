import {RichCrashReport} from "../../../../parser/src/model/RichCrashReport";
import React from "react";
import {Column, Row} from "../../utils/improvedapi/Flex";
import {CrashLeftSide} from "./CrashContextUi";
import {SectionNavigation} from "./SectionNavigation";
import {Surface} from "../../utils/improvedapi/Material";
import {Typography} from "@mui/material";
import {CDivider} from "../../utils/improvedapi/Core";
import {Text} from "../../utils/improvedapi/Text";
import {StackTraceUi} from "./StackTraceUi";
import {ModListUi} from "./ModListUi";
import {CrashReportSectionUi} from "./CrashReportSectionUi";

export function ValidCrashReportUi({report}: { report: RichCrashReport }) {
    // Show what the crash is in previews
    const context = report.context;

    const [activeSectionIndex, setActiveSectionIndex] = React.useState(0)

    const sectionNames = report.mods !== undefined ? ["Stack Trace", "Mods"] : ["Stack Trace"]

    report.sections.forEach(section => sectionNames.push(section.name));

    return <Row height={"max"} padding={{top: 4}} justifyContent={"space-between"}>
        <CrashLeftSide context={context}/>
        <CenterView report={report} activeSectionIndex={activeSectionIndex}/>

        <SectionNavigation sections={sectionNames}
                           activeSection={activeSectionIndex} onActiveSectionChanged={setActiveSectionIndex}/>
    </Row>
}

function CenterView({report, activeSectionIndex}: { report: RichCrashReport, activeSectionIndex: number }) {
    return <Surface flexGrow={1} margin={{horizontal: 10}} padding={{bottom: 30, top: 5}} height={"fit-content"}>
        <Column alignItems={"center"} flexGrow={1} padding={{horizontal: 50}} width={"max"}>
            <Column alignSelf="center" margin={{bottom: 10}}>
                <Row>
                    <div style={{width: "150px"}}/>
                    <Typography variant={"h4"} fontStyle={"italic"}>
                        {report.title}
                    </Typography>
                    <div style={{width: "150px"}}/>

                </Row>

                <CDivider backgroundColor={"#9c1a1a"}/>
            </Column>

            <Text text={report.wittyComment} align={"center"} margin={{bottom: 10}}/>
            <ActiveSection report={report} index={activeSectionIndex}/>
        </Column>
    </Surface>
}

function ActiveSection({report, index}: { report: RichCrashReport, index: number }) {
    if (index === 0) {
        return <StackTraceUi stackTrace={report.stackTrace}/>
    } else if (index === 1 && report.mods !== undefined) {
        return <ModListUi mods={report.mods}/>
    }// We already use up the 0 and 1 index for the main stack trace and mods, so we need to reduce the index by 2.
    else {
        // When there is no mods page, only shift by 1 index (for the StackTraceUi)
        const indexShift = report.mods !== undefined ? 2 : 1;
        return <CrashReportSectionUi section={report.sections[index - indexShift]}/>
    }
}
