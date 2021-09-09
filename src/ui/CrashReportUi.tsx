import React from "react";
import {Column, Row} from "./improvedapi/Flex";
import {CDivider, Spacer, Wrap} from "./improvedapi/Core";
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
            <CrashContextUi context={context}/>
            {/*{CrashContextUi(context)}*/}
            {/*</Wrap>*/}


            <CenterView report={report} activeSectionIndex={activeSectionIndex}/>

            {/*<Wrap width={250}>*/}
            <SectionNavigation sections={sectionNames}
                               activeSection={activeSectionIndex} onActiveSectionChanged={setActiveSectionIndex}/>
            {/*</Wrap>*/}
        </Row>
    </div>


}

function CenterView({report, activeSectionIndex}: { report: RichCrashReport, activeSectionIndex: number }) {
    return <Surface flexGrow={1} margin={{horizontal: 10}} padding={{bottom: 30, top: 5}} height={"fit-content"} >
        <Column alignItems={"center"} flexGrow={1} padding={{horizontal: 50}} width={"max"}>
        <Column alignSelf="center" margin={{bottom: 10}}>
            <Row>
                {/*<Row style = {{width: "100%"}}>*/}
                    <div style = {{width: "150px"}}/>
                    {/*<div style={{width:10000}}/>*/}
                    <Typography variant={"h4"} fontStyle={"italic"} >
                        {report.title}
                    </Typography>
                <div style = {{width: "150px"}}/>

                {/*</Row>*/}
            </Row>


            {/*<Text text= variant="h4"  margin={{horizontal: 150}}/>*/}
            {/*<Divider color={"primary"}></Divider>*/}
            <CDivider backgroundColor={"#9c1a1a"}/>
        </Column>

        <Text text={report.wittyComment} align={"center"} margin={{bottom: 10}}/>
        {
            activeSectionIndex === 0 ?
                <StackTraceUi stackTrace={report.stackTrace}/>
                : activeSectionIndex === 1 ? <ModListUi mods={report.mods}/>
                    // We already use up the 0 and 1 index for the main stack trace and mods, so we need to reduce the index by 2.
                    : <CrashReportSectionUi section = {report.sections[activeSectionIndex - 2]}/>
        }
    </Column>
    </Surface>
}




