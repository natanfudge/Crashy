import { ScreenSize } from "fudge-commons/lib/src/methods/Gui";
import {CrashProps, isCrashAttemptValid} from "../CrashReportPage";
import {Delete, Subject} from "@mui/icons-material";
import {AppbarColor, crashyTitleColor} from "../../Colors";
import {LinkContent} from "fudge-commons/lib/src/simple/LinkContent";
import {CrashyLogo, ExpandingIconButton} from "../../utils/Crashy";
import {SimpleIconButton} from "fudge-commons/lib/src/simple/SimpleIconButton";
import {NavigationDrawer} from "./NavigationDrawer";
import {Spacer} from "fudge-commons/lib/src/simple/SimpleDiv";
import {setUrlRaw} from "../../../utils/PageUrl";
import {DeletePopup} from "./DeleteCrash";
import {Row} from "fudge-commons/lib/src/simple/Flex";
import {Text} from "fudge-commons/lib/src/simple/Text";
import {Fragment} from "react";


export function CrashyAppBar({crash, sectionState, screen}: CrashProps & { screen: ScreenSize }) {
    const validCrash = isCrashAttemptValid(crash);
    const showDrawer = screen.isPhone && validCrash;
    return <Row /*height={HeaderHeight}*/ style={{zIndex: 1201, position: showDrawer ? undefined : "fixed"}} width={"max"}
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