import {FullRichStackTraceElement, LoaderType, RichCrashReport} from "crash-parser/src/model/RichCrashReport";
import React, {useState} from "react";
import {Column, Row} from "../../utils/simple/Flex";
import {CrashLeftSide} from "./CrashContextUi";
import {SectionNavigation} from "./SectionNavigation";
import {Text, TextTheme} from "../../utils/simple/Text";
import {StackTraceUi} from "./StackTraceUi";
import {ModListUi} from "./ModListUi";
import {CrashReportSectionUi} from "./CrashReportSectionUi";
import {SimpleDivider} from "../../utils/simple/SimpleDivider";
import {Surface} from "../../utils/simple/Surface";
import {SimpleButton} from "../../utils/simple/SimpleButton";
import {setUrlRaw} from "../../../utils/PageUrl";
import {ScreenSize, useScreenSize} from "../../../utils/Gui";
import {DynamicallyUnderlinedText} from "../../App";
import {Wrap} from "../../utils/simple/SimpleDiv";
import {Section, SectionState, SpecialSection} from "../../../utils/Section";
import {StringMap} from "crash-parser/src/model/CrashReport";
import {ButtonGroup} from "@mui/material";
import {ActiveColor, fadedOutColor, OnBackgroundColor} from "../../Colors";

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

function ForgeExtraInfoSection({report}: {report: RichCrashReport}) {
    const [isTraceSection,setIsTraceSection] = useState(true);
    return <ButtonGroup orientation = "vertical" /*style = {{alignSelf: "start"}}*/>
        <ExtraInfoTypeButton active={isTraceSection} onClick={() => setIsTraceSection(true)} text={"Trace Information"}/>
        <ExtraInfoTypeButton active={!isTraceSection} onClick={() => setIsTraceSection(false)} text={"Mod Information"}/>
        {/*<SimpleButton  backgroundColor={isTraceSection? ActiveColor: undefined}  onClick={() => setIsTraceSection(true)}>*/}
        {/*    <TextTheme>*/}
        {/*        Trace <br/> Information*/}
        {/*    </TextTheme>*/}
        {/*</SimpleButton>*/}
        {/*<SimpleButton backgroundColor={!isTraceSection? ActiveColor: undefined} onClick={() => setIsTraceSection(false)}>*/}
        {/*    <TextTheme>*/}
        {/*        Mod <br/> Information*/}
        {/*    </TextTheme>*/}
        {/*</SimpleButton>*/}
    </ButtonGroup>

    // <Column margin={{top: 10}} width={"max"}>
    //     <Column  alignSelf={"center"}>
    //         <Text text="Forge Extra Info" variant={"h4"} alignSelf={"center"}/>
    //         <SimpleDivider width={"max"}/>
    //     </Column>
    //
    //     {/*{section.details !== undefined && <CrashReportSectionDetails details={section.details}/>}*/}
    //     {/*{section.stackTrace !== undefined && <CrashReportSectionTrace trace={section.stackTrace}/>}*/}
    // </Column>
}

function ExtraInfoTypeButton(props: {active: boolean, onClick: () => void, text: string}) {
    return <SimpleButton backgroundColor={props.active? ActiveColor: undefined} onClick={props.onClick}>
        <Text color = {OnBackgroundColor} text = {props.text}/>
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