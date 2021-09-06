import {RichCrashReportSection, RichStackTraceElement} from "../model/RichCrashReport";
import {Column, Row} from "./improvedapi/Flex";
import {Text} from "./improvedapi/Text";
import {CDivider, Spacer} from "./improvedapi/Core";
import {StackTraceElementsUi} from "./StackTraceUi";
import {StringMap} from "../model/CrashReport";
import React from "react";

export function CrashReportSectionUi(section: RichCrashReportSection) {
    return <Column margin={{top: 10}} width={"max"}>
        <Column width={300} alignSelf={"center"}>
            <Text text={section.name} variant={"h4"} alignSelf={"center"}/>
            <CDivider width={"max"}/>
        </Column>

        {section.details && CrashReportSectionDetails(section.details)}

        <Column alignSelf={"start"}>
            {
                section.stackTrace && CrashReportSectionTrace(section.stackTrace)
            }
        </Column>
    </Column>
}

function CrashReportSectionTrace(trace: RichStackTraceElement[]) {
    return [
        <Spacer height={20}/>,
        <Text text={"Stack Trace"} variant={"h5"}/>,
        <CDivider width={"max"}/>,
        StackTraceElementsUi(trace)
    ]
}

function CrashReportSectionDetails(details: StringMap) {
    return <Column>
        {objectMap(details, (name, detail) => {
            // Mods are displayed separately
                if (name !== "Mod List" && name !== "Fabric Mods")
                    return <Row>
                        {/*TODO: look at this*/}
                        {/* color={"#cbebe9"}*/}
                        <Text text={name} isBold={true} style={{whiteSpace:"nowrap"}}/>
                        <Spacer width={5}/>
                        <CDivider height={"max"} width={1}/>
                        <Spacer width={10}/>
                        <Text text={detail}/>
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