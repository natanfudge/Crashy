import {StringMap} from "../model/CrashReport";
import {Divider, Grow, Popper} from "@material-ui/core";
import React from "react";
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
import {Surface} from "./improvedapi/Material";
import {Image} from "./improvedapi/Core";
import {
    ForgeTraceMetadata,
    javaClassFullName,
    javaMethodFullNameName,
    javaMethodSimpleName,
    LoaderType,
    OperatingSystemType,
    RichCrashReport,
    RichStackTrace,
    RichStackTraceElement,
    unfoldRichStackTrace
} from "../model/RichCrashReport";
import {KeyboardArrowDown} from "@material-ui/icons";
import {Text} from "./improvedapi/Text";
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
//TODO: configurable UI that is retained

export function SideInfo(props: { image: string, text: string }) {
    return <Surface margin={{top: 10}}>
        <Row padding={{vertical: 5, horizontal: 10}}>
            <Image src={props.image} margin={{right: 10}} height={30} alt="Icon"/>
            <Text text={props.text} variant="h6"/>
        </Row>
    </Surface>
}


function getOperatingSystemIcon(operatingSystem: OperatingSystemType): string {
    switch (operatingSystem) {
        case OperatingSystemType.Windows:
            return WindowsLogo;
        case OperatingSystemType.Linux:
            return LinuxLogo;
        case OperatingSystemType.Macos:
            return MacosLogo;
        case OperatingSystemType.Unknown:
            return QuestionMarkIcon
    }
}

function formatTime(time: Date) {
    const isPm = time.getHours() > 12
    const hour = isPm ? (time.getHours() - 12) : time.getHours();
    const suffix = isPm ? "PM" : "AM"
    const minutes = time.getMinutes() > 10 ? time.getMinutes().toString() : `0${time.getMinutes()}`
    return `${time.getDate()}/${time.getMonth()}/${time.getFullYear() - 2000} ${hour}:${minutes} ${suffix}`;
}

export function CrashReportUi(report: RichCrashReport) {
    const context = report.context;
    const loaderName = context.loader.type === LoaderType.Fabric ? "Fabric Loader " : "Forge ";
    const displayedTime = formatTime(context.time);

    return <Stack margin={{top: 70}}>
        <Column margin={{left: 10}}>
            <SideInfo image={MinecraftLogo} text="1.17.1"/>
            <SideInfo image={context.loader.type === LoaderType.Forge ? ForgeLogo : FabricLogo}
                      text={loaderName + context.loader.version}/>
            <SideInfo image={JavaLogo} text="16"/>
            <SideInfo image={getOperatingSystemIcon(context.operatingSystem.type)}
                      text={context.operatingSystem.name}/>
            <SideInfo image={ClockIcon} text={displayedTime}/>
        </Column>


        {/*TODO: make the sections use a sidebar on mobile*/}


        <Column width={"max"} alignItems={"center"}>
            <Column alignSelf="center" margin={{bottom: 10}}>
                <Text text={report.title} variant="h4" color={"error"} margin={{horizontal: 100}}/>
                <Divider style={{width: "100%"}}/>
            </Column>

            <Text text={report.wittyComment} align={"center"} margin={{bottom: 10}}/>
            <StackTraceUi stackTrace={report.stackTrace}/>
        </Column>

    </Stack>


}

function StackTraceMessageUi(stackTrace: RichStackTrace) {
    const [open, setOpen] = React.useState(false)
    // const className = open ? undefined : "glow"
    const style = open ? {} : {/*cursor: "pointer",*/ color: "rgb(0 173 239)"}

    const text = open ? javaClassFullName(stackTrace.message.class) : stackTrace.message.class.simpleName;

    return <Row>
        <Text style={style} text={text}
              onClick={() => setOpen(!open)} variant={"h5"}/>
    </Row>
}

function ForgeTraceMetadataUi(metadata: ForgeTraceMetadata) {
    const [open, setOpen] = React.useState(false);
    const anchorEl = React.useRef()
    return <div>
        <Row onClick={() => setOpen(!open)}>
            <KeyboardArrowDown innerRef={anchorEl}/>

        </Row>
        <Popper open={open} anchorEl={anchorEl.current} transition>
            {({TransitionProps}) => (
                <Grow {...TransitionProps}>
                    <Surface>
                        <Column padding={10}>
                            <Text text={"Forge Metadata"} variant={"h6"}/>
                            {metadata.jarFile && <Text text={`File: ${metadata.jarFile}`}/>}
                            {metadata.version && <Text text={`Version: ${metadata.version}`}/>}
                            {metadata.pluginTransformerReasons.length > 0 && metadata.pluginTransformerReasons.map(reason =>
                                <Text text={`Plugin Transformer Reason: ${reason}`}/>)}
                            {metadata.classloadingReasons.length > 0 && metadata.classloadingReasons.map(reason => <Text
                                text={`Class Loading Reason: ${reason}`}/>)}
                            {metadata.additionalTransformerData.length > 0 && metadata.additionalTransformerData.map(reason =>
                                <Text text={`Additional Transformer Data: ${reason}`}/>)}
                        </Column>
                        {/*<Text text={metadata.}/>*/}
                    </Surface>
                </Grow>
            )
            }

        </Popper>
    </div>
}

