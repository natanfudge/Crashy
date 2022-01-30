//TODO: understand this better
const Capacity = 10;


function hashCodeOfAnything<T>(thing: T): number {
    throw new Error("TODO")
}

function equalsOfAnything<A, B>(thingA: A, thingB: B): boolean {
    throw new Error("TODO")
}

export class HashMap<K, V> {
    private bucket: MapBucket<K, V>[] = new Array(Capacity);


    size = 0;

    private getHash(key: K): number {
        return (hashCodeOfAnything(key) & 0xfffffff) % Capacity;
    }

    private getEntry(key: K): [K, V] | undefined {
        const hash = this.getHash(key);
        const bucket = this.bucket[hash]
        if (bucket === undefined) return undefined;
        for (const entry of bucket.entries) {
            if (equalsOfAnything(entry[0], key)) return entry;
        }
        return undefined;
    }

    put(key: K, value: V) {
        const entry = this.getEntry(key);
        if (entry !== undefined) {
            entry[1] = value;
        } else {
            const hash = this.getHash(key);
            if (this.bucket[hash] === undefined) {
                this.bucket[hash] = new MapBucket();
            }
            this.bucket[hash].addEntry([key, value]);
            this.size++;
        }
    }

    get(key: K): V | undefined {
        return this.getEntry(key)?.[1];
    }

// public  containsKey( key: K): boolean {
//     int hash = getHash(key);
//     return !(Objects.isNull(bucket[hash]) || Objects.isNull(getEntry(key)));
// }

    delete(key: K) {
        const entry = this.getEntry(key)
        if (entry !== undefined) {
            const hash = this.getHash(key);
            this.bucket[hash].removeEntry(entry)
            this.size--;
        }
    }

}


///TODO: this whole class is prob a bullshit wrapper
export class MapBucket<K, V> {
    //TODO: see if making it a linked list matters
    entries: [K, V][] = [];


    addEntry(entry: [K, V]) {
        this.entries.push(entry);
    }

    removeEntry(entry: [K, V]) {
        this.entries.remove(entry);
    }
}
