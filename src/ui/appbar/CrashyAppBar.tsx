import {Row} from "../utils/improvedapi/Flex";
import {LinkContent} from "../utils/improvedapi/Vanilla";
import {Text} from "../utils/improvedapi/Text";
import {crashyTitleColor, OnBackgroundColor} from "../Colors";
import {Spacer} from "../utils/improvedapi/Core";
import React, {Fragment} from "react";
import {GetCrashResponse, isSuccessfulGetCrashResponse} from "../CrashyServer";
import {CrashyLogo, ExpandingButton} from "../utils/Crashy";
import {CAppBar} from "../utils/improvedapi/Material";
import {BugReport, Delete} from "@mui/icons-material";
import {DeleteSection} from "./DeleteCrash";

export function CrashyAppBar({crash}: { crash?: GetCrashResponse }) {
    return <CAppBar padding={10}>
        <LinkContent href="/">
            <Row>
                <CrashyLogo size={30} margin={{top: 5, right: 10}}/>
                <Text text={"Crashy"} variant={"h4"} color={crashyTitleColor}/>
            </Row>
        </LinkContent>
        <Spacer flexGrow={1}/>
        {(isSuccessfulGetCrashResponse(crash)) && <ToolbarButtons/>}
    </CAppBar>
}

function ToolbarButtons() {
    return <Fragment>
        <LinkContent href="https://github.com/natanfudge/Crashy/issues/new">
            <Row className={"bug-report"} padding={{top: 5, right: 30}}>
                <BugReport style={{marginTop: "4px", marginRight: "5px"}}/>
                <Text text={"Report Issue"} variant={"h6"} />
            </Row>
        </LinkContent>
        <ExpandingButton padding={{right: 10}} icon={<Delete/>} sticky>
            <DeleteSection/>
        </ExpandingButton>
    </Fragment>
}