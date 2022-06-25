import {Rect} from "../types/Gui";

export interface Cookie {
    name: string
    value: string
    expires: Date
    // path: string
}

export function setCookie(cookie: Cookie) {
    document.cookie = `${cookie.name}=${encodeURIComponent(cookie.value)};expires=${cookie.expires.toUTCString()};path=${window.location.pathname}`
}

export function getCookieValue(name: string): string | undefined {
    const cookies = document.cookie.split("; ");
    const targetCookie = cookies.find(row => row.startsWith(name + "="))
    if (targetCookie === undefined) return undefined;
    const [key, value] = targetCookie.split("=")
    return value;
}

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