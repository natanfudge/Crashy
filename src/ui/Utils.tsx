import {CImage} from "./improvedapi/Core";
import React from "react";
import {ClickCallback, Margin, Padding, SingleChildParentProps, WithChild} from "./improvedapi/Element";
import {KeyboardArrowDown} from "@mui/icons-material";
import {Box, ClickAwayListener, Popover} from "@mui/material";
import {CIconButton, Surface} from "./improvedapi/Material";
import {primaryColor} from "./Colors";
import {StringMap} from "../../parser/src/model/CrashReport";

export interface HttpResponse {
    body: string
    code: number
}

export function typedKeys<K extends Key, V>(object: Record<K, V>): K[] {
    return Object.keys(object) as K[];
}

export function objectMap<V,R>(object: Record<string, V>, mapFn: (key: string, value: V, index: number) => R): R[] {
    return typedKeys(object).map((key, index) => mapFn(key, object[key], index), {});
}

export function isObject(x: unknown): x is Record<string, unknown> {
    return typeof x === 'object' && x != null;
}

function parseParameters(parameters?: StringMap): string {
    if (parameters === undefined) return "";
    if (Object.values(parameters).length === 0) return "";
    else {
        return "?" + objectMap(parameters, (key, value) => `${key}=${value}`).join("&")
    }
}

export function areArraysEqualSets<T>(a1: T[], a2: T[]) {
    const superSet: Record<string, number> = {};
    for (const i of a1) {
        const e = i + typeof i;
        superSet[e] = 1;
    }

    for (const i of a2) {
        const e = i + typeof i;
        if (superSet[e] === 0) {
            return false;
        }
        superSet[e] = 2;
    }

    for (const e in superSet) {
        if (superSet[e] === 1) {
            return false;
        }
    }

    return true;
}

export function splitFilter<T>(array: T[], condition: (element: T) => boolean): [T[], T[]] {
    const match: T[] = [];
    const noMatch: T[] = [];
    for (const element of array) {
        if (condition(element)) match.push(element)
        else noMatch.push(element)
    }
    return [match, noMatch];
}

type Key = string | number | symbol

export function withoutKey<K extends Key, V, RK extends Key>(record: Record<K, V>, key: RK): Omit<Record<K, V>, RK> {
    if (!(key in record)) return record;
    const {[key]: value, ...otherProps} = record;
    return otherProps;
}

export function withProperty<K extends Key, V>(record: Record<K, V>, key: K, value: V): Record<K, V> {
    if (key in record) return record;
    return {...record, [key]: value};
}

// interface GetResponse {
//     body: string
//     code: number
// }
//
// function oldFetch(url: string,request: {method: string, body: BodyInit, headers: StringMap}){
//     return new Promise(((resolve, reject) => {
//         const xmlHttp = new XMLHttpRequest();
//         xmlHttp.onreadystatechange = function () {
//             if (xmlHttp.readyState === 4) {
//                 resolve({body: xmlHttp.responseText, code: xmlHttp.status});
//             }
//         }
//         xmlHttp.open("GET", url, true); // true for asynchronous
//         xmlHttp.send(null);
//         xmlHttp.open(method, url, true); // true for asynchronous
//         xmlHttp.send(body);
//     }));
// }

async function httpCall(request: HttpRequest): Promise<HttpResponse> {
    // Add useless parameter to bust cache if needed
    // const actualParameters = noCache ? {noCache: "", ...parameters} : parameters;
    const actualUrl = request.url + parseParameters(request.parameters);
    const noCache = request.noCache === true;
    const noCacheHeaders: StringMap = noCache ? {
        "Cache-Control": "no-cache, no-store, max-age=0, must-revalidate",
        "Pragma": "no-cache",
        "Expires": "0"
    } : {}
    const response = await fetch(actualUrl, {
        method: request.method,
        body: request.body,
        headers: {...noCacheHeaders, ...request.headers},
        cache: noCache ? "no-cache" : undefined,
        mode: "cors"
    })

    return {
        code: response.status,
        body: await response.text(),
    }
}

interface HttpRequest {
    url: string
    method: string
    parameters?: StringMap
    headers?: StringMap
    noCache?: boolean
    body?: BodyInit
}


export type Require<T, K extends keyof T> = Omit<T, K> & {
    [RequiredProperty in K]-?: T[RequiredProperty]
}
export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>

type SpecificHttpRequest = Omit<HttpRequest, "method">
type HttpGetRequest = Omit<SpecificHttpRequest, "body">
type HttpDeleteRequest = Omit<SpecificHttpRequest, "body">
type HttpPostRequest = Require<SpecificHttpRequest, "body">


export async function httpGet(request: HttpGetRequest): Promise<HttpResponse> {
    return httpCall({...request, method: "GET"});
}

export async function httpDelete(request: HttpDeleteRequest): Promise<HttpResponse> {
    return httpCall({...request, method: "DELETE"});
}

export async function httpPost(request: HttpPostRequest): Promise<HttpResponse> {
    return httpCall({...request, method: "POST"});
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

    const handleClick: ClickCallback = (event: Element) => setAnchorEl(anchorEl !== undefined ? undefined : event);

    // noinspection RequiredAttributes
    return <div>
        <CIconButton padding={buttonPadding} onClick={handleClick}>
            {icon}
        </CIconButton>
        <OldExpansion {...expansionProps} anchorEl={anchorEl} setAnchorEl={setAnchorEl}/>
    </div>
}

//TODO: Popup disables actions outside.
//TODO: garbage button needs to be fixed to work with popover.
//TODO: can't scroll, disabling it makes the popup stick in the screen
// I think we want a custom implementation
export function OldExpansion({anchorEl, setAnchorEl, ...surfaceProps}: {
    anchorEl: Element | undefined, setAnchorEl: (el: Element | undefined) => void
} & SingleChildParentProps): JSX.Element {
    const open = Boolean(anchorEl);

    // noinspection RequiredAttributes
    return <Popover disableEnforceFocus /*disableScrollLock*/ hideBackdrop /*style = {{ position: 'static'}}*/
                    anchorOrigin={{vertical: "bottom", horizontal: "center"}}
                    transformOrigin={{vertical: "top", horizontal: "center"}} open={open} anchorEl={anchorEl}>
        <Box>
            <ExpansionSurface {...surfaceProps} closePopup={() => setAnchorEl(undefined)}/>
        </Box>
    </Popover>
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
