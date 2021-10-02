import React, {Fragment, useEffect, useState} from "react";
import {Column, Row} from "./utils/improvedapi/Flex";
import {CDivider, Spacer, Wrap} from "./utils/improvedapi/Core";
import {RichCrashReport} from "../../parser/src/model/RichCrashReport";
import {Text} from "./utils/improvedapi/Text";
import {CrashContextUi} from "./CrashContextUi";
import {SectionNavigation} from "./SectionNavigation";
import {StackTraceUi} from "./StackTraceUi";
import {CrashReportSectionUi} from "./CrashReportSectionUi";
import {ModListUi} from "./ModListUi";
import {LinearProgress, Link, Typography} from "@mui/material";
import {Surface} from "./utils/improvedapi/Material";
import {fadedOutColor} from "./Colors";
import {CrashyServer, GetCrashError, GetCrashResponse} from "./CrashyServer";
import {parseCrashReportRich} from "../../parser/src/parser/CrashReportEnricher";
import {Delete} from "@mui/icons-material";
import {DeleteSection} from "./appbar/DeleteCrash";
import {CrashyAppBar} from "./appbar/CrashyAppBar";
import {getCurrentCrashId, getUrlNoCache} from "./utils/PageUrl";
import {ExpandingButton} from "./utils/Crashy";


export function CrashyCrashReportPage() {
    const [crash, setCrash] = useState<GetCrashResponse | undefined>(undefined)
    //TODO: ok, plan D. store in cookies and intentionally hide it from the user. we have no choice.
    useEffect(() => void CrashyServer.getCrash(getCurrentCrashId(), getUrlNoCache()).then(res => setCrash(res)))

    return <Fragment>
        <CrashyAppBar crash={crash}/>
        <Wrap height={"max"} padding={{top: 60}}>
            <CrashReportPageContent crash={crash}/>
        </Wrap>

    </Fragment>
}


export function ToolbarButtons() {
    return <ExpandingButton  padding={{right: 10}} icon={<Delete/>} sticky>
        <DeleteSection/>
    </ExpandingButton>
}


function NoSuchCrashScreen() {
    return <Column height={"max"} alignItems={"center"}>
        <Spacer flexGrow={1}/>
        <Text color={fadedOutColor} text={"Oops!"} alignSelf={"center"} variant={"h1"}/>
        <Spacer height={20}/>
        <Text color={fadedOutColor} variant={"h6"}
              text={"Looks like there's nothing here. Maybe you got the URL wrong?"}/>
        <Spacer height={20}/>
        <Link underline={"hover"} variant={"h5"} href={"/"}>
            Back to safety
        </Link>
        <Spacer flexGrow={5}/>
    </Column>;
}

function CrashReportPageContent({crash}: { crash: GetCrashResponse | undefined }) {
    if (crash === undefined) {
        return <LinearProgress/>
    } else if (crash === GetCrashError.NoSuchCrashId) {
        return <NoSuchCrashScreen/>
    } else {
        const parsed = parseCrashReportRich(crash)
        document.title = parsed.title
        return <CrashReportUi report={parsed}/>
    }
}

export function CrashReportUi({report}: { report: RichCrashReport }) {
    const context = report.context;

    const [activeSectionIndex, setActiveSectionIndex] = React.useState(0)

    const sectionNames = ["Stack Trace", "Mods"]

    report.sections.forEach(section => sectionNames.push(section.name));

    return <Row padding={{top: 4}} justifyContent={"space-between"}>
        <CrashContextUi context={context}/>
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
    } else if (index === 1) {
        return <ModListUi mods={report.mods}/>
    }// We already use up the 0 and 1 index for the main stack trace and mods, so we need to reduce the index by 2.
    else {
        return <CrashReportSectionUi section={report.sections[index - 2]}/>
    }
}




