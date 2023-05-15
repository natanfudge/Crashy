import {TsObject} from "../../types/Basic";

export function hashCodeOfAnything<T>(thing: unknown): number {
    switch (typeof thing) {
        case "object":
            return hashObject(thing as TsObject)
        case "string":
            return hashString(thing)
        case "undefined":
            return 1;
        case "boolean":
            return thing ? 2 : 3
        case "number":
            return thing;
        case "symbol":
        case "bigint":
            return hashString(thing.toString())
        case "function":
            throw new Error("Very unrecommended")
    }
}


// Taken from the JDK Arrays.hashCode() implementation
export function hashArray(arr: unknown[]): number {
    let result = 1;
    for (const element of arr) {
        result = 31 * result + hashCodeOfAnything(element);
        result = result & result; // Convert to 32bit integer
    }
    return result;
}

function hashObject(obj: TsObject | null): number {
    if (obj === null) return 0;
    const customHashFunction = obj["hashCode"]
    if (customHashFunction !== undefined && typeof customHashFunction === "function") {
        return customHashFunction.bind(obj)() as number
    } else {
        return hashArray(Object.values(obj));
    }
}

export function hashString(str: string): number {
    return cyrb53(str);
}

// Taken from https://stackoverflow.com/a/52171480/7773885
function cyrb53(str: string, seed = 0): number {
    let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
    for (let i = 0; i < str.length; i++) {
        const ch = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return 4294967296 * (2097151 & h2) + (h1 >>> 0);
}
