import {Column, Row} from "../../utils/improvedapi/Flex";
import {Text} from "../../utils/improvedapi/Text";
import {CDivider, Spacer} from "../../utils/improvedapi/Core";
import {StringMap} from "../../../../parser/src/model/CrashReport";
import React from "react";
import {StackTraceElementsUi} from "./StackTraceUi";
import {primaryColor} from "../../Colors";
import {RichCrashReportSection, RichStackTraceElement} from "../../../../parser/src/model/RichCrashReport";
import {objectMap} from "../../../utils/Javascript";

export function CrashReportSectionUi({section}: { section: RichCrashReportSection }) {
    return <Column margin={{top: 10}} width={"max"}>
        <Column width = {300}  alignSelf={"center"}>
            <Text text={section.name} variant={"h4"} alignSelf={"center"}/>
            <CDivider width={"max"}/>
        </Column>

        {section.details !== undefined && <CrashReportSectionDetails details={section.details}/>}
        {section.stackTrace !== undefined && <CrashReportSectionTrace trace={section.stackTrace}/>}
    </Column>
}

function CrashReportSectionTrace({trace}: { trace: RichStackTraceElement[] }) {
    return <Column alignSelf={"start"}>
        <Spacer height={20}/>
        <Text text={"Stack Trace"} variant={"h5"}/>
        <CDivider width={"max"}/>
        <StackTraceElementsUi elements={trace}/>
    </Column>
}

function CrashReportSectionDetails({details}: { details: StringMap }) {
    return <Column margin={{top: 5}}>
        <CDivider backgroundColor={"#6d6c6c"}/>
        {objectMap(details, (name, detail, index) => {
            // Mods are displayed separately
            if (name !== "Mod List" && name !== "Fabric Mods") {
                return <Column key={index}>
                    <Row key={name}>
                        <Text text={name} isBold={true} padding={5} width={{percent: 30}}/>
                        <CDivider backgroundColor={primaryColor} height={"auto"} width={1}/>
                        <Text style={{lineBreak: "anywhere"}} text={detail} padding={{horizontal: 10, vertical: 5}}/>
                    </Row>
                    <CDivider backgroundColor={index % 2 === 1 ? "#6d6c6c" : undefined}/>
                </Column>
            }

        })}

    </Column>
}
