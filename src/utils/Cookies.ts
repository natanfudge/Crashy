import {getCookieValue, setCookie} from "./Javascript";

const CODE_COOKIE = "code";
const MILLISECONDS_IN_DAY = 24 * 60 * 60 * 1000;
const LIFETIME_DAYS = 30;

export function setCookieCrashCode(code: string) {
    const expiration = new Date();
    expiration.setTime(expiration.getTime() + LIFETIME_DAYS * MILLISECONDS_IN_DAY);
    setCookie({name: CODE_COOKIE, value: code, expires: expiration})
}

export function getCookieCrashCode(): string | undefined {
    return getCookieValue(CODE_COOKIE);
}