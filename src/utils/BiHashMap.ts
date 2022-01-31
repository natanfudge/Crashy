// import {flipRecord} from "./Javascript";
// import {HashMap} from "./hashmap/HashMap";
//
// export type Key = string | number
// // Debug 22 -> 21 -> 20: 86MB
// export class BiHashMap<K, V > {
//     private readonly forwards: HashMap<K, V>
//     private backwards: HashMap<V, K> | undefined = undefined;
//
//     constructor(forwards: HashMap<K, V>) {
//         this.forwards = forwards;
//     }
//
//     valueOf(key: K): V | undefined {
//         return this.forwards.get(key);
//     }
//
//     keyOf(value: V): K | undefined {
//         return this.getReverseMap().get(value);
//     }
//
//     getNormalMap(): HashMap<K, V> {
//         return this.forwards;
//     }
//
//     getReverseMap(): HashMap<V, K> {
//         if (this.backwards === undefined) {
//             this.backwards = flipRecord(this.forwards);
//         }
//         return this.backwards;
//     }
//
//     static Empty = new BiHashMap({});
// }
