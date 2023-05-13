import {ValidCrashProps} from "../valid/ValidCrashReportUi";
import React, {Fragment, useState} from "react";
import {ButtonGroup, ClickAwayListener, SvgIcon, SwipeableDrawer} from "@mui/material";
import {Spacer, Wrap} from "../../../fudge-commons/simple/SimpleDiv";
import {CrashContextUi} from "../valid/CrashContextUi";
import {Text, TextTheme} from "../../../fudge-commons/simple/Text";
import {AppbarColor, fadedOutColor, NavigationDrawerColor, OnBackgroundColor} from "../../Colors";
import {nameOfSection, sectionNavigationOf, sectionsEqual} from "../../../utils/Section";
import {ArrowDropDown, ArrowDropUp, Menu} from "@mui/icons-material";
import {SimpleButton} from "../../../fudge-commons/simple/SimpleButton";

export const HeaderHeight = 65

export function NavigationDrawer(props: ValidCrashProps) {
    const [open, setOpen] = useState(false);
    return <ClickAwayListener onClickAway={() => setOpen(false)}>
        <div>
            <Wrap
                style={{
                    zIndex: 3000,
                    borderRadius: 30, borderStyle: "solid", borderWidth: 1, borderColor: "rgb(51 50 50)",
                    margin: 3
                }}
                position="fixed" backgroundColor={AppbarColor}
                onClick={() => setOpen(oldOpen => !oldOpen)} padding={{left: 7, top: 7, right: 7, bottom: 0}}>
                <Menu style={{width: 40, height: 40}}/>
            </Wrap>
            <SwipeableDrawer
                variant="temporary"
                anchor="left"
                onOpen={() => setOpen(true)} onClose={() => setOpen(false)}
                open={open}
                SlideProps={{
                    style: {
                        marginTop: HeaderHeight,
                        backgroundColor: "transparent",
                        backgroundImage: "unset"/*, backgroundColor: "transparent"*/
                    }
                }}
            >
                <ButtonGroup style={{backgroundColor: NavigationDrawerColor}} orientation={"vertical"}
                             variant={"contained"}>
                    <NavigationDrawerContent sectionState={props.sectionState} report={props.report}/>
                </ButtonGroup>
                {/*Since the drawer is margined by HeaderHeight pixels, the bottom HeaderHeight pixels of the drawer
                    will get clipped if there is no space.
                    For some reason, css won't recognize that it will need to scroll for the bottom HeaderHeight pixels.
                    So to give it a reason to scroll HeaderHeight more pixels, we put an empty space. This way it will scroll to
                    cover the missed bottom pixels.
                    */}
                <Spacer height={HeaderHeight}/>
            </SwipeableDrawer>
        </div>
    </ClickAwayListener>

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
                                          active={!sectionsEqual(section, sectionState.activeSection)}
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