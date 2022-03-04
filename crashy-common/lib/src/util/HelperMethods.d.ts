import { Key } from "./HelperTypes";
export declare function typedKeys<K extends Key, V>(object: Record<K, V>): K[];
export declare function isObj(x: unknown): x is Record<string, unknown>;
