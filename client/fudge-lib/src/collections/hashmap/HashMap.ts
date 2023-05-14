import {equalsOfAnything} from "./EqualsImplementation";
import {LinkedList} from "../LinkedList";
import {hashCodeOfAnything} from "./Hashing";

const InitialCapacityPadding = 1.35;
const DefaultCapacity = 16;
const LoadFactor = 0.75;
const SizeIncreaseMultiplier = 1.5;

export interface Dict<K, V> {
    get(key: K): V | undefined;

    get size(): number

    forEach(func: (key: K, value: V) => void): void

    map<NK, NV>(keyMap: (key: K, value: V) => NK, valueMap: (key: K, value: V) => NV): HashMap<NK, NV>

    linearSearch(func: (key: K, value: V) => boolean): V | undefined

    toRecord<NK extends string, NV>(keyMap: (key: K, value: V) => NK, valueMap: (key: K, value: V) => NV): Record<NK, NV>

    toArray<T>(map: (key: K, value: V) => T): T[]
}

export interface MutableDict<K, V> extends Dict<K, V> {
    put(key: K, value: V): void
}

/**
 * All objects are treated as values (as the key), so don't make the key too complex (e.g. a record with 10,000 entries)
 * Treating objects as references is perhaps possible but not implemented
 *
 * Define `equals(other: T): boolean` and `hashCode(): number` for classes with unrelated fields.
 */
export class HashMap<K, V> implements MutableDict<K, V> {
    private capacity: number
    // Not as efficient as it could be - a LinkedList would make inserting more performant
    private buckets: MapBucket<K, V>[];
    private _size = 0;
    private _bucketsFilled = 0;

    ////////// Constructors ////////////
    constructor(capacity: number | undefined) {
        // Pad some space for better performance
        this.capacity = capacity === undefined ? DefaultCapacity : Math.ceil(capacity * InitialCapacityPadding);
        this.buckets = new Array<MapBucket<K, V>>(this.capacity);
    }

    static fromArray<K, V>(items: Entry<K, V>[]): HashMap<K, V> {
        const map = new HashMap<K, V>(items.length)
        for (const item of items) {
            map.putEntry(item)
        }
        return map;
    }

    private static Empty = new HashMap(0);

    static empty<K, V>(): Dict<K, V> {
        return this.Empty as Dict<K, V>;
    }


    //////// Primary API //////////

    get(key: K): V | undefined {
        return this.getEntry(key)?.value;
    }

    put(key: K, value: V) {
        this.putEntry({key, value})
    }


    get size(): number {
        return this._size;
    }

    /////////// Utility //////////

    forEach(func: (key: K, value: V) => void) {
        this.forEachImpl(this.buckets, ({key, value}) => func(key, value))
    }

    map<NK, NV>(keyMap: (key: K, value: V) => NK, valueMap: (key: K, value: V) => NV): HashMap<NK, NV> {
        const newMap = new HashMap<NK, NV>(this.capacity);
        this.forEach((key, value) => newMap.put(keyMap(key, value), valueMap(key, value)))
        return newMap;
    }

    filter(filterer: (key: K, value: V) => boolean): HashMap<K, V> {
        const newMap = new HashMap<K, V>(this.capacity);
        this.forEach((key, value) => {
            if (filterer(key, value)) {
                newMap.put(key, value)
            }
        })
        return newMap;
    }


    linearSearch(func: (key: K, value: V) => boolean): V | undefined {
        for (let i = 0; i < this.buckets.length; i++) {
            const bucket = this.buckets[i];
            if (bucket === undefined) continue;
            const found = bucket.find(({key, value}) => func(key, value))
            if (found !== undefined) return found.value;
        }
        return undefined;
    }

    copy(): HashMap<K, V> {
        const newMap = new HashMap<K, V>(this.capacity);
        for (let i = 0; i < this.buckets.length; i++) {
            const bucket = this.buckets[i];
            newMap.buckets[i] = bucket.copyReversed();
        }
        return newMap;
    }

    toArray<T>(map: (key: K, value: V) => T): T[] {
        const arr = new Array<T>()
        let i = 0;
        this.forEach((k, v) => {
            arr[i] = map(k, v)
            i++;
        })
        return arr;
    }

    /**
     * If contains `key`, returns its value and does not mutate the map
     * If doesn't contain `key`, sets map[key] = value and returns undefined
     */
    putIfAbsent(key: K, value: V): V | undefined {
        const entry = this.getEntry(key)
        if (entry !== null) {
            return entry?.value;
        } else {
            this.put(key, value)
            return undefined;
        }
    }

    plus(other: HashMap<K, V>): HashMap<K, V> {
        const resultMap: HashMap<K, V> = new HashMap(this.capacity + other.capacity);
        this.forEachImpl(this.buckets, entry => resultMap.putEntry(entry))
        this.forEachImpl(other.buckets, entry => resultMap.putEntry(entry))
        return resultMap;
    }


    ///////////// Implementation ////////////

    putEntry(newEntry: Entry<K, V>) {
        const hash = this.getHash(newEntry.key)
        const entry = this.getEntry(newEntry.key, hash);
        if (entry !== undefined) {
            entry.value = newEntry.value;
        } else {
            if (this.buckets[hash] === undefined) {
                this.buckets[hash] = new LinkedList();
                this._bucketsFilled++;
            }
            this.buckets[hash].prepend(newEntry);
            this._size++;

            // If the map is starting to get too full we should expand it
            if (this._bucketsFilled > this.capacity * LoadFactor) this.expand();
        }
    }

    private expand() {
        this.capacity = Math.floor(this.capacity * SizeIncreaseMultiplier);
        const oldBuckets = this.buckets;
        // Delete all buckets and do over
        this.buckets = new Array<MapBucket<K, V>>(this.capacity);
        this._bucketsFilled = 0;
        this._size = 0;
        this.forEachImpl(oldBuckets, (entry) => this.putEntry(entry))
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

    // eslint-disable-next-line class-methods-use-this
    private forEachImpl(buckets: MapBucket<K, V>[], func: (entry: Entry<K, V>) => void) {
        for (let i = 0; i < buckets.length; i++) {
            const bucket = buckets[i];
            bucket?.forEach((entry) => func(entry))
        }
    }

    toRecord<NK extends string, NV>(keyMap: (key: K, value: V) => NK, valueMap: (key: K, value: V) => NV): Record<NK, NV> {
        const record = {} as Record<NK, NV>;
        this.forEach((k, v) => {
            record[keyMap(k, v)] = valueMap(k, v);
        })
        return record;
    }

    toSameRecord(): Record<string, V> {
        return this.toRecord(k => String(k), (k, v) => v)
    }

    toString(): string {
        return JSON.stringify(this.toRecord(k => String(k), (k, v) => v))
    }

}

export interface Entry<K, V> {
    key: K
    value: V
}

type MapBucket<K, V> = LinkedList<Entry<K, V>>
