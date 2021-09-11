import React from "react";
import {Column, Row} from "./improvedapi/Flex";
import {CDivider, Wrap} from "./improvedapi/Core";
import {RichCrashReport} from "../model/RichCrashReport";
import {Text} from "./improvedapi/Text";
import {CrashContextUi} from "./CrashContextUi";
import {SectionNavigation} from "./SectionNavigation";
import {StackTraceUi} from "./StackTraceUi";
import {CrashReportSectionUi} from "./CrashReportSectionUi";
import {ModListUi} from "./ModListUi";
import {AppBar, Typography} from "@mui/material";
import {Surface} from "./improvedapi/Material";
import {crashyTitleColor} from "./Colors";
import {CrashyLogo} from "./Utils";

export function CrashReportUi({report}: { report: RichCrashReport }) {
    const context = report.context;

    const [activeSectionIndex, setActiveSectionIndex] = React.useState(0)

    const sectionNames = ["Stack Trace", "Mods"]

    report.sections.forEach((section) => sectionNames.push(section.name));

    return <div>
        <AppBar>
            <Row padding={10}>
                <CrashyLogo size={30 } margin={{top: 5, right: 10}}/>
                <Text text={"Crashy"} variant={"h4"} color={crashyTitleColor}/>
            </Row>

        </AppBar>
        <Row padding={{top: 64}} justifyContent={"space-between"}>
            <CrashContextUi context={context}/>
            <CenterView report={report} activeSectionIndex={activeSectionIndex}/>

            <SectionNavigation sections={sectionNames}
                               activeSection={activeSectionIndex} onActiveSectionChanged={setActiveSectionIndex}/>
        </Row>
    </div>


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
            {
                activeSectionIndex === 0 ?
                    <StackTraceUi stackTrace={report.stackTrace}/>
                    : activeSectionIndex === 1 ? <ModListUi mods={report.mods}/>
                        // We already use up the 0 and 1 index for the main stack trace and mods, so we need to reduce the index by 2.
                        : <CrashReportSectionUi section={report.sections[activeSectionIndex - 2]}/>
            }
        </Column>
    </Surface>
}




