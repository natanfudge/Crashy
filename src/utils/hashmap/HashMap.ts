// const Capacity = 10;




// Note: only use keys for simple interfaces, or it won't work well because of functions and such
// Ignoring functions is possible but not implemented
import {hashCodeOfAnything} from "./Hashing";
import {equalsOfAnything} from "./EqualsImplementation";

export class HashMap<K, V> {
    private readonly capacity: number
    // Not as efficient as it could be - a LinkedList would make inserting more performant
    private readonly buckets: MapBucket<K, V>[] ;

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
        for (const entry of bucket) {
            if (equalsOfAnything(entry.key, key)) return entry;
        }
        return undefined;
    }

    put(key: K, value: V) {
        const hash = this.getHash(key)
        const entry = this.getEntry(key, hash);
        if (entry !== undefined) {
            entry.value = value;
        } else {
            if (this.buckets[hash] === undefined) {
                this.buckets[hash] = [];
            }
            this.buckets[hash].push({key, value});
            this._size++;
        }
    }

    get(key: K): V | undefined {
        return this.getEntry(key)?.value;
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

type MapBucket<K, V> = Entry<K, V>[]
