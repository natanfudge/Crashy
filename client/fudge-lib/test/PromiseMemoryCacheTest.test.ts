import {describe, expect, test} from "vitest";
import {PromiseMemoryCache} from "../src/collections/PromiseMemoryCache";

describe('PromiseMemoryCache', function () {
    const cache = new PromiseMemoryCache();
    test("CaseA: There's a cached value", async () => {
        await cache.get("CaseA", async () => 1)

        expect(await cache.get("CaseA", () => {
            throw "Shouldn't be called"
        })).toEqual(1)
    })

    test("Normal CaseB: There's no cached value and no ongoing promise", async () => {
        expect(await cache.get("CaseB", async () => 2)).toEqual(2)
    })
    //TODO: test case where replaced value is replaced by something else

    test("CaseB + C", async () => {
        const result1 = cache.get("CaseBC", async () => {
            await wait(100)
            return 3
        })

        const result2 = cache.replace("CaseBC", (async () => {
            await wait(1000)
            return 4
        })())

        const result3 = cache.get("CaseBC", async () => {
            throw new Error("Shouldn't be called")
        })

        expect(await result1).toEqual(4)
        expect(await result2).toEqual(4)
        expect(await result3).toEqual(4)
    })

    test("More replace", async () => {
        const result1 = await cache.get("Replace1", async () => 2)
        const result2 = await cache.replace("Replace1", (async () => 3)())
        expect(result1).toEqual(2)
        expect(result2).toEqual(3)

        const result3 = cache.get("Replace2", async () => {
            await wait(100)
            return 2
        })
        const result4 = cache.replace("Replace2", (async () => {
            await wait(400)
            return 3
        })())
        const result5 = cache.replace("Replace2", (async () => {
            await wait(200)
            return 4;
        })())

        expect(await result3).toEqual(4)
        expect(await result4).toEqual(4)
        expect(await result5).toEqual(4)

    })
});

async function wait(time: number): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve()
        }, time)
    })
}

test("PromiseMemoryCache works in all cases", async () => {
    // CaseA: There's a cached value


})