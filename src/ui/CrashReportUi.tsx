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

export function CrashReportUi({report}: { report: RichCrashReport }) {
    const context = report.context;

    const [activeSectionIndex, setActiveSectionIndex] = React.useState(0)

    const sectionNames = ["Stack Trace", "Mods"]

    report.sections.forEach((section) => sectionNames.push(section.name));

    return <div>
        <AppBar>
            <Wrap padding={10}>
                <Typography variant={"h4"}>
                    Crashy
                </Typography>
            </Wrap>

        </AppBar>
        <Row padding={{top: 64}} justifyContent={"space-between"}>

            {/*<Wrap /!*width={260}*!/>*/}
            {CrashContextUi(context)}
            {/*</Wrap>*/}


            {CenterView(report, activeSectionIndex)}


            {/*<Wrap width={250}>*/}
            <SectionNavigation sections={sectionNames}
                               activeSection={activeSectionIndex} onActiveSectionChanged={setActiveSectionIndex}/>
            {/*</Wrap>*/}
        </Row>
    </div>


}

function CenterView(report: RichCrashReport, activeSectionIndex: number) {
    return <Surface flexGrow={1} margin={{horizontal: 10}} padding={{bottom: 30, top: 5}} height={"fit-content"}>
        <Column alignItems={"center"} flexGrow={1} padding={{horizontal: 50}} width={"max"}>
        <Column alignSelf="center" margin={{bottom: 10}}>
            {/*TODO: look at this*/}
            {/*color={errorColor}*/}
            <Typography variant={"h4"} fontStyle={"italic"} marginLeft={"150px"} marginRight={"150px"}>
                {report.title}
            </Typography>
            {/*<Text text= variant="h4"  margin={{horizontal: 150}}/>*/}
            {/*<Divider color={"primary"}></Divider>*/}
            <CDivider backgroundColor={"#9c1a1a"} width={"max"}/>
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
    </Column>
    </Surface>
}


//TODO: add 'Copy Link/Share (mobile)/Modify Visibility/Delete' buttons to the banner
//TODO: add a mappings dropdown

//TODO: add option to create an issue in the mod author's github page instantly, and link to that issue in the crash log page
//TODO: index crashes in google and allow some way to communicate to solve crashes together, then maybe show an official 'solve with:' solution
//TODO: add many 'click to copy' buttons
//TODO: configurable UI that is retained

