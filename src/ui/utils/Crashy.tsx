import {KeyboardArrowDown} from "@mui/icons-material";
import {Expansion, useExpansion} from "./simple/expansion/Api";
import {primaryColor} from "../Colors";
import React, {Fragment} from "react";
import {SingleChildParentProps, WithChild} from "./simple/SimpleElementProps";
import {SimpleImage} from "./simple/SimpleImage";
import {ClickCallback, Margin, Padding} from "./simple/GuiTypes";
import {SimpleIconButton} from "./simple/SimpleIconButton";
import {Surface} from "./simple/Surface";

export function CrashyLogo({size, margin}: { size: number, margin?: Margin }) {
    return <SimpleImage alt={"Logo"} src={process.env.PUBLIC_URL + '/favicon.svg'} width={size} height={size}
                        margin={margin}/>
}


export const CrashyNewIssueUrl = "https://github.com/natanfudge/Crashy/issues/new"


export interface ExpandingButtonProps {
    sticky: boolean;
}

export function MoreInfoButton(props: WithChild) {
    return <ExpandingIconButton sticky={false} buttonPadding={0}
                            icon={<KeyboardArrowDown style={{filter: "brightness(0.5)"}}/>}>
        {props.children}
    </ExpandingIconButton>
}

export function ExpandingIconButton({buttonPadding, icon, ...expandingButtonProps}:
                                        { buttonPadding?: Padding, icon: JSX.Element } & ExpandingButtonProps & SingleChildParentProps) {
    return <ExpandingButton
        {...expandingButtonProps}
        button={
            (handleClick) => <SimpleIconButton padding={buttonPadding} onClick={handleClick}>
                {icon}
            </SimpleIconButton>
        }
     />
}

type ClickableElement = (handleClick: (element: Element) => void) => JSX.Element

export function ExpandingButton({button, children, sticky, ...expansionProps}:
                                    { button: ClickableElement } & ExpandingButtonProps & SingleChildParentProps) {
    const expansion = useExpansion();

    const handleClick: ClickCallback = (element: Element) => {
        expansion.toggle(element);
    }

    return <Fragment>
        {button(handleClick)}
        <Expansion {...expansionProps} anchorReference={"bottom-center"} alignment={"top-center"} state={expansion}
                   onDismiss={() => expansion.hide()} sticky={sticky}>
            <ExpansionSurface>
                {children}
            </ExpansionSurface>
        </Expansion>
    </Fragment>
}


function ExpansionSurface(props: SingleChildParentProps) {
    return <Surface width={"max-content"} border={{style: "solid", color: primaryColor, width: 1}}  {...props}/>
}