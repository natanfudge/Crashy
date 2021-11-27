import {Row} from "../../utils/improvedapi/Flex";
import {LinkContent} from "../../utils/improvedapi/LinkContent";
import {Text} from "../../utils/improvedapi/Text";
import {crashyTitleColor} from "../../Colors";
import React, {Fragment} from "react";
import {GetCrashResponse, isSuccessfulGetCrashResponse} from "../../../server/CrashyServer";
import {CrashyLogo, ExpandingIconButton} from "../../utils/Crashy";
import {Delete} from "@mui/icons-material";
import {DeleteSection} from "./DeleteCrash";
import {SimpleAppBar} from "../../utils/improvedapi/SimpleAppBar";
import {Spacer} from "../../utils/improvedapi/SimpleDiv";

export function CrashyAppBar({crash}: { crash?: GetCrashResponse | Error }) {
    return <SimpleAppBar padding={10}>
        <LinkContent href="/">
            <Row>
                <CrashyLogo size={30} margin={{top: 5, right: 10}}/>
                <Text text={"Crashy"} variant={"h4"} color={crashyTitleColor}/>
            </Row>
        </LinkContent>
        <Spacer flexGrow={1}/>
        {(isSuccessfulGetCrashResponse(crash)) && <ToolbarButtons/>}
    </SimpleAppBar>
}

function ToolbarButtons() {
    return <Fragment>
        <ExpandingIconButton padding={{right: 10}} icon={<Delete/>} sticky>
            <DeleteSection/>
        </ExpandingIconButton>
    </Fragment>
}