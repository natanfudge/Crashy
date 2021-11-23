export type Key = string | number | symbol
export type Require<T, K extends keyof T> = Omit<T, K> & {
    [RequiredProperty in K]-?: T[RequiredProperty]
}
export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>

export function typedKeys<K extends Key, V>(object: Record<K, V>): K[] {
    return Object.keys(object) as K[];
}

export function isObj(x: unknown): x is Record<string, unknown> {
    return typeof x === 'object' && x != null;
}
