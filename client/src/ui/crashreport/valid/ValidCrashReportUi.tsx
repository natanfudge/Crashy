import {ModListUi} from "./ModListUi";
import {Wrap} from "fudge-commons/simple/SimpleDiv";
import {StackTraceUi} from "./StackTraceUi";
import {JVMDetailsSection} from "./JvmDetailsSection";
import {Surface} from "fudge-commons/simple/Surface";
import {Column, Row} from "fudge-commons/simple/Flex";
import {ScreenSize, useScreenSize} from "fudge-commons/methods/Gui";
import {Section, sectionNavigationOf, SectionState, SpecialSection} from "../../../utils/Section";
import {WithChild} from "fudge-commons/simple/SimpleElementProps";
import {SectionNavigation} from "./SectionNavigation";
import {RefObject, useEffect, useLayoutEffect, useRef, useState} from "react";
import {RichCrashReport} from "../../../crash/model/RichCrashReport";
import {CrashReportSectionUi} from "./CrashReportSectionUi";
import {ForgeExtraInfoSection} from "./ForgeExtraInfoSection";
import {SimpleDivider} from "fudge-commons/simple/SimpleDivider";
import {CrashLeftSide} from "./CrashContextUi";
import {Text} from "fudge-commons/simple/Text";


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
        return <CrashReportSectionUi section={report.sections[section.index]} report={report}/>
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
