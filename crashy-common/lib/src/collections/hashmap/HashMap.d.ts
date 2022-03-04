export interface Dict<K, V> {
    get(key: K): V | undefined;
    get size(): number;
    forEach(func: (key: K, value: V) => void): void;
    map<NK, NV>(keyMap: (key: K, value: V) => NK, valueMap: (key: K, value: V) => NV): HashMap<NK, NV>;
    linearSearch(func: (key: K, value: V) => boolean): V | undefined;
    toRecord<NK extends string, NV>(keyMap: (key: K, value: V) => NK, valueMap: (key: K, value: V) => NV): Record<NK, NV>;
    toArray<T>(map: (key: K, value: V) => T): T[];
}
export interface MutableDict<K, V> extends Dict<K, V> {
    put(key: K, value: V): void;
}
/**
 * All objects are treated as values (as the key), so don't make the key too complex (e.g. a record with 10,000 entries)
 * Treating objects as references is perhaps possible but not implemented
 *
 * Define `equals(other: T): boolean` and `hashCode(): number` for classes with unrelated fields.
 */
export declare class HashMap<K, V> implements MutableDict<K, V> {
    private capacity;
    private buckets;
    private _size;
    private _bucketsFilled;
    constructor(capacity: number | undefined);
    static fromArray<K, V>(items: Entry<K, V>[]): HashMap<K, V>;
    private static Empty;
    static empty<K, V>(): Dict<K, V>;
    get(key: K): V | undefined;
    put(key: K, value: V): void;
    get size(): number;
    forEach(func: (key: K, value: V) => void): void;
    map<NK, NV>(keyMap: (key: K, value: V) => NK, valueMap: (key: K, value: V) => NV): HashMap<NK, NV>;
    linearSearch(func: (key: K, value: V) => boolean): V | undefined;
    copy(): HashMap<K, V>;
    toArray<T>(map: (key: K, value: V) => T): T[];
    /**
     * If contains `key`, returns its value and does not mutate the map
     * If doesn't contain `key`, sets map[key] = value and returns undefined
     */
    putIfAbsent(key: K, value: V): V | undefined;
    putEntry(newEntry: Entry<K, V>): void;
    private expand;
    private getHash;
    private getEntry;
    private forEachImpl;
    toRecord<NK extends string, NV>(keyMap: (key: K, value: V) => NK, valueMap: (key: K, value: V) => NV): Record<NK, NV>;
}
export interface Entry<K, V> {
    key: K;
    value: V;
}
