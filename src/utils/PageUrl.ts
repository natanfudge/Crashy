import {objectFilter, objectMap, removeSuffix, setCookie} from "./Javascript";
import {setCookieCrashCode} from "./Cookies";


interface PageArgs {
    nocache: boolean
    code?: string
    crashId?: string
    raw: boolean
}

export function getUrlCrashId(): string | undefined {
    return getPageArgs().crashId;
}

export function getUrlNoCache(): boolean {
    return getPageArgs().nocache;
}

export function getUrlIsRaw(): boolean {
    return getPageArgs().raw;
}

export function setUrlNoCache(value: boolean) {
    updatePageArgs(args => {
        args.nocache = value
    })
}

export function setUrlRaw(value: boolean) {
    updatePageArgs(args => {
        args.raw = value
    })
}

type Raw<T> = {
    [P in keyof T]?: string;
};

export function initPageArgs(): boolean {
    const query = parsePageQuery();
    if (query === undefined) return false;
    const partialArgs = query as Raw<PageArgs>;

    if (partialArgs.code !== undefined) {
        setCookieCrashCode(partialArgs.code)
    }

    pageArgs = {
        nocache: partialArgs.nocache === "true",
        raw: partialArgs.raw === "true",
        // Never keep the code in the url
        code: undefined,
        crashId: parsePageCrashId()
    }

    setPageArgs(pageArgs);
    return true;
}

function parsePageCrashId(): string | undefined {
    const pathName = window.location.pathname;
    if (pathName.length <= 1) return undefined;
    else return pathName.slice(1);
}




export function goToUploadedCrash(crash: { id: string, code: string }) {
    updatePageArgs(args => {
        args.crashId = crash.id;
        args.code = crash.code;
        args.nocache = false;
    })
}

function updatePageArgs(updater: (args: PageArgs) => void) {
    const args = getPageArgs();
    updater(args)
    setPageArgs(args);
}


function serializePageArgs(args: PageArgs): string {
    const asRecord = args as unknown as Record<string, unknown>;
    const noDefaults = objectFilter(asRecord, (key, value) => value !== undefined && value !== false);
    return objectMap(noDefaults, (key, value) => value === true ? key : `${key}=${value}`).join(ARG_SEPARATOR)

}

function getPageArgs(): PageArgs {
    if (pageArgs == null) throw new Error("Page args not initialized");
    return pageArgs;
}

let pageArgs: PageArgs | null = null

function setPageArgs(args: PageArgs) {
    pageArgs = args;
    const {crashId, ...query} = args;
    const serializedQuery = serializePageArgs(query);
    updateUrl({search: serializedQuery, pathname: crashId ?? ""});
}

function updateUrl(newUrl: { search: string, pathname: string }) {
    const oldHref = window.location.href;
    const url = new URL(oldHref);
    url.search = newUrl.search;
    url.pathname = newUrl.pathname;
    const newHref = removeSuffix(url.href, "?");
    if (oldHref !== newHref) {
        window.location.href = newHref;
    }
}

function parsePageQuery(): Record<string, string> | undefined {
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