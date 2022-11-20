import { ScreenSize } from "../../../fudge-commons/methods/Gui";
import {CrashProps, isCrashAttemptValid} from "../CrashReportPage";
import {Delete, Subject} from "@mui/icons-material";
import {AppbarColor, crashyTitleColor, OnBackgroundColor} from "../../Colors";
import {LinkContent} from "../../../fudge-commons/simple/LinkContent";
import {CrashyLogo, ExpandingIconButton} from "../../utils/Crashy";
import {SimpleIconButton} from "../../../fudge-commons/simple/SimpleIconButton";
import {NavigationDrawer} from "./NavigationDrawer";
import {Spacer} from "../../../fudge-commons/simple/SimpleDiv";
import {getUrlCrashId, setUrlRaw} from "../../../utils/PageUrl";
import {DeletePopup} from "./DeleteCrash";
import {Row} from "../../../fudge-commons/simple/Flex";
import {Text} from "../../../fudge-commons/simple/Text";
import {Fragment} from "react";
import {Link} from "@mui/material";


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
    const crashId = getUrlCrashId()
    return <Fragment>
        <Link className = "link" href={`/${crashId}/raw.txt`}
              style={{color: OnBackgroundColor, padding: "8px", display: "inline-flex", justifyContent :"center"}}>
            <Subject/>
        </Link>
        <ExpandingIconButton padding={{right: 10}} icon={<Delete/>} sticky>
            <DeletePopup/>
        </ExpandingIconButton>
    </Fragment>
}