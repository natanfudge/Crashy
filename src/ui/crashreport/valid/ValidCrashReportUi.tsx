import {RichCrashReport} from "crash-parser/src/model/RichCrashReport";
import React, {Fragment, RefObject, useEffect, useLayoutEffect, useRef, useState} from "react";
import {Column, Row} from "../../utils/simple/Flex";
import {CrashLeftSide} from "./CrashContextUi";
import {SectionNavigation} from "./SectionNavigation";
import {Text} from "../../utils/simple/Text";
import {StackTraceUi} from "./StackTraceUi";
import {ModListUi} from "./ModListUi";
import {CrashReportSectionUi} from "./CrashReportSectionUi";
import {SimpleDivider} from "../../utils/simple/SimpleDivider";
import {Surface} from "../../utils/simple/Surface";
import {ScreenSize, useScreenSize} from "../../../utils/Gui";
import {Wrap} from "../../utils/simple/SimpleDiv";
import {Section, sectionNavigationOf, SectionState, SpecialSection} from "../../../utils/Section";
import {WithChild} from "../../utils/simple/SimpleElementProps";
import {ForgeExtraInfoSection} from "./ForgeExtraInfoSection";
import {JVMDetailsSection} from "./JvmDetailsSection";

export interface ValidCrashProps {
    report: RichCrashReport
    sectionState: SectionState
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
            <Column alignItems={"center"} flexGrow={1} padding={{left: screen.isPortrait ? 5 : 50}} width={"max"}>
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
        return <StackTraceUi report={report}/>
    } else if (section === SpecialSection.Mods) {
        return <ModListUi mods={report.mods!}/>
    } else if (section === SpecialSection.ForgeInfo) {
        return <ForgeExtraInfoSection report={report}/>
    } else if (section === SpecialSection.JvmInfo) {
        return <JVMDetailsSection details={report.stackTrace.details!}/>
    } else {
        return <CrashReportSectionUi section={report.sections[section.index]} minecraftVersion={report.context.minecraftVersion}/>
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