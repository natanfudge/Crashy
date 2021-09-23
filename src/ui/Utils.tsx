import {CImage} from "./improvedapi/Core";
import React from "react";
import {ClickCallback, Margin, Padding, SingleChildParentProps, WithChild} from "./improvedapi/Element";
import {KeyboardArrowDown} from "@mui/icons-material";
import {Box, ClickAwayListener, Popper} from "@mui/material";
import {CIconButton, Surface} from "./improvedapi/Material";
import {primaryColor} from "./Colors";
import {StringMap} from "../model/CrashReport";

export interface HttpResponse {
    body: string
    code: number
}


export function objectMap(object: StringMap, mapFn: (key: string, value: string, index: number) => any) {
    return Object.keys(object).map(function (key, index) {
        return mapFn(key, object[key], index);
    }, {})
}

function parseParameters(parameters: StringMap): string {
    if (Object.values(parameters).length === 0) return "";
    else {
        return "?" + objectMap(parameters, (key, value) => `${key}=${value}`).join("&")
    }
}
//TODO:nocache is broken...
async function httpCall(url: string, parameters: StringMap, method: string, body: string | null, noCache: boolean): Promise<HttpResponse> {
    // Add useless parameter to bust cache if needed
    // const actualParameters = noCache ? {noCache: "", ...parameters} : parameters;
    const actualUrl = url + parseParameters(parameters);
    const response = await fetch(actualUrl, {
        method: method,
        body: body,
        headers: noCache ? {
            "Cache-Control": "no-cache, no-store, max-age=0, must-revalidate",
            Pragma: "no-cache",
            Expires: "0"
        } : undefined
    })

    return {
        code: response.status,
        body: await response.text(),
    }
}


export async function httpGet(url: string, noCache: boolean, parameters: StringMap = {}): Promise<HttpResponse> {
    return httpCall(url, parameters, "GET", null, noCache);
}

export async function httpDelete(url: string, parameters: StringMap, noCache: boolean = false): Promise<HttpResponse> {
    return httpCall(url, parameters, "DELETE", null, noCache);
}

export async function httpPost(url: string, body: string, noCache: boolean = false, parameters: StringMap = {}): Promise<HttpResponse> {
    return httpCall(url, parameters, "POST", body, noCache);
}

export function CrashyLogo({size, margin}: { size: number, margin?: Margin }) {
    return <CImage alt={"Logo"} src={process.env.PUBLIC_URL + '/favicon.svg'} width={size} height={size}
                   margin={margin}/>
}


export function MoreInfoButton(props: WithChild) {
    return <ExpandingButton buttonPadding={0} icon={<KeyboardArrowDown style={{filter: "brightness(0.5)"}}/>}>
        {props.children}
    </ExpandingButton>
}


export function ExpandingButton({buttonPadding, icon, ...expansionProps}:
                                    { buttonPadding?: Padding, icon: JSX.Element } & SingleChildParentProps) {
    const [anchorEl, setAnchorEl] = React.useState<Element | undefined>(undefined);

    const handleClick: ClickCallback = (event: Element) => {
        setAnchorEl(anchorEl ? undefined : event);
    };

    // noinspection RequiredAttributes
    return <div>
        <CIconButton padding={buttonPadding} onClick={handleClick}>
            {icon}
        </CIconButton>
        <Expansion {...expansionProps} anchorEl={anchorEl} setAnchorEl={setAnchorEl}/>
    </div>
}

export function Expansion({anchorEl, setAnchorEl, ...surfaceProps}: {
    anchorEl: Element | undefined, setAnchorEl: (el: Element | undefined) => void
} & SingleChildParentProps): JSX.Element {
    const open = Boolean(anchorEl);

    // noinspection RequiredAttributes
    return <Popper open={open} anchorEl={anchorEl}>
        <Box>
            <ExpansionSurface {...surfaceProps} closePopup={() => setAnchorEl(undefined)}/>
        </Box>
    </Popper>
}

function ExpansionSurface({closePopup, children, ...otherProps}: { closePopup: () => void } & SingleChildParentProps) {
    return <Surface style={{border: `solid ${primaryColor} 1px`}} {...otherProps}>
        <ClickAwayListener onClickAway={() => closePopup()}>
            <div>
                {children}
            </div>
        </ClickAwayListener>
    </Surface>

}
