import {objectFilter, objectMap} from "./Generic";


interface PageArgs {
    nocache: boolean
    code?: string
}

type Raw<T> = {
    [P in keyof T]?: string;
};

export function initPageArgs(): boolean {
    const parsed = parsePageArgs();
    if (parsed === undefined) return false;
    const partialArgs = parsed as Raw<PageArgs>;

    pageArgs = {
        nocache: partialArgs.nocache === "true",
        // Never keep the code in the url
        //TODO: store in cookies
        code: undefined
    }

    setPageArgs(pageArgs);
    return true;
}

export function getCurrentCrashId(): string {
    return window.location.pathname.slice(1);
}

export function getUrlNoCache(): boolean {
    return getPageArgs().nocache;
}

export function setUrlNoCache(value: boolean) {
    updatePageArgs(args => {
        args.nocache = value
    })
}

// export function getUrlCode(): string {
//     return getPageArgs().code;
// }
// export function setUrlCode(code: string) {
//     updatePageArgs(args => {
//         args.code = code;
//     })
// }

function updatePageArgs(updater: (args: PageArgs) => void) {
    const args = getPageArgs();
    updater(args)
    setPageArgs(args);
}


function serializePageArgs(args: PageArgs): string {
    const asRecord = args as unknown as Record<string, unknown>;
    const noDefaults = objectFilter(asRecord, (key, value) => value !== undefined && value !== false);
    return objectMap(noDefaults, (key, value) =>value === true ? key : `${key}=${value}` ).join(ARG_SEPARATOR)

}

function getPageArgs(): PageArgs {
    if (pageArgs == null) throw new Error("Page args not initialized");
    return pageArgs;
}

let pageArgs: PageArgs | null = null

function setPageArgs(args: PageArgs) {
    pageArgs = args;
    const serialized = serializePageArgs(args);
    setUrlSearch(serialized);
}

// Custom implementation because chrome leaves the leading '?', and refreshes even when old href is the same as new one
function setUrlSearch(newSearch: string) {
    const href = window.location.href;
    const queryIndex = href.indexOf(ARG_PREFIX);
    const firstPart = queryIndex === -1 ? href : href.slice(0, queryIndex);
    const secondPart = newSearch === "" ? "" : ARG_PREFIX + newSearch;
    const newHref = firstPart + secondPart;
    if (newHref !== href) {
        window.location.href = newHref;
    }
}


//TODO: right at the start, perform a 'fixUrl' that quickly fetches the code, removes it, and resets the entire url if nonsense was passed.
//TODO: in the fixup remove args that don't do anything
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

// const NO_CACHE_PARAMETER = "nocache"
// const CODE_PARAMETER = "code";
const ARG_SEPARATOR = "&"
const ARG_PREFIX = "?"
const ARG_ASSIGNMENT = "="