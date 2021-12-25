import {Row} from "../../utils/simple/Flex";
import {LinkContent} from "../../utils/simple/LinkContent";
import {Text} from "../../utils/simple/Text";
import {AppbarColor, crashyTitleColor} from "../../Colors";
import React, {Fragment} from "react";
import {CrashyLogo, ExpandingIconButton} from "../../utils/Crashy";
import {Delete, Subject} from "@mui/icons-material";
import {DeletePopup} from "./DeleteCrash";
import {Spacer} from "../../utils/simple/SimpleDiv";
import {ScreenSize} from "../../../utils/Gui";
import {CrashProps, isCrashAttemptValid} from "../CrashReportPage";
import {NavigationDrawer} from "./NavigationDrawer";
import {SimpleIconButton} from "../../utils/simple/SimpleIconButton";
import {setUrlRaw} from "../../../utils/PageUrl";

export function CrashyAppBar({crash, sectionState, screen}: CrashProps & { screen: ScreenSize }) {
    const validCrash = isCrashAttemptValid(crash);
    const showDrawer = screen.isPhone && validCrash;
    return <Row style={{zIndex: 1201, position: showDrawer ? undefined : "fixed"}} width={"max"}
                backgroundColor={AppbarColor}>
        {showDrawer && <NavigationDrawer sectionState={sectionState} report={crash}/>}

        <Row style={{width: "100%"}} margin={{left: showDrawer ? 60 : 0}} padding={10}>

            <LinkContent href="/">
                <Row>
                    <CrashyLogo size={30} margin={{top: 5, right: 10}}/>
                    <Text text={"Crashy"} variant={"h4"} color={crashyTitleColor}/>
                </Row>
            </LinkContent>
            <Spacer flexGrow={1}/>
            {validCrash && <ToolbarButtons/>}
        </Row>
    </Row>
}

function ToolbarButtons() {
    return <Fragment>
        <SimpleIconButton onClick={() => setUrlRaw(true)}>
            <Subject/>
        </SimpleIconButton>
        <ExpandingIconButton padding={{right: 10}} icon={<Delete/>} sticky>
            <DeletePopup/>
        </ExpandingIconButton>
    </Fragment>
}