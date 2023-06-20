import {expect, test} from 'vitest'
import {flipRecord} from "../src/methods/Javascript";

test("Flip record works correctly", () => {
    const oldRecord = {
        "foo": "bar",
        "baz": "biz",
        "booz": "bez"
    }

    expect(flipRecord(oldRecord)).toEqual(
        {
            "bar": "foo",
            "biz": "baz",
            "bez": "booz"
        }
    )
})

