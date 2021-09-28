import {objectMap} from "./Generic";

const NO_CACHE_PAGE_PARAMETER = "nocache"

const ARG_SEPARATOR = "&"
const ARG_PREFIX = "?"
const ARG_ASSIGNMENT = "="


//TODO: this should actually only return the crashid string
export function getCurrentCrashId(): string {
    return  window.location.pathname.slice(1);
}

export function getUrlNoCache(): boolean {
    return parsePageArgs()![NO_CACHE_PAGE_PARAMETER] === "true"
}

export function setUrlNoCache(value: boolean) {
    setPageArg(NO_CACHE_PAGE_PARAMETER, value)
}

function setPageArg(key: string, value: string | boolean) {
    const args = {...parsePageArgs()!, [key]: value};
    window.location.search = serializePageArgs(args);
}

function serializePageArgs(args: Record<string, string | boolean>): string {
    return ARG_PREFIX + objectMap(args, (key, value) => value === true ? key : `${key}=${value}`).join(ARG_SEPARATOR)
}

//TODO: right at the start, perform a 'fixUrl' that quickly fetches the code, removes it, and resets the entire url if nonsense was passed.
function parsePageArgs(): Record<string, string> | undefined {
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