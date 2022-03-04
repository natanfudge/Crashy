"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.equalsOfAnything = void 0;
function equalsOfAnything(thingA, thingB) {
    var typeA = typeof thingA;
    var typeB = typeof thingB;
    if (typeA !== typeB)
        return false;
    switch (typeA) {
        case "object":
            return objectEquals(thingA, thingB);
        case "string":
        case "undefined":
        case "boolean":
        case "number":
            return thingA === thingB;
        case "symbol":
        case "bigint":
            return thingA.toString() === thingB.toString();
        case "function":
            throw new Error("Very unrecommended");
    }
}
exports.equalsOfAnything = equalsOfAnything;
var EqualsFunction = "equals";
//TODO: test new equals stuff with javamethods and javaclasses
function objectEquals(objectA, objectB) {
    if (objectA === null)
        return objectB === null;
    if (objectB === null)
        return false;
    var equalsA = objectA[EqualsFunction];
    if (equalsA !== undefined && typeof equalsA === "function") {
        // This should check they are of the same type
        if (objectB[EqualsFunction] !== equalsA)
            return false;
        return equalsA.bind(objectA)(objectB) === true;
    }
    else {
        return defaultObjectEquals(objectA, objectB);
    }
}
function defaultObjectEquals(objectA, objectB) {
    var keysA = Object.keys(objectA);
    var keysB = Object.keys(objectB);
    if (keysA.length !== keysB.length)
        return false;
    for (var _i = 0, keysA_1 = keysA; _i < keysA_1.length; _i++) {
        var keyA = keysA_1[_i];
        var valueA = objectA[keyA];
        if (typeof valueA !== "function") {
            // Using keyA on both is intentional
            if (!equalsOfAnything(valueA, objectB[keyA]))
                return false;
        }
    }
    return true;
}
