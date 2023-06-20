interface OngoingPromiseEntry<T> {
    readonly promise: Promise<T>,
    // May be set to a value if the promise value for the key was replaced by something else.
    // in that case replacedBy will be used instead of the promise field value.
    replacedBy: OngoingPromiseEntry<T> | undefined
}

const anyErrorField = "_memory_cache_error_value"

// Unfortunately javascript errors can be anything
interface AnyError {
    // We give it a very specific name to not conflict with user objects
    [anyErrorField]: unknown
}


function isError(obj: unknown): obj is AnyError {
    return obj !== null && typeof obj === "object" && anyErrorField in obj;
}

export class PromiseMemoryCache<T> {
    private cache: Record<string, T> = {}

    // Track promises that have not yet been fulfilled,
    // so when the same value gets requested a second time before the promise has been fulfilled for the first time,
    // we tell it to use the first promise's result instead of executing an entirely new one.
    // Value may be AnyError if the promise threw
    private ongoingPromises: Record<string, Promise<T> | AnyError> = {}

    // There's quite a bit of spaghetti going on regarding ongoingPromises, many get calls, and replacing values using the replace method.
    // So here's a sketch of the events:
    // Case A: there's a cached value. All is good, very simple, just return it.
    // Case B: There's no cached value and there's nothing or an error in ongoingPromises.
    //      We use orProduce() which is usually an expensive network call, and store the promise in ongoingPromises
    //      to save from additional calls being made before the promise was resolved.
    //      From here on is the CORE LOOP:
    //      Wait for the promise to resolve.
    //      Some things can then go wrong, signified by a change in the ongoingPromise value of the same key:
    //      Special Case B1: The value is gone.
    //          When ongoingPromise values are deleted (at the end of the get call),
    //          a cache entry is stored right before - so we just use it.
    //      Special Case B2: The promise threw. In that case - we throw as well.
    //      Special Case B3: The value was replaced by something different.
    //          In that case, we wait for the new value to resolve (CORE LOOP), and so on recursively.
    //
    //      Normally what will happen is Normal Case B4: The ongoingPromise value of the same key was unchanged.
    //          In that case we just use the resolved promise value normally.
    //
    //      Once the proper, real, value is resolved, we store it in the cache.
    //      Note that at this point saving the value in ongoingPromises is completely pointless - so we delete it.
    //      Deleting is correct here because it will be handled correctly by special case B1.
    //
    // Case C: There's no cached value and there's something in ongoingPromises.
    //  In that case we jump straight to the CORE LOOP descrived in Case B.

    // TODO: test all the cases.

    async get(key: string, orProduce: () => Promise<T>): Promise<T> {
        const cachedValue = this.getOrUndefined(key);
        if (cachedValue !== undefined) return cachedValue;
        return this.setPromise(key, orProduce())
    }

    async setPromise(key: string, promise: Promise<T>): Promise<T> {
        // Promise not fulfilled yet - store it
        this.ongoingPromises[key] = promise
        // No cached value - await until orProduce gives a value
        const resolvedValue = await this.ongoingPromiseValue(key, promise).catch((e) => {
                // Make sure currently running promises know to throw too.
                this.ongoingPromises[key] = {
                    _memory_cache_error_value: e
                };
                // This is a slight memory leak, but it is reasonable given that it is an extreme case where errors are thrown in it.
                // The bright side is that the state will be completely correct.
                throw e
            }
        )

        // Calling this before the delete call is very important
        // so that other viewers of this key have somewhere to go once the ongoingPromise value is lost.
        this.cache[key] = resolvedValue;
        // Promise fulfilled - we can now use the cache instead and we don't need to store the promise anymore.
        delete this.ongoingPromises[key]

        return resolvedValue;
    }


    async ongoingPromiseValue(key: string, initialPromise: Promise<T>): Promise<T> {
        // const potentiallyOutdatedPromise = this.ongoingPromises[key]
        // While the promise's value is correct as of before awaiting, it may change to a different value during the await.
        const potentiallyOutdatedValue = await initialPromise;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return

        const upToDatePromise = this.ongoingPromises[key]
        if (upToDatePromise !== initialPromise) {
            // Special cases
            if (upToDatePromise === undefined) {
                // We only call this method in cases ongoingPromises[key] was given some value.
                // If there's no value, a resolved value must have been stored in the cached.
                const cachedValue = this.cache[key]
                if (cachedValue === undefined) {
                    throw new Error(`Unexpected MemoryCache state: value for key ${key} was not found after its promises was supposedly resolved and deleted.`)
                }
                return cachedValue;
            } else if (isError(upToDatePromise)) {
                // If the promise threw we need to throw too.
                throw upToDatePromise[anyErrorField];
            } else {
                // Replaced by something - this value is outdated - do this process again
                return this.ongoingPromiseValue(key, upToDatePromise)
            }
        } else {
            // Not replaced by anything - this is not outdated - return what we have
            return potentiallyOutdatedValue;
        }
    }

    getOrUndefined(key: string): Promise<T> | undefined {
        const cached = this.cache[key];
        if (cached !== undefined) {
            return Promise.resolve(cached);
        }

        // Try to reuse the recent, last time the value of this key was requested.
        const ongoingPromise = this.ongoingPromises[key];
        if (ongoingPromise === undefined || isError(ongoingPromise)) {
            return undefined
        } else {
            return this.ongoingPromiseValue(key, ongoingPromise);
        }
    }

    contains(key: string): boolean {
        return this.getOrUndefined(key) !== undefined
    }

    /**
     * Useful for resetting the value when it changes potentially for the same key.
     * Replacing is a better practice than removing a value based on a key because callers
     * expect a valid value to be returned by the get method and if the value is just removed the correct behavior would be
     * to return 'null' which complicates the api for users - they need to handle the null case - the promise was removed.
     * If a value is replaced instead of removed, then a valid value will stay present and get will return something useful.
     */
    async replace(key: string, byPromise: Promise<T>): Promise<T> {
        return this.setPromise(key, byPromise)
        // this.ongoingPromises[key] = byPromise;
        // this.cache[key] = await this.ongoingPromiseValue(key, byPromise);
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

