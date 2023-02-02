import {MappingsNamespace} from "../mappings/MappingsNamespace";
import {getComplexCookie, setComplexCookie} from "../fudge-commons/methods/Browser";

export interface UserPreferences {
    defaultMappingNamespace: string
    showModIds: string
    // Undefined - true on desktop, false on mobile
    showModVersions?: string
}

const defaultUserPreferences: UserPreferences = {
    defaultMappingNamespace: "Yarn",
    showModIds: "false",
    showModVersions: undefined
}

const PREFERENCES_COOKIE = "preferences";

export function getUserPreferences(): UserPreferences {
    return userPreferences
}

let userPreferences: UserPreferences = getComplexCookie(PREFERENCES_COOKIE) ?? defaultUserPreferences
const MILLISECONDS_IN_DAY = 24 * 60 * 60 * 1000;
const LIFETIME_DAYS = 100;

export function setUserPreferences(preferences: Partial<UserPreferences>) {
    const expiration = new Date();
    expiration.setTime(expiration.getTime() + LIFETIME_DAYS * MILLISECONDS_IN_DAY);
    const newPrefs: UserPreferences = {...userPreferences, ...preferences}
    setComplexCookie(PREFERENCES_COOKIE, newPrefs, expiration)
    userPreferences = newPrefs
}