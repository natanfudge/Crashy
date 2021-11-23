import "./Extensions"
export {}

String.prototype.removeExpectedSuffix = function (this: string, suffix: string) {
    if (!this.endsWith(suffix)) throw new Error(`Expected string to end with '${suffix}', but is actually: '${this}'`)
    return this.slice(0, -1 * suffix.length);
}
String.prototype.removeExpectedPrefix = function (this: string, prefix: string) {
    if (!this.startsWith(prefix)) throw new Error(`Expected string to start with '${prefix}', but is actually: '${this}'`)
    return this.slice(prefix.length);
}

String.prototype.removeSuffix = function (this: string, suffix: string) {
    if (!this.endsWith(suffix)) return this;
    return this.slice(0, -1 * suffix.length);
}
String.prototype.removePrefix = function (this: string, prefix: string) {
    if (!this.startsWith(prefix)) return this;
    return this.slice(prefix.length);
}

String.prototype.splitToTwo = function (this: string, splitOn: string): [string, string] {
    const index = this.indexOf(splitOn);
    if (index === -1) throw new Error(`Could not split to two because split string '${splitOn}' does not exist in target string '${this}'`)
    return [this.slice(0, index), this.slice(index + 1)]
}

Array.prototype.arrayEquals = function <T>(this: T[], b: T[]): boolean {
    return this.length === b.length &&
        this.every((val, index) => val === b[index]);
}