import {recordIsEmpty} from "./Javascript";

export class PromiseMemoryCache<T> {
    private cache: Record<string, T> = {}

    // Track promises that have not yet been fulfilled,
    // so when the same value gets requested a second time before the promise has been fulfilled for the first time,
    // we tell it to use the first promise's result instead of executing an entirely new one.
    private ongoingPromises: Record<string, Promise<T>> = {}

    private promisesListeners: (() => void)[] = []

    private invokeListeners() {
        for (const listener of this.promisesListeners) listener();
    }

    async get(key: string, orProduce: () => Promise<T>): Promise<T> {
        const cached = this.cache[key];
        if (cached !== undefined) {
            return cached;
        }

        // Try to reuse the recent, last time the value of this key was requested.
        const ongoingPromise = this.ongoingPromises[key];
        if (ongoingPromise !== undefined) {
            return ongoingPromise;
        }


        const promise = orProduce();
        // Promise not fulfilled yet - store it
        this.ongoingPromises[key] = promise;
        this.invokeListeners();
        const value = await promise.finally(
            () => {
                delete this.ongoingPromises[key];
                this.invokeListeners();
            }
        );
        // Promise fulfilled - we can now use the cache instead and we don't need to store the promise anymore.
        this.cache[key] = value;

        return value;
    }

    anyPromisesUnfulfilled(): boolean {
        return !recordIsEmpty(this.ongoingPromises);
    }

    // Calls callback whenever this.ongoingPromises changes
    onOngoingPromisesChange(callback: () => void) {
        this.promisesListeners.push(callback)
    }

    unsubscribeToOngoingPromisesChange(callback: () => void) {
        this.promisesListeners.remove(callback);
    }
}


export class MemoryCache<T> {
    cache: Record<string, T> = {}

    get(key: string, orProduce: () => T): T {
        const cached = this.cache[key];
        if (cached !== undefined) {
            return cached;
        } else {
            const value = orProduce();
            this.cache[key] = value;
            return value;
        }
    }
}

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
