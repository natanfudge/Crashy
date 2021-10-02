type Key = string | number | symbol

export function typedKeys<K extends Key, V>(object: Record<K, V>): K[] {
    return Object.keys(object) as K[];
}

export function objectMap<V, R>(object: Record<string, V>, mapFn: (key: string, value: V, index: number) => R): R[] {
    return typedKeys(object).map((key, index) => mapFn(key, object[key], index), {});
}

export function objectFilter<V>(object: Record<string, V>, filter: (key: string, value: V) => boolean): Record<string, V> {
    const newObj: Record<string, V> = {};
    for (const key in object) {
        const value = object[key];
        if (filter(key, object[key])) newObj[key] = value;
    }
    return newObj;
}

export function objectIsEmpty(object: Record<string,unknown>) : boolean {
    return Object.keys(object).length === 0;
}

export function isObj(x: unknown): x is Record<string, unknown> {
    return typeof x === 'object' && x != null;
}

export function areArraysEqualSets<T>(a1: T[], a2: T[]) {
    const superSet: Record<string, number> = {};
    for (const i of a1) {
        const e = i + typeof i;
        superSet[e] = 1;
    }

    for (const i of a2) {
        const e = i + typeof i;
        if (superSet[e] === 0) {
            return false;
        }
        superSet[e] = 2;
    }

    for (const e in superSet) {
        if (superSet[e] === 1) {
            return false;
        }
    }

    return true;
}

export function splitFilter<T>(array: T[], condition: (element: T) => boolean): [T[], T[]] {
    const match: T[] = [];
    const noMatch: T[] = [];
    for (const element of array) {
        if (condition(element)) match.push(element)
        else noMatch.push(element)
    }
    return [match, noMatch];
}


export function withoutKey<K extends Key, V, RK extends Key>(record: Record<K, V>, key: RK): Omit<Record<K, V>, RK> {
    if (!(key in record)) return record;
    const {[key]: value, ...otherProps} = record;
    return otherProps;
}

export function withProperty<K extends Key, V>(record: Record<K, V>, key: K, value: V): Record<K, V> {
    if (key in record) return record;
    return {...record, [key]: value};
}

export function coercePreferMin(num: number, bounds: { min: number, max: number }): number {
    // Opinionated referral of min over max
    if (bounds.min > bounds.max) return bounds.min;
    if (num < bounds.min) return bounds.min;
    else if (num > bounds.max) return bounds.max
    else return num;
}

export function toNumericAlignment(edge: Alignment): NumericAlignment {
    if (typeof edge !== "string") return edge;
    switch (edge) {
        case "top-left":
            return {x: 0, y: 0}
        case "top-center":
            return {x: 0.5, y: 0}
        case "top-right":
            return {x: 1, y: 0}
        case "middle-left":
            return {x: 0, y: 0.5}
        case "center":
            return {x: 0.5, y: 0.5}
        case "middle-right":
            return {x: 1, y: 0.5}
        case "bottom-left":
            return {x: 0, y: 1}
        case "bottom-center":
            return {x: 0.5, y: 1}
        case "bottom-right":
            return {x: 1, y: 1}
    }
}

export interface NumericAlignment {
    /**
     * 0.0 to 1.0
     */
    x: number
    /**
     * 0.0 to 1.0
     */
    y: number
}

export type EdgeAlignment =
    "top-left"
    | "top-center"
    | "top-right"
    | "middle-left"
    | "center"
    | "middle-right"
    | "bottom-left"
    | "bottom-center"
    | "bottom-right"
export type Alignment = EdgeAlignment | NumericAlignment

export interface Rect {
    top: number;
    left: number;
    height: number;
    width: number;
}


export type Require<T, K extends keyof T> = Omit<T, K> & {
    [RequiredProperty in K]-?: T[RequiredProperty]
}
export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>