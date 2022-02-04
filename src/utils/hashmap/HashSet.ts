import {HashMap} from "./HashMap";

export class HashSet<T> {
    private _map: HashMap<T, 1>

    static ofCapacity<T>(capacity: number | undefined): HashSet<T> {
        return new HashSet(new HashMap<T, 1>(capacity));
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
}