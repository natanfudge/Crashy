import {typedKeys} from "./Typescript";
import {TsKey} from "../types/Basic";


export function recordForEach<V, Rec extends Record<keyof Rec, V>, K extends keyof Rec>(record: Record<K, V>, action: (key: K, value: V) => void): void {
    for (const key in record) {
        action(key, record[key])
    }
}

export function mapRecord<K extends TsKey, V, NK extends TsKey, NV>(
    record: Record<K, V>, keyMap: (key: K, value: V) => NK, valueMap: (key: K, value: V) => NV
): Record<NK, NV> {
    const newRecord: Record<NK, NV> = {} as Record<NK, NV>
    for (const key in record) {
        const value = record[key]
        newRecord[keyMap(key, value)] = valueMap(key, value);
    }
    return newRecord
}

export function mapRecordValues<K extends TsKey, V, NV>(record: Record<K, V>, valueMap: (key: K, value: V) => NV): Record<K, NV> {
    return mapRecord(record, k => k, valueMap);
}

export function recordFilter<V, Rec extends Record<keyof Rec, V>, K extends keyof Rec>
(record: Record<K, V>, filter: (key: K, value: V, index: number) => boolean): Rec {
    const newObj = {} as Rec;
    let i = 0;
    for (const key in record) {
        const value = record[key];
        //@ts-ignore
        if (filter(key, record[key], i)) newObj[key] = value;
        i++;
    }
    return newObj;
}

export function recordSome<V, Rec extends Record<keyof Rec, V>, K extends keyof Rec>(record: Record<K, V>, condition: (key: K, value: V) => boolean): boolean {
    for (const key in record) {
        const value = record[key]
        if (condition(key, value)) return true;
    }
    return false;
}

export function recordAll<V, Rec extends Record<keyof Rec, V>, K extends keyof Rec>(record: Record<K, V>, condition: (key: K, value: V) => boolean): boolean {
    for (const key in record) {
        const value = record[key]
        if (!condition(key, value)) return false;
    }
    return true;
}

export function recordNone<V, Rec extends Record<keyof Rec, V>, K extends keyof Rec>(record: Record<K, V>, condition: (key: K, value: V) => boolean): boolean {
    return !recordSome(record, condition)
}

export function recordToArray<V, Rec extends Record<keyof Rec, V>, K extends keyof Rec, R>(record: Record<K, V>, mapFn: (key: K, value: V, index: number) => R): R[] {
    return typedKeys(record).map((key, index) => mapFn(key, record[key], index));
}

export function objectLength(obj: object): number {
    return Object.keys(obj).length;
}

export function recordIsEmpty<K extends TsKey, V>(record: Record<K, V>): boolean {
    return Object.keys(record).length === 0;
}


export function withoutKey<K extends TsKey, V, RK extends TsKey>(record: Record<K, V>, key: RK): Omit<Record<K, V>, RK> {
    if (!(key in record)) return record;
    const {[key]: value, ...otherProps} = record;
    return otherProps;
}

export function flipRecord<K extends TsKey, V extends TsKey>(record: Record<K, V>): Record<V, K> {
    const flippedRecord: Record<V, K> = {} as Record<V, K>
    for (const key in record) {
        const flippedRecordKey: V = record[key];
        flippedRecord[flippedRecordKey] = key;
    }
    return flippedRecord;
}

export function coercePreferMin(num: number, bounds: { min: number, max: number }): number {
    // Opinionated preferral of min over max
    if (bounds.min > bounds.max) return bounds.min;
    if (num < bounds.min) {
        return bounds.min;
    } else if (num > bounds.max) {
        return bounds.max
    } else {
        return num;
    }
}

/**
 * @deprecated use extension method removeSuffix(suffix) instead
 */
export function removeSuffix(str: string, suffix: string): string {
    return str.removeSuffix(suffix)
}

/**
 * @deprecated use recordToArray instead
 */
export function objectMap<V, R>(object: Record<string, V>, mapFn: (key: string, value: V, index: number) => R): R[] {
    return recordToArray(object, mapFn)
}

/**
 * @deprecated use Array extension method toRecord(mapFn) instead
 */
export function toRecord<K extends TsKey, V, T>(arr: T[], mapFn: (element: T, index: number) => [K, V]): Record<K, V> {
    return arr.toRecord(mapFn)
}

/**
 * @deprecated if you use this, make an extension method for it
 */
export function indexOfOrThrow<T>(arr: T[], element: T): number {
    const index = arr.indexOf(element);
    if (index === -1) throw new Error(`The element '${element}' doesn't exist in the array: ${arr}`)
    return index;
}

/**
 * @deprecated use recordFilter instead
 */
export function objectFilter<V>(object: Record<string, V>, filter: (key: string, value: V) => boolean): Record<string, V> {
    return recordFilter(object, filter)
}