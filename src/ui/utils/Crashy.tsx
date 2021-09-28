import {ClickCallback, Margin, Padding, SingleChildParentProps, WithChild} from "./improvedapi/Element";
import {CImage} from "./improvedapi/Core";
import {KeyboardArrowDown} from "@mui/icons-material";
import {Expansion, useExpansion} from "./expansion/Api";
import {CIconButton, Surface} from "./improvedapi/Material";
import {primaryColor} from "../Colors";
import React, {Fragment} from "react";

export function CrashyLogo({size, margin}: { size: number, margin?: Margin }) {
    return <CImage alt={"Logo"} src={process.env.PUBLIC_URL + '/favicon.svg'} width={size} height={size}
                   margin={margin}/>
}





export interface ExpandingButtonProps {
    id: string;
    sticky: boolean;
}

export function MoreInfoButton(props: WithChild & { id: string }) {
    return <ExpandingButton sticky={false} id={props.id} buttonPadding={0}
                            icon={<KeyboardArrowDown style={{filter: "brightness(0.5)"}}/>}>
        {props.children}
    </ExpandingButton>
}


export function ExpandingButton({buttonPadding, icon, id, children, sticky, ...expansionProps}:
                                    { buttonPadding?: Padding, icon: JSX.Element } & ExpandingButtonProps & SingleChildParentProps) {
    const expansion = useExpansion();

    const handleClick: ClickCallback = (element: Element) => expansion.toggle(element)

    return <Fragment>
        <CIconButton padding={buttonPadding} onClick={handleClick}>
            {icon}
        </CIconButton>
        <Expansion {...expansionProps} anchorReference={"bottom-center"} position={"top-center"} state={expansion}
                   onDismiss={() => expansion.hide()} id={id} sticky={sticky}>
            <ExpansionSurface>
                {children}
            </ExpansionSurface>
        </Expansion>
    </Fragment>
}


function ExpansionSurface(props: SingleChildParentProps) {
    return <Surface width={"max-content"} style={{border: `solid ${primaryColor} 1px`}} {...props}/>
}