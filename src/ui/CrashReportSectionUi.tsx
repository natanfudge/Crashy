// import {RichCrashReportSection, RichStackTraceElement} from "../../parser/model/RichCrashReport";
import {Column, Row} from "./improvedapi/Flex";
import {Text} from "./improvedapi/Text";
import {CDivider, Spacer} from "./improvedapi/Core";
import {StringMap} from "../../parser/src/model/CrashReport";
import React from "react";
import {StackTraceElementsUi} from "./StackTraceUi";
import {primaryColor} from "./Colors";
import {objectMap} from "./Utils";
import {RichCrashReportSection, RichStackTraceElement} from "../../parser/src/model/RichCrashReport";

export function CrashReportSectionUi({section}: { section: RichCrashReportSection }) {
    return <Column margin={{top: 10}} width={"max"}>
        <Column width={300} alignSelf={"center"}>
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
                return <Column>
                    <Row key={name}>
                        <Text text={name} isBold={true} padding={5} style={{width: "30%", minWidth: "30%"}}/>
                        <CDivider backgroundColor={primaryColor} height={"auto"} width={1}/>
                        <Text text={detail} padding={{horizontal: 10, vertical: 5}}/>

                    </Row>
                    <CDivider backgroundColor={index % 2 === 1 ? "#6d6c6c" : undefined}/>
                </Column>
            }

        })}

    </Column>
}