function StackTraceElementUi({traceElement}: { traceElement: RichStackTraceElement }) {
    const [open, setOpen] = React.useState(false)
    const style = open ? {} : {/*cursor: "pointer",*/ color: "rgb(0 173 239)"}
    const text = open ?
        javaMethodFullNameName(traceElement.method) + ` (${traceElement.line.file}:${traceElement.line.number})`
        : javaMethodSimpleName(traceElement.method) + ` (Line ${traceElement.line.number})`;

    return <Row margin={{left: 30}}>
        <Text text={"at"} color={"textSecondary"} margin={{right: 10}}/>
        <Text text={text} style={{
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            ...style
        }} onClick={() => setOpen(!open)}/>
        {traceElement.forgeMetadata && ForgeTraceMetadataUi(traceElement.forgeMetadata)}

    </Row>;
}

function CausationButton(props: { text: string, onClick: () => void }) {
    return <Surface margin={{right: 20}} padding={{horizontal: 7, vertical: 2}}
                    className={"hoverable"}
                    backgroundColor={"#353535"}
                    width={"max-content"}
                    onClick={props.onClick}>
        <Text style={{color: "rgb(0, 173, 239)"}} text={props.text} variant={"caption"}/>
    </Surface>
}

function StackTraceUi({stackTrace}: { stackTrace: RichStackTrace}) {
    const causerList = unfoldRichStackTrace(stackTrace);
    const [currentCauserIndex, setCauserIndex] = React.useState(0)
    const currentTrace = causerList[currentCauserIndex];

    return <Column padding={{right: 50, left: 300}} alignSelf={"start"}>
        <Row>
            <span style = {{paddingLeft: 5}}/>
            {currentCauserIndex > 0 && <CausationButton
                text={`Caused: ${causerList[currentCauserIndex - 1].message.class.simpleName}`}
                onClick={() => setCauserIndex(currentCauserIndex - 1)}
            />}
            {currentCauserIndex > 0 && <span style = {{paddingLeft: 20}}/>}
            {currentCauserIndex < causerList.length - 1 && <CausationButton
                text={`Caused By: ${causerList[currentCauserIndex + 1].message.class.simpleName}`}
                onClick={() => setCauserIndex(currentCauserIndex + 1)}
            />}
        </Row>


        <Row>
            {StackTraceMessageUi(currentTrace)}
            <Text text={": " + currentTrace.message.message} variant={"h5"}/>
        </Row>

        <Divider/>
        {currentTrace.elements.map((traceElement, i) => <StackTraceElementUi key={i} traceElement={traceElement}/>)}
    </Column>
}

// function Sections(sections: RichCrashReportSection[]) {
//     return sections.map((section, index) => <Section key={index} section={section}/>)
// }
//
// function Section(props: { section: RichCrashReportSection }) {
//     const [open, setOpen] = React.useState(false);
//
//
//     return (
//         <Column style={{paddingTop: 10, width: "100%"}}>
//             {/*<Center>*/}
//             <CButton onClick={() => setOpen(!open)}
//                      style={{width: 'max-content', padding: 20}}>
//
//                 <Text text={props.section.name}/>
//             </CButton>
//             {/*</Center>*/}
//
//             {open && <Column>
//                 {props.section.stackTrace && SectionStackTrace(props.section.stackTrace)}
//                 {props.section.details && SectionDetails(props.section.details)}
//             </Column>
//             }
//
//         </Column>
//     )
// }

function SectionStackTrace(stackTrace: RichStackTraceElement[]) {
    const asTrace: RichStackTrace = {

        // trace: stackTrace,
        message: {
            message: "Stack Trace",
            class: {
                packageName: "TODO",
                simpleName: "TODO"
            }
        },
        elements: stackTrace,
        // message: "Stack Trace",
        causedBy: undefined
    }
    return <StackTraceUi stackTrace={asTrace}/>
}

// function SectionDetails(sectionElements: StringMap) {
//     return objectMap(sectionElements, (key, value, index) => {
//         return <SectionElement key={index} element={{name: key, detail: value}}/>
//     })
// }

function objectMap(object: StringMap, mapFn: (key: string, value: string, index: number) => any) {
    return Object.keys(object).map(function (key, index) {
        return mapFn(key, object[key], index);
    }, {})
}

// function SystemDetailsUi(systemDetails: SystemDetails) {
//     const asSectionDetails = Object.keys(systemDetails.sections).map((key) => {
//         return {name: key, detail: systemDetails.sections[key]}
//     });
//     const asSection: CrashReportSection = {
//         title: "System Details",
//         stacktrace: undefined,
//         details: asSectionDetails
//     }
//     return <Section section={asSection}/>
// }

// function SectionElement(props: { element: { name: string, detail: string } }) {
//     const [open, setOpen] = React.useState(false)
//     return <Grid container direction={"row"} style={{margin: 5}}>
//         <Grid item xs={2}>
//
//         </Grid>
//         <Grid item>
//             <CButton onClick={() => setOpen(!open)}
//                      style={{
//                          padding: 10,
//                          marginRight: 5 /*width: "max-content", /!*left: "40%",*!/ position: "relative"*/
//                      }}>
//                 <Text text={props.element.name}/>
//             </CButton>
//         </Grid>
//         {open && <Grid item>
//             <Paper style={{padding: 10}}>
//                 <Text text={props.element.detail}/>
//             </Paper>
//
//         </Grid>}
//
//     </Grid>
// }