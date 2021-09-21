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
import {AppBar, LinearProgress, Link, Typography} from "@mui/material";
import {CButton, CTextField, Surface} from "./improvedapi/Material";
import {crashyTitleColor} from "./Colors";
import {CrashyLogo, ExpandingButton} from "./Utils";
import {CrashLogResponse, CrashyServer, DeleteResult} from "./CrashyServer";
import {parseCrashReportRich} from "../model/CrashReportEnricher";
import {Delete} from "@mui/icons-material";
import {getCurrentCrashId} from "./App";

export function CrashyCrashReportPage({crashId}: { crashId: string }) {
    return <div>
        <AppBar>
            <Row padding={10}>
                <CrashyLogo size={30} margin={{top: 5, right: 10}}/>
                <Text text={"Crashy"} variant={"h4"} color={crashyTitleColor}/>
                <Spacer flexGrow={1}/>
                <ExpandingButton margin={{right: 10}} icon={<Delete/>}>
                    <DeleteSection/>
                </ExpandingButton>
            </Row>
        </AppBar>
        <CrashReportPageContent crashId={crashId}/>
    </div>
}

const CRASH_CODE_HELP_URL = "https://github.com/natanfudge/Crashy/blob/main/Crash%20Code.md"

//TODO: proper 'page doesn't exist screen'
//TODO: make sure that once you delete a page it's obvious it has been deleted
enum DeleteState {
    NoAttemptMade,
    Loading,
    Incorrect,
    Deleted,
    AlreadyDeleted
}

//TODO: write doc for crash help

export function DeleteSection() {
    const [code, setCode] = React.useState("")
    const [deleteState, setDeleteState] = React.useState(DeleteState.NoAttemptMade)

    const label = determineLabel(deleteState)
    return <Column padding={10}>
        <Text text={"Enter the code for this crash to delete it"}/>

        <CTextField label={label ? <Text text={label}/> : undefined} error={deleteState === DeleteState.Incorrect}
                    padding={{vertical: 10}}
                    value={code} onValueChanged={setCode}/>

        <CButton margin={{bottom: 15}} alignSelf={"center"} variant={"contained"} width={"fit-content"}
                 onClick={async () => {
                     setDeleteState(DeleteState.Loading)
                     const newState = await deleteCrash(code)
                     setDeleteState(newState);
                     if (newState === DeleteState.Deleted) {
                         setCode("")
                         //TODO: refresh and such
                     }
                 }}>
            <Text text={"DELETE"}/>
        </CButton>

        <Link target="_blank" rel="noopener" underline={"hover"} variant={"subtitle2"} href={CRASH_CODE_HELP_URL}>
            What is my crash code?
        </Link>
    </Column>
}

function determineLabel(deleteState: DeleteState): string | undefined {
    switch (deleteState) {
        case DeleteState.NoAttemptMade:
        case DeleteState.Deleted:
            return undefined
        case DeleteState.Loading:
            return "Deleting..."
        case DeleteState.Incorrect:
            return "Incorrect code"
        case DeleteState.AlreadyDeleted:
            return "This crash doesn't exist anymore"
    }
}


async function deleteCrash(code: string): Promise<DeleteState.Incorrect | DeleteState.Deleted | DeleteState.AlreadyDeleted> {
    const result = await CrashyServer.deleteCrash(getCurrentCrashId(), code);
    switch (result) {
        case DeleteResult.IncorrectKey:
            return DeleteState.Incorrect
        case DeleteResult.NoSuchCrashId:
            return DeleteState.AlreadyDeleted
        case DeleteResult.Success:
            return DeleteState.Deleted
    }
}

function CrashReportPageContent({crashId}: { crashId: string }) {
    const [crash, setCrash] = useState<CrashLogResponse | undefined>(undefined)
    useEffect(() => {
        CrashyServer.getCrash(crashId).then(res => setCrash(res));
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




