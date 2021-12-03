import {RichCrashReport} from "crash-parser/src/model/RichCrashReport";
import React from "react";
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
import {setUrlRaw} from "../../../utils/PageUrl";
import {useOrientation} from "../../../utils/Gui";
import {DynamicallyUnderlinedText} from "../../App";

export function ValidCrashReportUi({report}: { report: RichCrashReport }) {
    // Show what the crash is in previews
    const context = report.context;

    const [activeSectionIndex, setActiveSectionIndex] = React.useState(0)

    const sectionNames = report.mods !== undefined ? ["Stack Trace", "Mods"] : ["Stack Trace"]

    report.sections.forEach(section => sectionNames.push(section.name));

    const isPortrait = useOrientation();
    return <Row height={"max"} padding={{top: 4}} justifyContent={"space-between"}>
        {!isPortrait && <CrashLeftSide context={context}/>}
        <CenterView isPortrait={isPortrait} report={report} activeSectionIndex={activeSectionIndex}/>

        {!isPortrait && <SectionNavigation sections={sectionNames}
                                           activeSection={activeSectionIndex}
                                           onActiveSectionChanged={setActiveSectionIndex}/>}
    </Row>
}

function CenterView({
                        report,
                        activeSectionIndex,
                        isPortrait
                    }: { report: RichCrashReport, activeSectionIndex: number, isPortrait: boolean }) {
    return <Surface flexGrow={1} margin={{horizontal: 10}} padding={{bottom: 30, top: 5}} height={"fit-content"}>
        <Row>
            {/*TODO: restore raw button in portrait somehow*/}
            {!isPortrait && <SimpleButton margin={10} variant={"outlined"} position="absolute" onClick={() => setUrlRaw(true)}>
                <Text text="Raw"/>
            </SimpleButton>}
            <Column alignItems={"center"} flexGrow={1} padding={{horizontal: isPortrait ? 0 : 50}} width={"max"}>
                <DynamicallyUnderlinedText text={report.title} largerBy={150}>
                    <SimpleDivider backgroundColor={"#9c1a1a"}/>
                </DynamicallyUnderlinedText>
                <Text text={report.wittyComment} align={"center"} margin={{bottom: 10}}/>
                <ActiveSection report={report} index={activeSectionIndex}/>
            </Column>
        </Row>
    </Surface>
}

function ActiveSection({report, index}: { report: RichCrashReport, index: number }) {
    if (index === 0) {
        return <StackTraceUi stackTrace={report.stackTrace}/>
    } else if (index === 1 && report.mods !== undefined) {
        return <ModListUi mods={report.mods}/>
    }// We already use up the 0 and 1 index for the main stack trace and mods, so we need to reduce the index by 2.
    else {
        // When there is no mods page, only shift by 1 index (for the StackTraceUi)
        const indexShift = report.mods !== undefined ? 2 : 1;
        return <CrashReportSectionUi section={report.sections[index - indexShift]}/>
    }
}
