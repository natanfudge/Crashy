import {HashMap} from "./HashMap";

export class HashSet<T> {
    private _map: HashMap<T, 1>

    static ofCapacity<T>(capacity: number | undefined): HashSet<T> {
        return new HashSet(new HashMap<T, 1>(capacity));
    }

    static of<T>(...items: T[]) : HashSet<T>{
        return this.from(items);
    }
    static from<T>(items: T[]) : HashSet<T>{
        const set = this.ofCapacity<T>(items.length);
        for(const item of items){
            set.put(item);
        }
        return set;
    }

    private constructor(map: HashMap<T, 1>) {
        this._map = map;
    }

    put(value: T) {
        this._map.put(value, 1)
    }

    contains(value: T): boolean {
        return this._map.get(value) !== undefined;
    }

    copy(): HashSet<T> {
        return new HashSet<T>(this._map.copy());
    }

    map<NT>(mapper: (value: T) => NT): HashSet<NT> {
        return new HashSet<NT>(this._map.map(mapper, _ => 1))
    }

    filter(filterer: (value: T) => boolean): HashSet<T> {
        return new HashSet(this._map.filter(filterer))
    }

    forEach(iterator: (value: T) => void): void {
        this._map.forEach(iterator);
    }

    get isEmpty(): boolean {
        return this.size === 0;
    }

    get size(): number {
        return this._map.size;
    }

    toString() {
        return "{" + this.toArray().join(", ") + "}"
    }

    toArray(): T[] {
        const arr = new Array<T>(this.size)
        let i = 0;
        this.forEach(v => {
            arr[i] = v;
            i++;
        })
        return arr;
    }

    plus(other: HashSet<T>): HashSet<T> {
        return new HashSet<T>(this._map.plus(other._map))
    }
}
