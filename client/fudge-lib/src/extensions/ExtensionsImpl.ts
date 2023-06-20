import "./Extensions"
import {TsKey} from "../types/Basic";

export {}

String.prototype.removeExpectedSuffix = function (suffix: string) {
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
String.prototype.splitToTwoOnLast = function (this: string, splitOn: string): [string, string] | undefined {
    const index = this.lastIndexOf(splitOn);
    // if (index === -1) throw new Error(`Could not split to two because split string '${splitOn}' does not exist in target string '${this}'`)
    if (index === -1) return undefined
    return [this.slice(0, index), this.slice(index + 1)]
}

String.prototype.removeBeforeFirstExclusive = function (this: string, removeBefore: string): string {
    const index = this.indexOf(removeBefore)
    if (index === -1) return this
    else return this.slice(index + removeBefore.length)
}

String.prototype.removeBeforeFirstInclusive = function (this: string, removeBefore: string): string {
    const index = this.indexOf(removeBefore)
    if (index === -1) return this
    else return this.slice(index)
}
String.prototype.removeBeforeLastInclusive = function (this: string, removeBefore: string): string {
    const index = this.lastIndexOf(removeBefore);
    if (index === -1) {
        return this;
    } else {
        return this.slice(index);
    }
}

String.prototype.removeBeforeLastExclusive = function (this: string, removeBefore: string): string {
    const index = this.lastIndexOf(removeBefore);
    if (index === -1) {
        return this;
    } else {
        return this.slice(index + removeBefore.length);
    }
}

String.prototype.removeAfterFirstInclusive = function (this: string, removeAfter: string): string {
    const index = this.indexOf(removeAfter);
    if (index === -1) {
        return this;
    } else {
        return this.slice(0, index + removeAfter.length);
    }
}

String.prototype.removeAfterFirstExclusive = function (this: string, removeAfter: string): string {
    const index = this.indexOf(removeAfter);
    if (index === -1) {
        return this;
    } else {
        return this.slice(0, index);
    }
}

String.prototype.removeAfterLastInclusive = function (this: string, removeBefore: string): string {
    const index = this.lastIndexOf(removeBefore)
    if (index === -1) return this
    else return this.slice(0, index + removeBefore.length)
}

String.prototype.removeAfterLastExclusive = function (this: string, removeBefore: string): string {
    const index = this.lastIndexOf(removeBefore)
    if (index === -1) return this
    else return this.slice(0, index)
}

String.prototype.removeAfterFirst = function (this: string, removeAfter: string): string {
    return this.removeAfterFirstInclusive(removeAfter)
}

String.prototype.removeAfterLast =function (this: string, removeAfter: string): string {
    return this.removeAfterLastInclusive(removeAfter)
}

Array.prototype.toRecord = function <T, K extends TsKey, V>(this: Array<T>, map: (element: T, index: number) => [K, V]): Record<K, V> {
    const record = {} as Record<K, V>;
    this.forEach((element, index) => {
        const [key, value] = map(element, index);
        record[key] = value;
    })
    return record;
}


Array.prototype.arrayEquals = function <T>(this: T[], b: T[]): boolean {
    return this.length === b.length &&
        this.every((val, index) => val === b[index]);
}

Array.prototype.remove = function <T>(this: T[], item: T): void {
    const index = this.indexOf(item);
    if (index !== -1) this.splice(index, 1);
}
Array.prototype.firstOr = function <T, V>(this: T[], or: () => V): T | V {
    if (this.length === 0) {
        return or();
    } else {
        return this[0];
    }
}
Array.prototype.drop = function <T>(this: T[], amount: number): Array<T> {
    const newArr = new Array(this.length - amount);
    for (let i = amount; i < this.length; i++) {
        newArr[i - amount] = this[i];
    }
    return newArr;
}
Array.prototype.mapSync = async function <T, NT>(this: T[], map: (item: T, index: number) => Promise<NT>): Promise<Array<NT>> {
    const newArr = new Array<NT>(this.length);
    for (let i = 0; i < this.length; i++) {
        newArr[i] = await map(this[i], i);
    }
    return newArr;
}
Array.prototype.isEmpty = function <T>(this: T[]): boolean {
    return this.length === 0;
}

Array.prototype.none = function <T>(this: T[], test: (item: T) => boolean): boolean {
    for (const item of this) {
        if (test(item)) return false;
    }
    return true;
}

Array.prototype.sum = function <T>(this: T[], numberMap: (item: T) => number): number {
    let sum = 0;
    for(const item of this){
        sum += numberMap(item)
    }
    return sum;
}

Array.prototype.splitBy = function <T>(this: T[], predicate: (item: T, index: number) => boolean): [Array<T>, Array<T>] {
    const arr1 : T[] = [];
    const arr2: T[] = [];
    let i = 0;
    for(const item of this){
        if(predicate(item, i)){
            arr1.push(item)
        } else{
            arr2.push(item)
        }
        i++
    }
    return [arr1,arr2]
}

Array.prototype.indexOfOrThrow = function<T>(this: T[], element: T): number {
    const index = this.indexOf(element);
    if (index === -1) throw new Error(`The element '${element}' doesn't exist in the array: ${this}`)
    return index;
}