import {AppBar} from "@mui/material";
import {Row} from "../utils/improvedapi/Flex";
import {LinkContent} from "../utils/improvedapi/Vanilla";
import {Text} from "../utils/improvedapi/Text";
import {crashyTitleColor} from "../Colors";
import {Spacer} from "../utils/improvedapi/Core";
import React from "react";
import {ToolbarButtons} from "../CrashyCrashReport";
import {GetCrashResponse} from "../CrashyServer";
import {CrashyLogo} from "../utils/Crashy";

export function CrashyAppBar({crash}: { crash?: GetCrashResponse }) {
    return <AppBar>
        <Row padding={10}>
            <LinkContent href="/">
                <Row>
                    <CrashyLogo size={30} margin={{top: 5, right: 10}}/>
                    <Text text={"Crashy"} variant={"h4"} color={crashyTitleColor}/>
                </Row>
            </LinkContent>
            <Spacer flexGrow={1}/>
            {(typeof crash === "string") && <ToolbarButtons/>}
        </Row>
    </AppBar>
}