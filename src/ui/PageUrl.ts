import {NO_CACHE_PAGE_PARAMETER} from "./Constants";

export {} //
export interface CrashId {
    value: string
    noCache: boolean
} //
//
export function getCurrentCrashId(): CrashId {
    const id = window.location.pathname.slice(1);
    const noCache = window.location.search.slice(1);
    return {
        value: id,
        noCache: noCache === NO_CACHE_PAGE_PARAMETER
    };
}