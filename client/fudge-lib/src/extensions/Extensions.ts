import {TsKey} from "../types/Basic";

export {}
declare global {
    interface String {
        removePrefix(suffix: string): string

        removeSuffix(suffix: string): string

        removeExpectedPrefix(prefix: string): string

        removeExpectedSuffix(prefix: string): string

        // Splits on the first occurrence
        splitToTwo(splitOn: string): [string, string]

        // Splits on the last occurrence, returns undefined if splitOn doesn't exist in this
        splitToTwoOnLast(splitOn: string): [string, string] | undefined

        removeAfterFirstInclusive(removeAfter: string): string

        removeAfterFirstExclusive(removeAfter: string): string

        removeAfterLastInclusive(removeAfter: string): string

        removeAfterLastExclusive(removeBefore: string): string

        removeBeforeFirstInclusive(removeBefore: string): string

        removeBeforeFirstExclusive(removeBefore: string): string

        removeBeforeLastInclusive(removeBefore: string): string

        removeBeforeLastExclusive(removeBefore: string): string

        /**
         * @deprecated use removeAfterFirstInclusive instead
         */

        removeAfterFirst(removeAfter: string): string

        /**
         * @deprecated use removeAfterLastInclusive instead
         */
        removeAfterLast(removeAfter: string): string
    }

    interface Array<T> {
        arrayEquals(array: T[]): boolean

        remove(item: T): void

        firstOr<V>(or: () => V): T | V

        drop(amount: number): Array<T>

        splitBy(predicate: (item: T, index: number) => boolean): [Array<T>, Array<T>]

        // Happens synchronously, every item is evaluated after the previous one
        mapSync<NT>(map: (item: T, index: number) => Promise<NT>): Promise<Array<NT>>

        isEmpty(): boolean

        none(test: (item: T) => boolean): boolean

        toRecord<K extends TsKey, V>(map: (element: T, index: number) => [K, V]): Record<K, V>;

        sum(numberMap: (item: T) => number): number;

        indexOfOrThrow(this: T[], element: T) : number
    }
}

