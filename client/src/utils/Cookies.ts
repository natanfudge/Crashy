import {getCookieValue, setCookie} from "../fudge-lib/methods/Browser";

const CODE_COOKIE = "code";
const MILLISECONDS_IN_DAY = 24 * 60 * 60 * 1000;
const LIFETIME_DAYS = 30;

export function setCookieCrashCode(code: string) {
    const expiration = new Date();
    expiration.setTime(expiration.getTime() + LIFETIME_DAYS * MILLISECONDS_IN_DAY);
    setCookie({name: CODE_COOKIE, value: code, expires: expiration})
    crashCode = code
}

let crashCode : string | undefined = getCookieValue(CODE_COOKIE)

export function getCookieCrashCode(): string | undefined {
    return crashCode
}
const DELETED_COOKIE = "deleted";

export function setCookieDeleted(deleted: boolean) {
    const expiration = new Date();
    expiration.setTime(expiration.getTime() + LIFETIME_DAYS * MILLISECONDS_IN_DAY);
    setCookie({name: DELETED_COOKIE, value: deleted ? "true":"false", expires: expiration})
    _deleted = deleted
}

export function getCookieDeleted(): boolean{
    return _deleted === true;
}

let _deleted: boolean | undefined = getCookieValue(DELETED_COOKIE) === "true"