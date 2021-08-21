import {
    CrashReport,
    CrashReportSection,
    CrashReportSectionElement,
    StackTrace,
    StackTraceElement,
    SystemDetails
} from "../model/CrashReport";
import {CButton, Center, Column, Text} from "./ImprovedApi";
import {Card, Container, Grid, Paper} from "@material-ui/core";
import React, {CSSProperties} from "react";

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
export function CrashReportUi(report: CrashReport) {
    return <div>
        {/*todo make the time be above the other stuff on mobile*/}
        <Card style={{marginLeft: 10, width: "max-content", position: "absolute"}}>
            <Text text={report.time} variant="h6" style={{padding: 10}}/>
        </Card>
        {/*TODO: make the sections use a sidebar on mobile*/}

        <Container>
            <Center>
                <Card style={{width: "max-content", margin: 10, paddingLeft: 20, paddingRight: 20,}}>
                    <Text text={report.description} variant="h6" style={{padding: 10}}
                          align={"center"}/>
                </Card>
            </Center>

            <Text text={report.wittyComment} align={"center"}/>
            <StackTraceUi stackTrace={report.stacktrace}/>
            {SystemDetailsUi(report.systemDetails)}
            <Center>
                {Sections(report.sections)}
            </Center>

        </Container>
    </div>
}

function StackTraceUi({stackTrace, depth = 0}: { stackTrace: StackTrace, depth?: number }) {
    const [open, setOpen] = React.useState(false);
    const textStyle: CSSProperties = {whiteSpace: "pre-wrap", wordBreak: "break-word", minWidth: 500}
    return (
        <Column>
            <Column style={{
                marginLeft: depth * 30,
                marginTop: 5,
                marginBottom: 5,
                marginRight: 5
            }}>
                <CButton onClick={() => setOpen(!open)} style={{border: "2px solid green"}}>
                    <Text text={stackTrace.message}
                          style={textStyle}/>
                </CButton>

                {open && stackTrace.trace.map((element, index) => {
                    return <CButton onClick={() => 0} style={{
                        marginLeft:  30,
                        marginTop: 5,
                        marginBottom: 5,
                        marginRight: 5
                    }}>
                        <Text key={index} text={element} style={textStyle}/>
                    </CButton>;
                })}
            </Column>


            {/*When opened, display the child dropdowns*/}
            {
                open && stackTrace.causedBy &&
                <StackTraceUi depth={depth + 1} stackTrace={stackTrace.causedBy}/>
            }
        </Column>
    )
}

function Sections(sections: CrashReportSection[]) {
    return sections.map((section, index) => <Section key={index} section={section}/>)
}

function Section(props: { section: CrashReportSection }) {
    const [open, setOpen] = React.useState(false);


    return (
        <Column style={{paddingTop: 10, width: "100%"}}>
            <Center>
                <CButton onClick={() => setOpen(!open)}
                         style={{width: 'max-content', padding: 20}}>

                    <Text text={props.section.title}/>
                </CButton>
            </Center>

            {open && <Column>
                {props.section.stacktrace && SectionStackTrace(props.section.stacktrace)}
                {props.section.details && SectionDetails(props.section.details)}
            </Column>
            }

        </Column>
    )
}

function SectionStackTrace(stackTrace: StackTraceElement[]) {
    const asTrace: StackTrace = {
        trace: stackTrace,
        message: "Stack Trace",
        causedBy: undefined
    }
    return <StackTraceUi stackTrace={asTrace}/>
}

function SectionDetails(sectionElements: CrashReportSectionElement[]) {
    return sectionElements.map((element, index) => {
        return <SectionElement key={index} element={element}/>
    })
}

function SystemDetailsUi(systemDetails: SystemDetails) {
    const asSectionDetails = Object.keys(systemDetails.sections).map((key) => {
        return {name: key, detail: systemDetails.sections[key]}
    });
    const asSection: CrashReportSection = {
        title: "System Details",
        stacktrace: undefined,
        details: asSectionDetails
    }
    return <Section section={asSection}/>
}

function SectionElement(props: { element: CrashReportSectionElement }) {
    const [open, setOpen] = React.useState(false)
    return <Grid container direction={"row"} style={{margin: 5}}>
        <Grid item xs={2}>

        </Grid>
        <Grid item>
            <CButton onClick={() => setOpen(!open)}
                     style={{
                         padding: 10,
                         marginRight: 5 /*width: "max-content", /!*left: "40%",*!/ position: "relative"*/
                     }}>
                <Text text={props.element.name}/>
            </CButton>
        </Grid>
        {open && <Grid item>
            <Paper style={{padding: 10}}>
                <Text text={props.element.detail}/>
            </Paper>

        </Grid>}

    </Grid>
}