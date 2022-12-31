
import {parsePageQuery, serializePageArgs, updateUrl} from "./PageUrlImpl";
import {setCookieCrashCode} from "./Cookies";
import {TsObject} from "../fudge-commons/types/Basic";
import {useEffect, useState} from "react";



function parsePageCrashId(): string | undefined {
    const pathName = window.location.pathname;
    if (pathName.length <= 1) return undefined;
    else return pathName.slice(1);
}
export function getUrlCrashId(): string | undefined{
    return parsePageCrashId()
}

// When a crashy link is uploaded via Not Enough Crashes, we need some way to signal the browser what the deletion key is.
// The way do it is by appending ?code=<code> to the url.
// The problem is that we don't then want the users to accidentally share that code when they sure the url with each other.
// So we save the crash code, and refresh the url without the ?code.
export function consumeCrashCode(){
    const code = parsePageQuery()?.["code"]
    // A valid code is 6 characters
    if(code != null && code.length === 6){
        window.location.search = ""
        setCookieCrashCode(code)
    }
}

export function goToUploadedCrash(crash: { id: string, code: string }) {
    setCookieCrashCode(crash.code)
    const newUrl = new URL(window.location.href)
    newUrl.pathname = `/${crash.id}`
    window.history.pushState({id: crash.id}, '', newUrl)
    // Make the app update itself
    // @ts-ignore
    window.onpopstate()
}



// const listeners : ((args: PageArgs) => void)[] = []
//
// export function setupPageArgs() {
//     // Listen to back button
//     window.onpopstate = callListeners
// }
//
// function callListeners(){
//     listeners.forEach((listener) => listener(window.history.state))
// }
//
// export function usePageArgs(): PageArgs {
//     const [args, setArgs] = useState(window.history.state);
//     useEffect(() => {
//         listeners.push(setArgs)
//     },[])
//     return args
// }
//
// export function replacePageArgs(args: Partial<PageArgs>) {
//     history.replaceState(args,'')
//     // @ts-ignore
//     // Call listeners
//     window.onpopstate()
// }

// export function PageUrlProvider() {
//
// }

// export function getUrlCrashId(): string | undefined {
//     return getPageArgs().crashId;
// }
//
// export function getUrlNoCache(): boolean {
//     return getPageArgs().nocache;
// }
//
// export function getUrlIsRaw(): boolean {
//     return getPageArgs().raw;
// }
//
// export function setUrlNoCache(value: boolean) {
//     updatePageArgs(args => {
//         args.nocache = value
//     })
// }
//
// export function setUrlRaw(value: boolean) {
//     updatePageArgs(args => {
//         args.raw = value
//     })
// }
//
// type Raw<T> = {
//     [P in keyof T]?: string;
// };
//
// export function initPageArgs(): boolean {
//     const query = parsePageQuery();
//     if (query === undefined) return false;
//     const partialArgs = query as Raw<PageArgs>;
//
//     if (partialArgs.code !== undefined) {
//         // console.log("Setting cookie code: ")
//         setCookieCrashCode(partialArgs.code)
//     }
//
//     pageArgs = {
//         nocache: partialArgs.nocache === "true",
//         raw: partialArgs.raw === "true",
//         // Never keep the code in the url
//         code: undefined,
//         crashId: parsePageCrashId()
//     }
//
//     setPageArgs(pageArgs);
//     return true;
// }
//
// function parsePageCrashId(): string | undefined {
//     const pathName = window.location.pathname;
//     if (pathName.length <= 1) return undefined;
//     else return pathName.slice(1);
// }
//
//
//
//
// export function goToUploadedCrash(crash: { id: string, code: string }) {
//
//
//     // history.pushState({crashId: crash.id, crashCode: crash.code, nocache: false}, '', )
//     updatePageArgs(args => {
//         args.crashId = crash.id;
//         args.code = crash.code;
//         args.nocache = false;
//     })
// }
//
// function updatePageArgs(updater: (args: PageArgs) => void) {
//     const args = getPageArgs();
//     updater(args)
//     console.log("New args: " + args)
//     setPageArgs(args);
// }
//
//
//
//
// function getPageArgs(): PageArgs {
//     if (pageArgs == null) throw new Error("Page args not initialized");
//     return pageArgs;
// }
//
// let pageArgs: PageArgs | null = null
//
// function setPageArgs(args: PageArgs) {
//     pageArgs = args;
//     const {crashId, ...query} = args;
//     const serializedQuery = serializePageArgs(query as unknown as TsObject);
//     updateUrl(args, {search: serializedQuery, pathname: crashId ?? ""});
// }
//

