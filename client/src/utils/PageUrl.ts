
import {parsePageQuery, serializePageArgs, updateUrl} from "fudge-commons/methods/PageUrl";
import {setCookieCrashCode} from "./Cookies";
import {TsObject} from "fudge-commons/types/Basic";


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




function getPageArgs(): PageArgs {
    if (pageArgs == null) throw new Error("Page args not initialized");
    return pageArgs;
}

let pageArgs: PageArgs | null = null

function setPageArgs(args: PageArgs) {
    pageArgs = args;
    const {crashId, ...query} = args;
    const serializedQuery = serializePageArgs(query as unknown as TsObject);
    updateUrl({search: serializedQuery, pathname: crashId ?? ""});
}


