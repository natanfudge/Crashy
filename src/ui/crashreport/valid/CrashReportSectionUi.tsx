import {Column, Row} from "../../utils/simple/Flex";
import {Text} from "../../utils/simple/Text";
import {StringMap} from "crash-parser/src/model/CrashReport";
import React from "react";
import {StackTraceElementsUi,} from "./StackTraceUi";
import {primaryColor} from "../../Colors";
import {RichCrashReport, RichCrashReportSection, RichStackTraceElement} from "crash-parser/src/model/RichCrashReport";
import {objectMap} from "../../../../fudge-commons/src/utils/Javascript";
import {SimpleDivider} from "../../utils/simple/SimpleDivider";
import {Wrap} from "../../utils/simple/SimpleDiv";
import {WithMappings} from "./mappings/MappingsUi";
import {MappingsController} from "./mappings/MappingsController";

export function CrashReportSectionUi({
    report,
                                         section,
                                     }: { section: RichCrashReportSection, report: RichCrashReport }) {
    return <Column margin={{top: 10}} width={"max"}>
        <Column width={300} alignSelf={"center"}>
            <Text text={section.name} variant={"h4"} alignSelf={"center"}/>
            <SimpleDivider width={"max"}/>
        </Column>

        {section.details !== undefined && <CrashReportSectionDetails details={section.details}/>}
        {section.stackTrace !== undefined &&
            <CrashReportSectionTrace trace={section.stackTrace} report={report}/>}
    </Column>
}

function CrashReportSectionTrace({
    report,
                                     trace,
                                 }: {report: RichCrashReport, trace: RichStackTraceElement[] }) {
    const mappingsController = new MappingsController(report);

    return <Wrap padding={{top: 20}}>
        <WithMappings controller={mappingsController}>
            <Column alignSelf={"start"}>
                <div>
                    <Text text={"Stack Trace"} variant={"h5"}/>
                    <SimpleDivider width={"max"}/>
                </div>
                <StackTraceElementsUi elements={trace} mappings={mappingsController.getContext()}/>
            </Column>
        </WithMappings>
    </Wrap>
}


function CrashReportSectionDetails({details}: { details: StringMap }) {
    return <Column margin={{top: 5}}>
        <SimpleDivider backgroundColor={"#6d6c6c"}/>
        {objectMap(details, (name, detail, index) => {
            // Mods are displayed separately
            if (name !== "Mod List" && name !== "Fabric Mods") {
                return <Column key={index}>
                    <Row key={name}>
                        <Text text={name} fontWeight={"bold"} padding={5} width={{percent: 30}}/>
                        <SimpleDivider backgroundColor={primaryColor} height={"auto"} width={1}/>
                        <Text style={{lineBreak: "anywhere"}} text={detail} padding={{horizontal: 10, vertical: 5}}/>
                    </Row>
                    <SimpleDivider backgroundColor={index % 2 === 1 ? "#6d6c6c" : undefined}/>
                </Column>
            }

        })}

    </Column>
}
