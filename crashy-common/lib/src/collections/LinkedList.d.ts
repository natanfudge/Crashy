export declare class LinkedList<T> {
    private head?;
    find(func: (element: T) => boolean): T | undefined;
    forEach(func: (element: T) => void): void;
    prepend(value: T): void;
    copyReversed(): LinkedList<T>;
}
