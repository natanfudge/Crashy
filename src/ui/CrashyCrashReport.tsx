import React, {useEffect, useState} from "react";
import {Column, Row} from "./improvedapi/Flex";
import {CDivider, Spacer, Wrap} from "./improvedapi/Core";
import {RichCrashReport} from "../model/RichCrashReport";
import {Text} from "./improvedapi/Text";
import {CrashContextUi} from "./CrashContextUi";
import {SectionNavigation} from "./SectionNavigation";
import {StackTraceUi} from "./StackTraceUi";
import {CrashReportSectionUi} from "./CrashReportSectionUi";
import {ModListUi} from "./ModListUi";
import {AppBar, Button, LinearProgress, TextField, Typography} from "@mui/material";
import {CButton, CIconButton, CTextField, Surface} from "./improvedapi/Material";
import {crashyTitleColor} from "./Colors";
import {CrashyLogo, ExpandingButton} from "./Utils";
import {CrashLogResponse, getCrash} from "./Server";
import {parseCrashReportRich} from "../model/CrashReportEnricher";
import {Delete} from "@mui/icons-material";

export function CrashyCrashReportPage({crashId}: { crashId: string }) {
    return <div>
        <AppBar>
            <Row padding={10}>
                <CrashyLogo size={30} margin={{top: 5, right: 10}}/>
                <Text text={"Crashy"} variant={"h4"} color={crashyTitleColor}/>
                <Spacer flexGrow={1}/>
                <ExpandingButton margin = {{right: 10}} icon={<Delete/>}>
                    <DeleteSection/>
                </ExpandingButton>
            </Row>
        </AppBar>
        <CrashReportPageContent crashId={crashId}/>
    </div>
}

export function DeleteSection() {
    const [code,setCode] = React.useState("")
    return <Column padding = {10}>
        <Text text={"Enter the code for this crash to delete it"}/>
        <CTextField padding = {{vertical: 10}} value = {code} onValueChanged = {setCode}/>
        <CButton alignSelf={"center"} variant={"contained"} width={"fit-content"} onClick = {() => deleteCrash() }>
            <Text text={"DELETE"}/>
        </CButton>
        <CButton onClick={() => window.open()}
    </Column>
}

export function deleteCrash() {

}

function CrashReportPageContent({crashId}: { crashId: string }) {
    const [crash, setCrash] = useState<CrashLogResponse | undefined>(undefined)
    useEffect(() => {
        getCrash(crashId).then(res => setCrash(res));
    }, [crashId])
    if (crash === undefined) {
        return <Wrap margin={{top: 60}}>
            <LinearProgress/>
        </Wrap>
    } else if (crash) {
        const parsed = parseCrashReportRich(crash)
        document.title = parsed.title
        return <CrashReportUi report={parsed}/>
    } else {
        return <Text text={"No such crash ID"}/>
    }

}

export function CrashReportUi({report}: { report: RichCrashReport }) {
    const context = report.context;

    const [activeSectionIndex, setActiveSectionIndex] = React.useState(0)

    const sectionNames = ["Stack Trace", "Mods"]

    report.sections.forEach((section) => sectionNames.push(section.name));

    return <Row padding={{top: 64}} justifyContent={"space-between"}>
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




