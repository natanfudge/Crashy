import {objectFilter, objectMap, removeSuffix} from "./Javascript";

export function serializePageArgs(args: Record<string, unknown>): string {
    const asRecord = args as unknown as Record<string, unknown>;
    const noDefaults = objectFilter(asRecord, (key, value) => value !== undefined && value !== false);
    return objectMap(noDefaults, (key, value) => value === true ? key : `${key}=${value}`).join(ARG_SEPARATOR)
}

export function parsePageQuery(): Record<string, string> | undefined {
    const raw = window.location.search;
    if (raw.length === 0) return {};
    if (raw[0] !== ARG_PREFIX) return undefined;
    const noQuestionMark = raw.slice(1);
    const parts = noQuestionMark.split(ARG_SEPARATOR)
    const result: Record<string, string> = {};
    for (const part of parts) {
        const keyValue = part.split(ARG_ASSIGNMENT)
        if (keyValue.length > 2) return undefined;
        result[keyValue[0]] = keyValue.length === 2 ? keyValue[1] : "true";
    }
    return result;
}

export function updateUrl(newUrl: { search: string, pathname: string }) {
    const oldHref = window.location.href;
    const url = new URL(oldHref);
    url.search = newUrl.search;
    url.pathname = newUrl.pathname;
    const newHref = removeSuffix(url.href, "?");
    if (oldHref !== newHref) {
        window.location.href = newHref;
    }
}


const ARG_SEPARATOR = "&"
const ARG_PREFIX = "?"
const ARG_ASSIGNMENT = "="