export {};
declare global {
    interface String {
        removePrefix(suffix: string): string;
        removeSuffix(suffix: string): string;
        removeExpectedPrefix(prefix: string): string;
        removeExpectedSuffix(prefix: string): string;
        splitToTwo(splitOn: string): [string, string];
        splitToTwoOnLast(splitOn: string): [string, string] | undefined;
        removeAfterFirst(removeAfter: string): string;
        removeAfterFirstExclusive(removeAfter: string): string;
        removeAfterLast(removeAfter: string): string;
        removeBeforeLastExclusive(removeBefore: string): string;
    }
    interface Array<T> {
        arrayEquals(array: T[]): boolean;
        remove(item: T): void;
        firstOr<V>(or: () => V): T | V;
        drop(amount: number): Array<T>;
        mapSync<NT>(map: (item: T, index: number) => Promise<NT>): Promise<Array<NT>>;
        isEmpty(): boolean;
        none(test: (item: T) => boolean): boolean;
    }
}
