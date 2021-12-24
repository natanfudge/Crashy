import {
    FullRichStackTraceElement,
    LoaderType, Mod,
    RichCrashReport,
    RichCrashReportSection,
    RichStackTrace,
    RichStackTraceElement
} from "crash-parser/src/model/RichCrashReport";
import React, {Fragment, RefObject, useEffect, useLayoutEffect, useRef, useState} from "react";
import {Column, Row} from "../../utils/simple/Flex";
import {CrashLeftSide} from "./CrashContextUi";
import {SectionNavigation} from "./SectionNavigation";
import {Text, TextTheme} from "../../utils/simple/Text";
import {StackTraceElementUi, StackTraceUi} from "./StackTraceUi";
import {ModListUi} from "./ModListUi";
import {CrashReportSectionUi} from "./CrashReportSectionUi";
import {SimpleDivider} from "../../utils/simple/SimpleDivider";
import {Surface} from "../../utils/simple/Surface";
import {SimpleButton} from "../../utils/simple/SimpleButton";
import {ScreenSize, useScreenSize} from "../../../utils/Gui";
import {Spacer, Wrap} from "../../utils/simple/SimpleDiv";
import {Section, SectionState, SpecialSection} from "../../../utils/Section";
import {ButtonGroup, FormControl, MenuItem, Select} from "@mui/material";
import {ActiveColor, OnBackgroundColor, primaryColor, secondaryColor} from "../../Colors";
import {Require} from "crash-parser/src/util/Utils";
import {WithChild} from "../../utils/simple/SimpleElementProps";
import {LazyColumn} from "../../utils/LazyColumn";

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

function DynamicallyUnderlinedText(props: {
    text: string,
    largerBy: number
} & WithChild) {
    const leftSpaceRef = useRef<HTMLDivElement>(null);
    const rightSpaceRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLSpanElement>(null)
    const [width, setWidth] = useState(0);

    function recalculateWidth() {
        const totalWidth = getWidth(leftSpaceRef) + getWidth(rightSpaceRef) + getWidth(textRef);
        setWidth(totalWidth);
    }

    useEffect(() => {
        function handleResize() {
            recalculateWidth();
        }

        window.addEventListener('resize', handleResize)

        return () => window.removeEventListener('resize', handleResize)
    })

    useLayoutEffect(() => recalculateWidth(), [])

    return <Column width="max">
        <Row justifyContent={"center"}>
            <div ref={leftSpaceRef} style={{maxWidth: props.largerBy, flexGrow: 1}}/>
            <Text spanRef={textRef} variant={"h4"} fontStyle={"italic"} text={props.text}/>
            <div ref={rightSpaceRef} style={{maxWidth: props.largerBy, flexGrow: 1}}/>
        </Row>
        <Wrap alignSelf={"center"} style={{width: "100%"}} maxWidth={width}>
            {props.children}
        </Wrap>
    </Column>
}

function getWidth(ref: RefObject<Element>): number {
    return ref.current?.clientWidth ?? 0;
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
        borderRadius: 7,
        maxWidth: "40%"
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
    const [currentTrace, setCurrentTrace] = React.useState(0);
    const allFei = allTraceFei(report)
    return <Column width="max">
        <Row alignItems={"center"} width={"max"}>
            <FeiSelection isTraceSection={isTraceSection} setIsTraceSection={setIsTraceSection}/>
            {/*{FeiSelection(isTraceSection, setIsTraceSection)}*/}
            <Spacer flexGrow={1}/>
            {isTraceSection && <TraceFeiSelection
                currentTrace={currentTrace} setCurrentTrace={setCurrentTrace} fei={allFei}
            />}
        </Row>

        {isTraceSection ? <TraceFei fei={allFei[currentTrace]}/> : <ModsFei report={report}/>}
    </Column>
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

function TraceFeiSelection({fei, currentTrace, setCurrentTrace}:
                               { fei: TraceFei[], currentTrace: number, setCurrentTrace: (trace: number) => void }) {
    return <FormControl style={{minWidth: "fit-content", maxWidth: "fit-content"}} fullWidth>
        <Select
            variant={'outlined'}
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={fei[currentTrace].name}
            onChange={(e) => setCurrentTrace(fei.findIndex(fei => fei.name === e.target.value))}
        >
            {fei.map((fei, index) => <MenuItem key={fei.name} value={fei.name}>{fei.name}</MenuItem>)}
        </Select>
    </FormControl>
}

function TraceFei({fei}: { fei: TraceFei }) {
    return <Column>
        <Spacer height={5}/>
        <SimpleDivider height={1}/>
        <Spacer height={5}/>
        {fei.metadata.map((element, i) => <TraceFeiElement key={i} element={element}/>)}
    </Column>
}

function TraceFeiElement({element}: { element: ElementWithFei }) {
    const metadata = element.forgeMetadata;
    return <Column>
        <StackTraceElementUi withMarginLeft={false} traceElement={element}/>

        <Column margin={{left: 20}}>
            <KeyValueTraceFei name={"Jar File"} value={metadata.jarFile}/>
            <KeyValueTraceFei name={"Version"} value={metadata.version}/>
            <ListTraceFei name={"Classloading Reasons"} value={metadata.classloadingReasons}/>
            <ListTraceFei name={"Plugin Transformer Reasons"} value={metadata.pluginTransformerReasons}/>
            <ListTraceFei name={"Additional Transforme Reasons"} value={metadata.additionalTransformerData}/>
        </Column>

    </Column>
}

function KeyValueTraceFei({name, value}: { name: string, value: string | undefined }) {
    return <Fragment>
        {value !== undefined && <TextTheme wordBreak={"break-word"}>
            {name}: <b>{value}</b>
        </TextTheme>}
    </Fragment>
}

function ListTraceFei({name, value}: { name: string, value: string[] }) {
    return <Fragment>
        {value.length > 0 && <Column>
            <Text text={name + ":"}/>
            {value.map(element => <Text wordBreak={"break-all"} margin={{left: 10}} text={"- " + element}
                                        fontWeight="bold"/>)}
        </Column>}
    </Fragment>
}

function ModsFei({report}: { report: RichCrashReport }) {
    return <LazyColumn data = {report.mods!}
                       childProvider={(mod, i) => <ModFei key = {i} mod = {mod}/>}/> /*alignItems={"center"}*/
    {/*    {report.mods!.map((mod, i) => <ModFei key = {i} mod = {mod}/>)}*/}
    {/*</LazyColumn>*/}
}

function ModFei({mod}: {mod:Mod}){
    const metadata = mod.forgeMetadata;
    return <Column alignItems={"center"}>
        <Text wordBreak={"break-all"} fontWeight={"bold"} text={mod.name}/>
        <SimpleDivider width={{percent: 50}} height = {1}/>
        {metadata !== undefined && <Fragment>
            <Text wordBreak = "break-all" text={metadata.file}/>
            <Text wordBreak = "break-all" text={metadata.signature}/>
            <Text wordBreak = "break-all" text={metadata.completeness}/>
        </Fragment>}
        <Spacer height = {10}/>
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