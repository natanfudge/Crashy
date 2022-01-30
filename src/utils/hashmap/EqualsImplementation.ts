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

function objectEquals(objectA: object | null, objectB: object | null): boolean {
    if (objectA === null) return objectB === null;
    if (objectB === null) return false;
    const keysA = Object.keys(objectA);
    const keysB = Object.keys(objectB);
    if (keysA.length !== keysB.length) return false;
    for(const keyA of keysA){
        // Using keyA on both is intentional
        // @ts-ignore
        if(!equalsOfAnything(objectA[keyA],objectB[keyA])) return false;
    }
    return true;
}
