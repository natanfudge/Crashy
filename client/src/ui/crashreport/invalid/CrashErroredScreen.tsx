
import React from "react";
import {Column} from "../../../fudge-commons/simple/Flex";
import {TextTheme} from "../../../fudge-commons/simple/Text";

export function CrashErroredScreen() {
    return <Column height={"max"} justifyContent={"center"}>
        <TextTheme width={"max"} align={"center"} margin={{bottom: 200}}>
            Something went wrong trying to get the crash log. Check your internet connection.
        </TextTheme>
    </Column>
}