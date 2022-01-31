// const Capacity = 10;


// TODO: Using an array instead of a LinkedList may have a serious performance penalty - find out how many slots does a js array allocate initially.

import {hashCodeOfAnything} from "./Hashing";
import {equalsOfAnything} from "./EqualsImplementation";
import {LinkedList} from "../LinkedList";

/**
 * All objects are treated as values (as the key), so don't make the key too complex (e.g. a record with 10,000 entries)
 * Treating objects as references is perhaps possible but not implemented
 */
export class HashMap<K, V> {
    private readonly capacity: number
    // Not as efficient as it could be - a LinkedList would make inserting more performant
    private readonly buckets: MapBucket<K, V>[];

    constructor(capacity: number) {
        this.capacity = capacity;
        this.buckets = new Array(capacity);
    }

    private _size = 0;
    get size(): number {
        return this._size;
    }

    private getHash(key: K): number {
        return (hashCodeOfAnything(key) & 0xfffffff) % this.capacity;
    }

    private getEntry(key: K, hash?: number): Entry<K, V> | undefined {
        const usedHash = hash ?? this.getHash(key);
        const bucket = this.buckets[usedHash]
        if (bucket === undefined) return undefined;
        return bucket.find(entry => equalsOfAnything(entry.key, key));
    }

    put(key: K, value: V) {
        const hash = this.getHash(key)
        const entry = this.getEntry(key, hash);
        if (entry !== undefined) {
            entry.value = value;
        } else {
            if (this.buckets[hash] === undefined) {
                this.buckets[hash] = new LinkedList();
            }
            this.buckets[hash].prepend({key, value});
            this._size++;
        }
    }

    get(key: K): V | undefined {
        return this.getEntry(key)?.value;
    }

    forEach(func: (key: K, value: V) => void) {
        for (let i = 0; i < this.buckets.length; i++) {
            const bucket = this.buckets[i];
            bucket.forEach(({key, value}) => func(key, value))
        }
    }

    map<NK, NV>(keyMap: (key: K, value: V) => NK, valueMap: (key: K, value: V) => NV): HashMap<NK, NV> {
        const newMap = new HashMap<NK, NV>(this.capacity);
        this.forEach((key, value) => newMap.put(keyMap(key, value), valueMap(key, value)))
        return newMap;
    }


    linearSearch(func: (key: K, value: V) => boolean): V | undefined {
        for (let i = 0; i < this.buckets.length; i++) {
            const bucket = this.buckets[i];
            const found = bucket.find(({key, value}) => func(key, value))
            if (found !== undefined) return found.value;
        }
        return undefined;
    }


    // delete(key: K) {
    //     const entry = this.getEntry(key)
    //     if (entry !== undefined) {
    //         const hash = this.getHash(key);
    //         this.buckets[hash].remove(entry)
    //         this._size--;
    //     }
    // }

}

interface Entry<K, V> {
    key: K
    value: V
}

type MapBucket<K, V> = LinkedList<Entry<K, V>>
