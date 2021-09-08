import {RichCrashReportSection, RichStackTraceElement} from "../model/RichCrashReport";
import {Column, Row} from "./improvedapi/Flex";
import {Text} from "./improvedapi/Text";
import {CDivider, Spacer} from "./improvedapi/Core";
import {StringMap} from "../model/CrashReport";
import React from "react";
import {StackTraceElementsUi} from "./StackTraceUi";
import {primaryColor} from "./App";

export function CrashReportSectionUi({section}: { section: RichCrashReportSection }) {
    return <Column margin={{top: 10}} width={"max"}>
        <Column width={300} alignSelf={"center"}>
            <Text text={section.name} variant={"h4"} alignSelf={"center"}/>
            <CDivider width={"max"}/>
        </Column>

        {section.details && <CrashReportSectionDetails details={section.details}/>}
        {section.stackTrace && <CrashReportSectionTrace trace={section.stackTrace}/>}
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
    return <Column>
        {objectMap(details, (name, detail) => {
                // Mods are displayed separately
                if (name !== "Mod List" && name !== "Fabric Mods")
                    return <Row key = {name}>
                        {/*TODO: look at this*/}
                        {/* color={"#cbebe9"}*/}
                        <Text  className={"things"} text={name} isBold={true} style={{width: "30%", minWidth: "30%"}}/>
                        <Spacer width={5}/>
                        <CDivider backgroundColor={primaryColor} height={"auto"} width={1}/>
                        <Spacer width={10}/>
                        <Text style={{lineBreak: "anywhere"}} text={detail}/>
                    </Row>
            }
        )}
    </Column>
}

function objectMap(object: StringMap, mapFn: (key: string, value: string, index: number) => any) {
    return Object.keys(object).map(function (key, index) {
        return mapFn(key, object[key], index);
    }, {})
}