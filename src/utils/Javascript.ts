import {Key, typedKeys} from "../../parser/src/util/Utils";
import {Rect} from "./Gui";

export function removeSuffix(str: string, suffix: string): string {
    return str.endsWith(suffix) ? str.slice(0, str.length - suffix.length) : str;
}

export function objectMap<V, R>(object: Record<string, V>, mapFn: (key: string, value: V, index: number) => R): R[] {
    return typedKeys(object).map((key, index) => mapFn(key, object[key], index), {});
}

export function objectFilter<V>(object: Record<string, V>, filter: (key: string, value: V) => boolean): Record<string, V> {
    const newObj: Record<string, V> = {};
    for (const key in object) {
        const value = object[key];
        if (filter(key, object[key])) newObj[key] = value;
    }
    return newObj;
}

export function objectIsEmpty(object: Record<string, unknown>): boolean {
    return Object.keys(object).length === 0;
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


export function withoutKey<K extends Key, V, RK extends Key>(record: Record<K, V>, key: RK): Omit<Record<K, V>, RK> {
    if (!(key in record)) return record;
    const {[key]: value, ...otherProps} = record;
    return otherProps;
}

export function withProperty<K extends Key, V>(record: Record<K, V>, key: K, value: V): Record<K, V> {
    if (key in record) return record;
    return {...record, [key]: value};
}

export function coercePreferMin(num: number, bounds: { min: number, max: number }): number {
    // Opinionated referral of min over max
    if (bounds.min > bounds.max) return bounds.min;
    if (num < bounds.min) return bounds.min;
    else if (num > bounds.max) return bounds.max
    else return num;
}

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