import {expect, test} from "vitest";
import "../src/extensions/ExtensionsImpl"
test("string remove functions work", () => {
    const str = "heljo worljd"
    expect(str.removeBeforeFirstInclusive("lj")).toEqual("ljo worljd")
    expect(str.removeBeforeFirstExclusive("lj")).toEqual("o worljd")
    expect(str.removeBeforeLastInclusive("lj")).toEqual("ljd")
    expect(str.removeBeforeLastExclusive("lj")).toEqual("d")

    expect(str.removeAfterFirstInclusive("lj")).toEqual("helj")
    expect(str.removeAfterFirstExclusive("lj")).toEqual("he")
    expect(str.removeAfterLastInclusive("lj")).toEqual("heljo worlj")
    expect(str.removeAfterLastExclusive("lj")).toEqual("heljo wor")
})

