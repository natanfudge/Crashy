import {parsePageQuery} from "./PageUrlImpl";
import {setCookieCrashCode} from "./Cookies";


function parsePageCrashId(): string | undefined {
    const pathName = window.location.pathname;
    if (pathName.length <= 1) return undefined;
    else return pathName.slice(1);
}

export function getUrlCrashId(): string | undefined {
    return parsePageCrashId()
}

// When a crashy link is uploaded via Not Enough Crashes, we need some way to signal the browser what the deletion key is.
// The way do it is by appending ?code=<code> to the url.
// The problem is that we don't then want the users to accidentally share that code when they sure the url with each other.
// So we save the crash code, and refresh the url without the ?code.
export function consumeCrashCode() {
    const code = parsePageQuery()?.["code"]
    // A valid code is 6 characters
    if (code != null && code.length === 6) {
        const newUrl = new URL(window.location.href)
        newUrl.search = ""
        window.history.replaceState({}, "", newUrl)
        // window.location.search = ""
        setCookieCrashCode(code)
    }
}

export function goToUploadedCrash(crash: { id: string, code: string }) {
    const newUrl = new URL(window.location.href)
    newUrl.pathname = `/${crash.id}`
    window.history.pushState({id: crash.id}, '', newUrl)
    setCookieCrashCode(crash.code)
    // Make the app update itself
    // @ts-ignore
    window.onpopstate()
}

