import {Column, Row} from "../../utils/simple/Flex";
import {LinkContent} from "../../utils/simple/LinkContent";
import {Text, TextTheme} from "../../utils/simple/Text";
import {crashyTitleColor, OnBackgroundColor} from "../../Colors";
import React, {Fragment, useState} from "react";
import {CrashyLogo, ExpandingIconButton} from "../../utils/Crashy";
import {ArrowDropDown, ArrowDropUp, Delete, Menu} from "@mui/icons-material";
import {DeleteSection} from "./DeleteCrash";
import {SimpleAppBar} from "../../utils/simple/SimpleAppBar";
import {Spacer, Wrap} from "../../utils/simple/SimpleDiv";
import {ButtonGroup, ClickAwayListener, Icon, SvgIcon, SwipeableDrawer} from "@mui/material";
import {useScreenSize} from "../../../utils/Gui";
import {SimpleButton} from "../../utils/simple/SimpleButton";
import {CrashContextUi} from "../valid/CrashContextUi";
import {GetCrashAttempt, isCrashAttemptValid} from "../CrashReportPage";
import {RichCrashReport} from "crash-parser/src/model/RichCrashReport";

export function CrashyAppBar({crash}: { crash: GetCrashAttempt }) {
    const screen = useScreenSize();
    const validCrash = isCrashAttemptValid(crash);
    return <SimpleAppBar padding={10}>
        <Row width={"max"}>
            {screen.isPortrait && validCrash && <NavigationDrawer crash={crash}/>}
            <LinkContent href="/">
                <Row>
                    <CrashyLogo size={30} margin={{top: 5, right: 10}}/>
                    <Text text={"Crashy"} variant={"h4"} color={crashyTitleColor}/>
                </Row>
            </LinkContent>
            <Spacer flexGrow={1}/>
            {validCrash && <ToolbarButtons/>}
        </Row>
    </SimpleAppBar>
}

enum NavigationChoice {

}

function NavigationDrawer(props: { crash: RichCrashReport }) {
    const [open, setOpen] = useState(false);
    const [crashContextOpen, setCrashContextOpen] = useState(false);
    return <Fragment>
        <Wrap onClick={() => setOpen(oldOpen => !oldOpen)} padding={{right: 10}}>
            <Menu style={{width: "auto", height: "100%"}}/>
        </Wrap>
        <SwipeableDrawer onOpen={() => setOpen(true)} onClose={() => setOpen(false)}
                         variant={"temporary"} anchor="left" open={open} SlideProps={{style: {height: "max-content"}}}>
            <ClickAwayListener onClickAway={() => setOpen(false)}>
                <div style={{marginTop: 65}}>
                    <ButtonGroup orientation={"vertical"} variant={"contained"}>
                        <CrashContextNavigationButton active={crashContextOpen} onClick={() => setCrashContextOpen((old) => !old)}/>
                        {
                            crashContextOpen ? <CrashContextUi context={props.crash.context}/> :
                                <Fragment>
                                    <NavigationButton text="Second Button"/>
                                    <NavigationButton text="Third Button"/>
                                </Fragment>
                        }

                    </ButtonGroup>
                </div>
            </ClickAwayListener>


        </SwipeableDrawer>
    </Fragment>

}

function NavigationButton(props: { text: string, onClick?: () => void }) {
    return <SimpleButton variant={"text"} onClick={props.onClick ?? (() => {
    })}>
            <Text text={props.text} variant="h6" color={OnBackgroundColor} padding={10}/>
    </SimpleButton>
}

function CrashContextNavigationButton(props: {active: boolean, onClick?: () => void }) {
    const arrow = props.active? ArrowDropUp : ArrowDropDown
    return <SimpleButton variant={"text"} onClick={props.onClick ?? (() => {
    })}>
        <TextTheme style={{lineHeight: "20px"}} variant="h6" color={OnBackgroundColor} padding={{left: 10,right: 10, top: 20}}>
            General Info
            <br/>
            <SvgIcon color = "info" style = {{alignSelf:"center"}} component = {arrow}/>
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