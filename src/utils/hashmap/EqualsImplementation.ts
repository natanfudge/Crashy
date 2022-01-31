export function equalsOfAnything(thingA: unknown, thingB: unknown): boolean {
    const typeA = typeof thingA;
    const typeB = typeof thingB;
    if (typeA !== typeB) return false;
    switch (typeA) {
        case "object":
            return objectEquals(thingA as object | null, thingB as object | null)
        case "string":
        case "undefined":
        case "boolean":
        case "number":
            return thingA === thingB
        case "symbol":
        case "bigint":
            return (thingA as Symbol).toString() === (thingB as Symbol).toString()
        case "function":
            throw new Error("Very unrecommended")
    }
}

//export function objectIsValueObject(obj: object | null) : boolean{
//     // @ts-ignore
//     const isValueClass = obj[ValueClassMarker];
//     return isValueClass === true
// }
//
// function objectEquals(objectA: object | null, objectB: object | null): boolean {
//     // @ts-ignore
//     if (objectIsValueObject(objectA)) {
//         return objectValueEquals(objectA, objectB)
//     } else {
//         return objectA === objectB;
//     }
// }
function objectEquals(objectA: object | null, objectB: object | null): boolean {
    if (objectA === null) return objectB === null;
    if (objectB === null) return false;
    const keysA = Object.keys(objectA);
    const keysB = Object.keys(objectB);
    if (keysA.length !== keysB.length) return false;
    for (const keyA of keysA) {
        // @ts-ignore
        const valueA = objectA[keyA]
        if (typeof valueA !== "function") {
            // Using keyA on both is intentional
            // @ts-ignore
            if (!equalsOfAnything(valueA, objectB[keyA])) return false;
        }

    }
    return true;
}

