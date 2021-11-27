import {Column} from "../../utils/simple/Flex";
import {TextTheme} from "../../utils/simple/Text";
import React from "react";

export function CrashErroredScreen() {
    return <Column height={"max"} justifyContent={"center"}>
        <TextTheme width={"max"} align={"center"} margin={{bottom: 200}}>
            Something went wrong trying to get the crash log. Check your internet connection.
        </TextTheme>
    </Column>
}