export {}
declare global {
    interface String {
        removePrefix(suffix: string): string

        removeSuffix(suffix: string): string

        removeExpectedPrefix(prefix: string): string

        removeExpectedSuffix(prefix: string): string

        splitToTwo(splitOn: string): [string, string]

        removeAfterFirst(removeAfter: string): string
        // Excludes the removeAfter char
        removeAfterFirstExclusive(removeAfter: string): string
        removeAfterLast(removeAfter: string): string

        // Excludes the removeBefore char
        removeBeforeLastExclusive(removeBefore: string): string
    }

    interface Array<T> {
        arrayEquals(array: T[]): boolean
        remove(item : T): void
    }
}

