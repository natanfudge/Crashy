import {
    FullRichStackTraceElement,
    LoaderType,
    RichCrashReport,
    RichCrashReportSection,
    RichStackTrace,
    RichStackTraceElement
} from "crash-parser/src/model/RichCrashReport";
import React, {useState} from "react";
import {Column, Row} from "../../utils/simple/Flex";
import {CrashLeftSide} from "./CrashContextUi";
import {SectionNavigation} from "./SectionNavigation";
import {Text} from "../../utils/simple/Text";
import {StackTraceUi} from "./StackTraceUi";
import {ModListUi} from "./ModListUi";
import {CrashReportSectionUi} from "./CrashReportSectionUi";
import {SimpleDivider} from "../../utils/simple/SimpleDivider";
import {Surface} from "../../utils/simple/Surface";
import {SimpleButton} from "../../utils/simple/SimpleButton";
import {ScreenSize, useScreenSize} from "../../../utils/Gui";
import {DynamicallyUnderlinedText} from "../../App";
import {Spacer, Wrap} from "../../utils/simple/SimpleDiv";
import {Section, SectionState, SpecialSection} from "../../../utils/Section";
import {ButtonGroup, FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import {ActiveColor, OnBackgroundColor, primaryColor, secondaryColor} from "../../Colors";
import {Require} from "crash-parser/src/util/Utils";

export interface ValidCrashProps {
    report: RichCrashReport
    sectionState: SectionState
}

export function sectionNavigationOf(report: RichCrashReport): Section[] {
    const sections: Section[] = [SpecialSection.StackTrace];
    if (report.mods !== undefined) sections.push(SpecialSection.Mods);

    report.sections.forEach((section, i) => sections.push({name: section.name, index: i}));
    if (report.context.loader.type === LoaderType.Forge) sections.push(SpecialSection.ForgeInfo);
    return sections;
}

export function ValidCrashReportUi({report, sectionState}: ValidCrashProps) {
    // Show what the crash is in previews
    const context = report.context;

    const screen = useScreenSize();
    const isPhone = screen.isPhone;
    return <Row height={"max"} padding={{top: 4}} justifyContent={"space-between"}>
        {!isPhone && <CrashLeftSide context={context}/>}
        <CenterView screen={screen} report={report} sectionState={sectionState}/>

        {!isPhone && <SectionNavigation sections={sectionNavigationOf(report)} sectionState={sectionState}/>}
    </Row>
}

function CenterView({
                        report,
                        sectionState,
                        screen
                    }: ValidCrashProps & { screen: ScreenSize }) {
    return <Surface flexGrow={1} margin={{horizontal: 10}} padding={{bottom: 30, top: 5}} height={"fit-content"}>
        <Row>
            {/*TODO: restore raw button in portrait somehow, also there is no space for this in mobile, even in landscape, */}
            {/*TODO: maybe move it to left view? there is space there even in mobile landscape*/}
            {/*todo: IDK maybe add more padding or move it to the right or make it a real element*/}
            {/*{!screen.isPhone && <SimpleButton margin={{top: 3, left: 10}} variant={"outlined"} position="absolute"*/}
            {/*                                  onClick={() => setUrlRaw(true)}>*/}
            {/*    <Text text="Raw"/>*/}
            {/*</SimpleButton>}*/}
            <Column alignItems={"center"} flexGrow={1} padding={{horizontal: screen.isPortrait ? 5 : 50}} width={"max"}>
                <Wrap padding={{horizontal: 5}} width={"max"}>
                    <DynamicallyUnderlinedText text={report.title} largerBy={150}>
                        <SimpleDivider backgroundColor={"#9c1a1a"}/>
                    </DynamicallyUnderlinedText>
                </Wrap>

                <Text text={report.wittyComment} align={"center"} margin={{bottom: 10}}/>
                <ActiveSection report={report} section={sectionState.activeSection}/>
            </Column>
        </Row>
    </Surface>
}


function ActiveSection({report, section}: { report: RichCrashReport, section: Section }) {
    if (section === SpecialSection.StackTrace) {
        return <StackTraceUi stackTrace={report.stackTrace}/>
    } else if (section === SpecialSection.Mods) {
        return <ModListUi mods={report.mods!}/>
    } else if (section === SpecialSection.ForgeInfo) {
        return <ForgeExtraInfoSection report={report}/>
    } else {
        return <CrashReportSectionUi section={report.sections[section.index]}/>
    }
}

function FeiSelection({
                          isTraceSection,
                          setIsTraceSection
                      }: { isTraceSection: boolean, setIsTraceSection: (prevState: boolean) => void }) {
    return <ButtonGroup orientation="vertical" variant={"outlined"} style={{
        alignSelf: "center",
        width: "fit-content",
        borderWidth: 2,
        borderColor: primaryColor,
        borderStyle: "solid",
        borderRadius: 7
    }} /*style = {{alignSelf: "start"}}*/>
        <ExtraInfoTypeButton active={isTraceSection} onClick={() => setIsTraceSection(true)}
                             text={"Trace Information"}/>
        <SimpleDivider backgroundColor={secondaryColor}/>
        <ExtraInfoTypeButton active={!isTraceSection} onClick={() => setIsTraceSection(false)}
                             text={"Mod Information"}/>

    </ButtonGroup>;
}

function ForgeExtraInfoSection({report}: { report: RichCrashReport }) {
    const [isTraceSection, setIsTraceSection] = useState(true);
    return <Row alignItems={"center"} width={"max"}>
        <FeiSelection isTraceSection={isTraceSection} setIsTraceSection={setIsTraceSection}/>
        {/*{FeiSelection(isTraceSection, setIsTraceSection)}*/}
        <Spacer width={20}/>
        {isTraceSection ? <TraceFeiUi fei={allTraceFei(report)}/> : <ModFei report={report}/>}
    </Row>
}

function allTraceFei(report: RichCrashReport): TraceFei[] {
    return [
        mainStackTraceAsFei(report.stackTrace),
        ...(report.sections.map(section => sectionTraceAsFei(section)).filter(fei => fei !== undefined) as TraceFei[])
    ]
}

type ElementWithFei = Require<FullRichStackTraceElement, "forgeMetadata">;

interface TraceFei {
    name: string
    metadata: ElementWithFei[]
}

function mainStackTraceAsFei(trace: RichStackTrace): TraceFei {
    return {
        name: "Primary Stack Trace",
        metadata: onlyWithFei(trace.elements)
    };
}

function sectionTraceAsFei(section: RichCrashReportSection): TraceFei | undefined {
    if (section.stackTrace === undefined) return undefined;
    return {
        name: section.name,
        metadata: onlyWithFei(section.stackTrace)
    };
}

function onlyWithFei(elements: RichStackTraceElement[]): ElementWithFei[] {
    return elements.filter(element => typeof element !== "number" && element.forgeMetadata !== undefined) as ElementWithFei[];
}

function TraceFeiUi({fei}: { fei: TraceFei[] }) {
    // type ElementWithFei = Require<FullRichStackTraceElement, "forgeMetadata">;
    // type SectionWithFei = Replace<ElementWithFei, "forgeMetadata", ElementWithFei[]>
    // const richElements: ElementWithFei = report.stackTrace.elements
    //     .filter((element) => typeof element !== "number" && element.forgeMetadata !== null) as ElementWithFei;
    // // const pluginTransformerReasons = ele
    //
    // const sectionTraces: Record<string, StackTraceElement[]> = {
    //     "Primary Stack Trace": report.stackTrace.elements,
    //     ...Object.fromEntries(richElements.map((section) => [section.name, section.stackTrace]))
    // }

    const [currentTrace, setCurrentTrace] = React.useState(0);
    // return <Column alignSelf={"start"}>
     return   <FormControl style = {{minWidth:"fit-content", maxWidth: "fit-content"}} fullWidth>
            {/*<InputLabel id="demo-simple-select-label">Stack Trace</InputLabel>*/}
            <Select
                variant={'outlined'}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={fei[currentTrace].name}
                onChange={(e) => setCurrentTrace(fei.findIndex(fei => fei.name === e.target.value))}
            >
                {fei.map((fei, index) => <MenuItem key={fei.name} value={fei.name}>{fei.name}</MenuItem>)}
                {/*{Object.values(ForgeVersion).map((version) => <MenuItem key={version}*/}
                {/*                                                        value={version}>{version}</MenuItem>)}*/}
            </Select>
        </FormControl>
        {/*{richElements.map(element => <Column>*/}
        {/*        <StackTraceElementUi traceElement={element}/>*/}
        {/*        /!*<Text whiteSpace={"pre"} text={element.forgeMetadata.pluginTransformerReasons.join("\n")}/>*!/*/}
        {/*    </Column>*/}
        {/*)}*/}
    // </Column>
}

function ModFei({report}: { report: RichCrashReport }) {
    return <Column>
        {/*{report.mods.map(mod => <Text text={mod.forgeMetadata.pluginTransformerReasons.join("\n")}/>)}*/}
    </Column>
}

function ExtraInfoTypeButton(props: { active: boolean, onClick: () => void, text: string }) {
    return <SimpleButton style={{borderRadius: 7}} backgroundColor={props.active ? ActiveColor : undefined}
                         onClick={props.onClick}>
        <Text color={OnBackgroundColor} text={props.text}/>
    </SimpleButton>
}

// interface ForgeExtraInfo {
//     stacktraceInfo
// }
// type FEIStacktracePage = StringMap
// type ForgeExtraInfo = Record<string,ForgeExtraInfoPage>
// function aggregateForgeExtraInfo(report: RichCrashReport) {
//     const info = [""]
//
// }