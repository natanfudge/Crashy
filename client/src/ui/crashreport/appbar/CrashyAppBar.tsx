import {ScreenSize, useScreenSize} from "../../../fudge-commons/methods/Gui";
import {CrashProps, isCrashAttemptValid} from "../CrashReportPage";
import {BorderColor, Delete, Subject, TextSnippet} from "@mui/icons-material";
import {AppbarColor, crashyTitleColor, OnBackgroundColor, primaryColor} from "../../Colors";
import {LinkContent} from "../../../fudge-commons/simple/LinkContent";
import {CrashyLogo, ExpandingIconButton} from "../../utils/Crashy";
import {NavigationDrawer} from "./NavigationDrawer";
import {Spacer} from "../../../fudge-commons/simple/SimpleDiv";
import {getUrlCrashId} from "../../../utils/PageUrl";
import {DeletePopup} from "./DeleteCrash";
import {Row} from "../../../fudge-commons/simple/Flex";
import {Text, TextTheme} from "../../../fudge-commons/simple/Text";
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
    const screenSize = useScreenSize();
    // Only put a border on non-portrait
    const borderProps = screenSize.isPortrait ? {} : {border:`2px solid`, borderColor: "rgba(144,202,249,0.3)", borderRadius: 15}
    return <Fragment>
        <Link  className="link" href={`/${crashId}/raw.txt`}
              style={{...borderProps, color: OnBackgroundColor, padding: "8px", paddingTop: 10, display: "inline-flex", justifyContent: "center", textDecoration: "none"}}>
            {screenSize.isPortrait ? <TextSnippet/> : < TextTheme>
                Raw
            </TextTheme>}
        </Link>
        <ExpandingIconButton padding={{right: 10}} icon={<Delete/>} sticky>
            <DeletePopup/>
        </ExpandingIconButton>
    </Fragment>
}