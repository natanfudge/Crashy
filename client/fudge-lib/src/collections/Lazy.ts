
export class Lazy<T> {
    private value: T | undefined
    private readonly init: () => T

    constructor(init: () => T) {
        this.init = init;
    }

    get(): T {
        if (this.value === undefined) {
            this.value = this.init();
        }
        return this.value;
    }
}