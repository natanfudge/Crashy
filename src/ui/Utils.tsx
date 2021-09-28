import {CImage} from "./improvedapi/Core";
import React from "react";
import {ClickCallback, Margin, Padding, SingleChildParentProps, WithChild} from "./improvedapi/Element";
import {KeyboardArrowDown} from "@mui/icons-material";
import {CIconButton, Surface} from "./improvedapi/Material";
import {primaryColor} from "./Colors";
import {StringMap} from "../../parser/src/model/CrashReport";
import {Expansion, useExpansion} from "./improvedapi/Expansion";

export interface HttpResponse {
    body: string
    code: number
}

export function typedKeys<K extends Key, V>(object: Record<K, V>): K[] {
    return Object.keys(object) as K[];
}

export function objectMap<V, R>(object: Record<string, V>, mapFn: (key: string, value: V, index: number) => R): R[] {
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

export function coerce(num: number, bounds: { min: number, max: number }): number {
    if (num < bounds.min) return bounds.min;
    else if (num > bounds.max) return bounds.max
    else return num;
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

    return <div>
        <CIconButton padding={buttonPadding} onClick={handleClick}>
            {icon}
        </CIconButton>
        <Expansion {...expansionProps} anchorReference={"bottom-center"} position={"top-center"} state={expansion}
                   onDismiss={() => expansion.hide()} id={id} sticky={sticky}>
            <ExpansionSurface>
                {children}
            </ExpansionSurface>
        </Expansion>
    </div>
}


function ExpansionSurface(props: SingleChildParentProps) {
    return <Surface width={"max-content"} style={{border: `solid ${primaryColor} 1px`}} {...props}/>
}
