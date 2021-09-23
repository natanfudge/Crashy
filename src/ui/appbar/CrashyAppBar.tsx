import {AppBar} from "@mui/material";
import {Row} from "../improvedapi/Flex";
import {LinkContent} from "../improvedapi/Vanilla";
import {CrashyLogo} from "../Utils";
import {Text} from "../improvedapi/Text";
import {crashyTitleColor} from "../Colors";
import {Spacer} from "../improvedapi/Core";
import React from "react";
import {ToolbarButtons} from "../CrashyCrashReport";
import {GetCrashResponse} from "../CrashyServer";

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