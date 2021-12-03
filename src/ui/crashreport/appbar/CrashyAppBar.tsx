import {Row} from "../../utils/simple/Flex";
import {LinkContent} from "../../utils/simple/LinkContent";
import {Text} from "../../utils/simple/Text";
import {crashyTitleColor, OnBackgroundColor} from "../../Colors";
import React, {Fragment, useState} from "react";
import {GetCrashResponse, isSuccessfulGetCrashResponse} from "../../../server/CrashyServer";
import {CrashyLogo, ExpandingIconButton} from "../../utils/Crashy";
import {Delete, Inbox, Mail, Menu} from "@mui/icons-material";
import {DeleteSection} from "./DeleteCrash";
import {SimpleAppBar} from "../../utils/simple/SimpleAppBar";
import {Spacer, Wrap} from "../../utils/simple/SimpleDiv";
import {SimpleIconButton} from "../../utils/simple/SimpleIconButton";
import {
    Box,
    Button,
    ButtonGroup, ClickAwayListener,
    Divider,
    Drawer, List,
    ListItem,
    ListItemIcon,
    ListItemText, SwipeableDrawer,
    Typography
} from "@mui/material";
import {useScreenSize} from "../../../utils/Gui";
import {Surface} from "../../utils/simple/Surface";
import {SimpleButton} from "../../utils/simple/SimpleButton";

export function CrashyAppBar({crash}: { crash?: GetCrashResponse | Error }) {
    const screen = useScreenSize();
    return <SimpleAppBar padding={10}>
        <Row width={"max"}>
            {screen.isPortrait && <NavigationDrawer/>}
            <LinkContent href="/">
                <Row>
                    <CrashyLogo size={30} margin={{top: 5, right: 10}}/>
                    <Text text={"Crashy"} variant={"h4"} color={crashyTitleColor}/>
                </Row>
            </LinkContent>
            <Spacer flexGrow={1}/>
            {(isSuccessfulGetCrashResponse(crash)) && <ToolbarButtons/>}
        </Row>
    </SimpleAppBar>
}

function NavigationDrawer() {
    const [open,setOpen] = useState(false);
    return <Fragment>
        <Wrap onClick={() => setOpen(oldOpen => !oldOpen)} padding = {{right: 10}}>
            <Menu style = {{width: "auto", height: "100%"}}/>
        </Wrap>
        <SwipeableDrawer onOpen = {() => setOpen(true)} onClose = {() => setOpen(false)}
                         variant={"temporary"} anchor = "left" open = {open} SlideProps={{style: {height: "max-content"}}} >
            <ClickAwayListener onClickAway = {() => setOpen(false)}>
                <div style = {{marginTop: 70}}>
                    <ButtonGroup orientation={"vertical"} variant={"contained"}>
                        <NavigationButton text="First Button"/>
                        <NavigationButton text="Second Button"/>
                    </ButtonGroup>
                </div>
            </ClickAwayListener>


        </SwipeableDrawer>
    </Fragment>

}

function NavigationButton(props: { text: string,  onClick?: () => void }) {
    return <SimpleButton variant={"text"} onClick={props.onClick ?? (() => {})}>
        <Wrap padding={{horizontal: 5}} width={"max"}>
            <Text text = {props.text} variant="h6" color={OnBackgroundColor} padding={5} maxWidth={208}/>
        </Wrap>
    </SimpleButton>
}

function ToolbarButtons() {
    return <Fragment>
        <ExpandingIconButton padding={{right: 10}} icon={<Delete/>} sticky>
            <DeleteSection/>
        </ExpandingIconButton>
    </Fragment>
}