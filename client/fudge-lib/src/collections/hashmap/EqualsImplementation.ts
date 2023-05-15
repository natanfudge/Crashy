import {TsObject} from "../../types/Basic";


export function equalsOfAnything(thingA: unknown, thingB: unknown): boolean {
    const typeA = typeof thingA;
    const typeB = typeof thingB;
    if (typeA !== typeB) return false;
    switch (typeA) {
        case "object":
            return objectEquals(thingA as TsObject | null, thingB as TsObject | null)
        case "string":
        case "undefined":
        case "boolean":
        case "number":
            return thingA === thingB
        case "symbol":
        case "bigint":
            return (thingA as symbol).toString() === (thingB as symbol).toString()
        case "function":
            throw new Error("Very unrecommended")
    }
}

const EqualsFunction = "equals"


function objectEquals(objectA: TsObject | null, objectB: TsObject | null): boolean {
    if (objectA === null) return objectB === null;
    if (objectB === null) return false;
    const equalsA = objectA[EqualsFunction]
    if (equalsA !== undefined && typeof equalsA === "function") {
        // This should check they are of the same type
        if (objectB[EqualsFunction] !== equalsA) return false;
        return equalsA.bind(objectA)(objectB) === true
    } else {
        return defaultObjectEquals(objectA, objectB)
    }
}

function defaultObjectEquals(objectA: TsObject, objectB: TsObject): boolean {
    const keysA = Object.keys(objectA);
    const keysB = Object.keys(objectB);
    if (keysA.length !== keysB.length) return false;
    for (const keyA of keysA) {
        const valueA = objectA[keyA]
        if (typeof valueA !== "function") {
            // Using keyA on both is intentional
            if (!equalsOfAnything(valueA, objectB[keyA])) return false;
        }

    }
    return true;
}

