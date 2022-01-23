export {}
declare global {
    interface String {
        removePrefix(suffix: string): string

        removeSuffix(suffix: string): string

        removeExpectedPrefix(prefix: string): string

        removeExpectedSuffix(prefix: string): string

        splitToTwo(splitOn: string): [string, string]

        removeAfterFirst(removeAfter: string): string

        removeBeforeLastExclusive(removeBefore: string): string
    }

    interface Array<T> {
        arrayEquals(array: T[]): boolean
    }
}

