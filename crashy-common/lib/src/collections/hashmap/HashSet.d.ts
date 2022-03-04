export declare class HashSet<T> {
    private _map;
    static ofCapacity<T>(capacity: number | undefined): HashSet<T>;
    static of<T>(...items: T[]): HashSet<T>;
    static from<T>(items: T[]): HashSet<T>;
    private constructor();
    put(value: T): void;
    contains(value: T): boolean;
    copy(): HashSet<T>;
    map<NT>(mapper: (value: T) => NT): HashSet<NT>;
    forEach(iterator: (value: T) => void): void;
    get isEmpty(): boolean;
    get size(): number;
    toString(): string;
    toArray(): T[];
}
