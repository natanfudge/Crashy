import {
    CrashReport,
    CrashReportSection,
    CrashReportSectionElement,
    StackTrace,
    StackTraceElement,
    SystemDetails
} from "../model/CrashReport";
import {Divider, Grid, Paper} from "@material-ui/core";
import React, {CSSProperties} from "react";
import JavaLogo from "../media/java-icon.svg"
import MinecraftLogo from "../media/minecraft_cube.svg"
import FabricLogo from "../media/fabric_logo.svg"
import ForgeLogo from "../media/forge_logo.svg"
import WindowsLogo from "../media/windows_logo.svg"
import LinuxLogo from "../media/linux_logo.svg"
import MacosLogo from "../media/macos_logo.svg"
import QuestionMarkIcon from "../media/questionmark_icon_white.svg"
import ClockIcon from "../media/clock_white.svg"
import {Column, Row, Stack} from "./improvedapi/Flex";
import {CButton, Text} from "./ImprovedApi";
import {Surface} from "./improvedapi/Material";
import {Image} from "./improvedapi/Core";
// import AccessTimeIcon from "@material-ui/icons/AccessTo"

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

export function SideInfo(props: { image: string, text: string }) {
    return <Surface margin={{top: 10}}>
        <Row padding={{vertical: 5, horizontal: 10}}>
            <Image src={props.image} margin={{right: 10}} height={30} alt="Icon"/>
            <Text text={props.text} variant="h6"/>
        </Row>
    </Surface>
}

enum Loader {
    Fabric, Forge
}

interface LoaderInfo {
    loader: Loader
    version: string
}

enum OperatingSystem {
    Windows,
    Macos,
    Linux,
    Unknown
}

interface OperatingSystemInfo {
    operatingSystem: OperatingSystem
    name: string
}

function getOperatingSystemIcon(operatingSystem: OperatingSystem): string {
    switch (operatingSystem) {
        case OperatingSystem.Windows:
            return WindowsLogo;
        case OperatingSystem.Linux:
            return LinuxLogo;
        case OperatingSystem.Macos:
            return MacosLogo;
        case OperatingSystem.Unknown:
            return QuestionMarkIcon
    }
}

export function CrashReportUi(report: CrashReport) {
    const loader: LoaderInfo = {
        loader: Loader.Fabric,
        version: "0.7.4"
    }

    const loaderName = loader.loader === Loader.Fabric ? "Fabric Loader " : "Forge ";

    const operatingSystem: OperatingSystemInfo = {
        operatingSystem: OperatingSystem.Windows,
        name: "Windows 11"
    }

    return <Stack margin={{top: 70}}>
        <Column margin={{left: 10}}>
            <SideInfo image={MinecraftLogo} text="1.17.1"/>
            <SideInfo image={loader.loader === Loader.Forge ? ForgeLogo : FabricLogo}
                      text={loaderName + loader.version}/>
            <SideInfo image={JavaLogo} text="16"/>
            <SideInfo image={getOperatingSystemIcon(operatingSystem.operatingSystem)}
                      text={operatingSystem.name}/>
            <SideInfo image={ClockIcon} text={report.time}/>
        </Column>


        {/*TODO: make the sections use a sidebar on mobile*/}


        <Column width={"max"} alignItems={"center"} >
            <Column alignSelf="center" margin={{bottom: 10}}>
                <Text text={report.description} variant="h4" color={"error"} margin={{horizontal: 100}}/>
                <Divider style={{width: "100%"}}/>
            </Column>

            <Text text={report.wittyComment} align={"center"} margin={{bottom: 10}}/>
            <StackTraceUi stackTrace={report.stacktrace}/>
        </Column>

    </Stack>


}
//todo: rich stack trace
function StackTraceUi({stackTrace, depth = 0}: { stackTrace: StackTrace, depth?: number }) {
    const [open, setOpen] = React.useState(false);
    const textStyle: CSSProperties = {whiteSpace: "pre-wrap", wordBreak: "break-word", minWidth: 500}
    return <Column padding={{left:300, right: 50}}>
        <Text text={stackTrace.message} variant={"h5"}/>
        <Divider/>
        {stackTrace.trace.map((traceElement) => {
            return <Row margin={{left: 30}} >
                <Text text={"◉"} margin = {{right: 10}}/>
                <Text text={traceElement}  style={{
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                }}/>
            </Row>

        })}
    </Column>
    // <Column>
    //     <Column style={{
    //         marginLeft: depth * 30,
    //         marginTop: 5,
    //         marginBottom: 5,
    //         marginRight: 5
    //     }}>
    //         <CButton onClick={() => setOpen(!open)} style={{border: "2px solid green"}}>
    //             <Text text={stackTrace.message}
    //                   style={textStyle}/>
    //         </CButton>
    //
    //         {open && stackTrace.trace.map((element, index) => {
    //             return <CButton onClick={() => 0} style={{
    //                 marginLeft: 30,
    //                 marginTop: 5,
    //                 marginBottom: 5,
    //                 marginRight: 5
    //             }}>
    //                 <Text key={index} text={element} style={textStyle}/>
    //             </CButton>;
    //         })}
    //     </Column>
    //
    //
    //     {/*When opened, display the child dropdowns*/}
    //     {
    //         open && stackTrace.causedBy &&
    //         <StackTraceUi depth={depth + 1} stackTrace={stackTrace.causedBy}/>
    //     }
    // </Column>

}

function Sections(sections: CrashReportSection[]) {
    return sections.map((section, index) => <Section key={index} section={section}/>)
}

function Section(props: { section: CrashReportSection }) {
    const [open, setOpen] = React.useState(false);


    return (
        <Column style={{paddingTop: 10, width: "100%"}}>
            {/*<Center>*/}
            <CButton onClick={() => setOpen(!open)}
                     style={{width: 'max-content', padding: 20}}>

                <Text text={props.section.title}/>
            </CButton>
            {/*</Center>*/}

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