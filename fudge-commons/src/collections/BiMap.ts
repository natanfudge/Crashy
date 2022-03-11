import {flipRecord} from "./Javascript";

export type Key = string | number
// Debug 22 -> 21 -> 20: 86MB
export class BiMap<K extends Key, V extends Key> {
    private readonly forwards: Record<K, V>
    private backwards: Record<V, K> | undefined = undefined;

    constructor(forwards: Record<K, V>) {
        this.forwards = forwards;
    }

    valueOf(key: K): V | undefined {
        return this.forwards[key];
    }

    keyOf(value: V): K | undefined {
        return this.getReverseMap()[value];
    }

    getNormalMap(): Record<K, V> {
        return this.forwards;
    }

    getReverseMap(): Record<V, K> {
        if (this.backwards === undefined) {
            this.backwards = flipRecord(this.forwards);
        }
        return this.backwards;
    }

    static Empty = new BiMap({});
}
