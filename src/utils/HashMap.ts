    //TODO: understand this better
const Capacity = 10;


function hashCodeOfAnything<T>(thing: T): number {
    throw new Error("TODO")
}

function equalsOfAnything<A,B>(thingA: A, thingB: B): boolean {
    throw new Error("TODO")
}

export class HashMap<K, V> {
    private  bucket: MapBucket<K, V>[] = [];


    private size = 0;

    private  getHash( key: K): number {
    return (hashCodeOfAnything(key) & 0xfffffff) % Capacity;
}

private  getEntry( key: K): [K,V] | undefined {
    const hash = this.getHash(key);
    for(const entry of this.bucket[hash].entries){
        if(equalsOfAnything(entry[0],key)) return entry;
    }
    return undefined;
}
put( key: K,  value: V) {
    if(this.containsKey(key)) {
        MyKeyValueEntry entry = getEntry(key);
        entry.setValue(value);
    } else {
        int hash = getHash(key);
        if(bucket[hash] == null) {
            bucket[hash] = new MapBucket();
        }
        bucket[hash].addEntry(new MyKeyValueEntry<>(key, value));
        size++;
    }
}

public V get(K key) {
    return containsKey(key) ? (V) getEntry(key).getValue() : null;
}

public  containsKey( key: K): boolean {
    int hash = getHash(key);
    return !(Objects.isNull(bucket[hash]) || Objects.isNull(getEntry(key)));
}

public void delete(K key) {
    if(containsKey(key)) {
        int hash = getHash(key);
        bucket[hash].removeEntry(getEntry(key));
        size--;
    }
}
public int size() {
    return size;
}
}


///TODO: this whole class is prob a bullshit wrapper
export class MapBucket<K,V> {
    //TODO: see if making it a linked list matters
     entries: [K,V][] = [];


    addEntry( entry: [K,V]) {
    this.entries.push(entry);
}

 removeEntry( entry: [K,V]) {
    this.entries.remove(entry);
}
}
