import {TsKey} from "../types/Basic";

export function typedKeys<K extends TsKey, V>(object: Record<K, V>): K[] {
    return Object.keys(object) as K[];
}

export function isObj(x: unknown): x is Record<string, unknown> {
    return typeof x === 'object' && x != null;
}