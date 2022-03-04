export declare class Lazy<T> {
    private value;
    private readonly init;
    constructor(init: () => T);
    get(): T;
}
