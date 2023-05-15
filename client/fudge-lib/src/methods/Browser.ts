import {Rect} from "../types/Gui";
import {recordForEach} from "./Javascript";

export interface Cookie {
    name: string
    value: string
    expires: Date
    path?: string
    // path: string
}

export function setCookie(cookie: Cookie) {
    // console.log("Setting cookie with pathname " + window.location.pathname, cookie)
    document.cookie = `${cookie.name}=${encodeURIComponent(cookie.value)};expires=${cookie.expires.toUTCString()};path=${cookie.path ?? window.location.pathname}`
}

export function getCookieValue(name: string): string | undefined {
    const cookies = document.cookie.split("; ");
    const targetCookie = cookies.find(row => row.startsWith(name + "="))
    if (targetCookie === undefined) return undefined;
    const [key, value] = targetCookie.split("=")
    return value;
}

const complexCookiePrefix = "__"

export function getComplexCookie<T extends object>(name: string): T | undefined {
    // Complex cookies are stored as {complexName}__{fieldKey1}={fieldValue1}; {complexName}__{fieldKey2}={fieldValue2}
    const complexPrefix = name + complexCookiePrefix
    const cookies = document.cookie.split("; ");
    const cookieParts = cookies.filter(row => row.startsWith(complexPrefix))
    if (cookieParts.isEmpty()) return undefined;
    const obj: T = {} as T;
    for (const cookiePart of cookieParts) {
        const withoutPrefix = cookiePart.removePrefix(complexPrefix)
        const [key, value] = withoutPrefix.split("=")
        // @ts-ignore
        obj[key] = value === UndefinedMarker ? undefined : value
    }

    return obj;
}

export function setComplexCookie<T extends object>(name: string, value: T, expires: Date) {
    const complexPrefix = name + complexCookiePrefix
    recordForEach(value, (k, v) => {
        const value = v === undefined  ? UndefinedMarker : v;
        // noinspection SuspiciousTypeOfGuard
        if(typeof value !== "string"){
            throw new Error(`Complex cookie keys should only be strings (instead got: ${value} of type ${typeof value})`)
        }
        setCookie({name: complexPrefix + k, value: value, expires: expires, path: "/"})
    })
}

const UndefinedMarker = "$$$UNDEFINED$$$"

export function getDocumentRelativeRect(element?: Element | null): Rect { // crossbrowser version
    if (element === undefined || element === null) return {left: 0, top: 0, width: 0, height: 0}
    const box = element.getBoundingClientRect();
    return {
        top: box.top + window.scrollY,
        left: box.left + window.scrollX,
        width: box.width,
        height: box.height
    }
}