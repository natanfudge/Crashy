import {Column, Row} from "../../utils/simple/Flex";
import {LinkContent} from "../../utils/simple/LinkContent";
import {Text, TextTheme} from "../../utils/simple/Text";
import {AppbarColor, crashyTitleColor, fadedOutColor, OnBackgroundColor} from "../../Colors";
import React, {Fragment, useState} from "react";
import {CrashyLogo, ExpandingIconButton} from "../../utils/Crashy";
import {ArrowDropDown, ArrowDropUp, Delete, Inbox, Mail, Menu, Subject} from "@mui/icons-material";
import {DeletePopup} from "./DeleteCrash";
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
import {CrashProps, isCrashAttemptValid} from "../CrashReportPage";
import {sectionNavigationOf, ValidCrashProps} from "../valid/ValidCrashReportUi";
import {nameOfSection, sectionsEqual} from "../../../utils/Section";
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