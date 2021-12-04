import {Column, Row} from "../../utils/simple/Flex";
import {LinkContent} from "../../utils/simple/LinkContent";
import {Text, TextTheme} from "../../utils/simple/Text";
import {AppbarColor, crashyTitleColor, fadedOutColor, OnBackgroundColor} from "../../Colors";
import React, {Fragment, useState} from "react";
import {CrashyLogo, ExpandingIconButton} from "../../utils/Crashy";
import {ArrowDropDown, ArrowDropUp, Delete, Inbox, Mail, Menu} from "@mui/icons-material";
import {DeleteSection} from "./DeleteCrash";
import {Spacer, Wrap} from "../../utils/simple/SimpleDiv";
import {
    ButtonGroup,
    ClickAwayListener, Divider, List,
    ListItem,
    ListItemIcon,
    ListItemText,
    SvgIcon,
    SwipeableDrawer, Toolbar
} from "@mui/material";
import {ScreenSize} from "../../../utils/Gui";
import {SimpleButton} from "../../utils/simple/SimpleButton";
import {CrashContextUi} from "../valid/CrashContextUi";
import {CrashProps, isCrashAttemptValid, nameOfSection, sectionsEqual} from "../CrashReportPage";
import {sectionNavigationOf, ValidCrashProps} from "../valid/ValidCrashReportUi";

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

const HeaderHeight = 65;

function NavigationDrawer(props: ValidCrashProps) {
    const [open, setOpen] = useState(false);
    return <Fragment>
        <Wrap style={{zIndex: 3000}} position="fixed" backgroundColor={AppbarColor}
              onClick={() => setOpen(oldOpen => !oldOpen)} padding={{left: 10, top: 10, right: 10}}>
            <Menu style={{width: 43, height: 43}}/>
        </Wrap>
        <SwipeableDrawer
            variant="temporary"
            anchor="left"
            onOpen={() => setOpen(true)} onClose={() => setOpen(false)}
            open={open}
            SlideProps={{style: {marginTop: HeaderHeight}}}
        >
            <ClickAwayListener onClickAway={() => setOpen(false)}>
                <div>
                    <ButtonGroup orientation={"vertical"} variant={"contained"}>
                        <NavigationDrawerContent sectionState={props.sectionState} report={props.report}/>
                    </ButtonGroup>
                    {/*Since the drawer is margined by HeaderHeight pixels, the bottom HeaderHeight pixels of the drawer
                    will get clipped if there is no space.
                    For some reason, css won't recognize that it will need to scroll for the bottom HeaderHeight pixels.
                    So to give it a reason to scroll HeaderHeight more pixels, we put an empty space. This way it will scroll to
                    cover the missed bottom pixels.
                    */}
                    <Spacer height = {HeaderHeight}/>
                </div>
            </ClickAwayListener>
        </SwipeableDrawer>
    </Fragment>

}

function NavigationDrawerContent({report, sectionState}: ValidCrashProps) {
    const [crashContextOpen, setCrashContextOpen] = useState(false);
    return <>
        <CrashContextButton active={crashContextOpen} onClick={() => setCrashContextOpen((old) => !old)}/>
        {
            crashContextOpen ? <CrashContextUi context={report.context}/> :
                <Fragment>
                    {sectionNavigationOf(report).map(section =>
                        <NavigationButton key={nameOfSection(section)}
                                          text={nameOfSection(section)}
                                          active={!sectionsEqual(section,sectionState.activeSection)}
                                          onClick={() => sectionState.onActiveSectionChanged(section)}/>
                    )}
                </Fragment>
        }
    </>;
}

function NavigationButton(props: { text: string, active: boolean, onClick: () => void }) {
    return <SimpleButton backgroundColor={props.active ? undefined : fadedOutColor} disabled={!props.active}
                         variant={"text"} onClick={props.onClick ?? (() => {
    })}>
        <Text text={props.text} variant="h6" color={OnBackgroundColor} padding={10}/>
    </SimpleButton>
}

function CrashContextButton(props: { active: boolean, onClick?: () => void }) {
    const arrow = props.active ? ArrowDropUp : ArrowDropDown
    return <SimpleButton variant={"text"} onClick={props.onClick ?? (() => {
    })}>
        <TextTheme style={{lineHeight: "20px"}} variant="h6" color={OnBackgroundColor}
                   padding={{left: 10, right: 10, top: 20}}>
            General Info
            <br/>
            <SvgIcon color="info" style={{alignSelf: "center"}} component={arrow}/>
        </TextTheme>
    </SimpleButton>
}

function ToolbarButtons() {
    return <Fragment>
        <ExpandingIconButton padding={{right: 10}} icon={<Delete/>} sticky>
            <DeleteSection/>
        </ExpandingIconButton>
    </Fragment>
}