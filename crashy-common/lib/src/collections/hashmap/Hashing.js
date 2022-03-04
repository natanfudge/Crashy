"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashString = exports.hashArray = exports.hashCodeOfAnything = void 0;
function hashCodeOfAnything(thing) {
    switch (typeof thing) {
        case "object":
            return hashObject(thing);
        case "string":
            return hashString(thing);
        case "undefined":
            return 1;
        case "boolean":
            return thing ? 2 : 3;
        case "number":
            return thing;
        case "symbol":
        case "bigint":
            return hashString(thing.toString());
        case "function":
            throw new Error("Very unrecommended");
    }
}
exports.hashCodeOfAnything = hashCodeOfAnything;
// Taken from the JDK Arrays.hashCode() implementation
function hashArray(arr) {
    var result = 1;
    for (var _i = 0, arr_1 = arr; _i < arr_1.length; _i++) {
        var element = arr_1[_i];
        result = 31 * result + hashCodeOfAnything(element);
        result = result & result; // Convert to 32bit integer
    }
    return result;
}
exports.hashArray = hashArray;
function hashObject(obj) {
    if (obj === null)
        return 0;
    var customHashFunction = obj["hashCode"];
    if (customHashFunction !== undefined && typeof customHashFunction === "function") {
        return customHashFunction.bind(obj)();
    }
    else {
        return hashArray(Object.values(obj));
    }
}
//function hashObjectByValue(obj: object | null): number {
//     if (obj === null) return 0;
//     return hashArray(Object.values(obj));
// }
// function hashObject(obj: object | null): number {
//     if(objectIsValueObject(obj)) return hashObjectByValue(obj)
//     else
//     if (obj === null) return 0;
//     return hashArray(Object.values(obj));
// }
function hashString(str) {
    return cyrb53(str);
}
exports.hashString = hashString;
// Taken from https://stackoverflow.com/a/52171480/7773885
function cyrb53(str, seed) {
    if (seed === void 0) { seed = 0; }
    var h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
    for (var i = 0; i < str.length; i++) {
        var ch = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return 4294967296 * (2097151 & h2) + (h1 >>> 0);
}
