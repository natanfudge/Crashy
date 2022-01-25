import {parseCrashReportRich} from "crash-parser/src/parser/CrashReportEnricher";
import {testFabricCrashReport} from "crash-parser/src/test/TestCrashes";
import {flipRecord} from "../utils/Javascript";

test("Flip record works correctly", () => {
    const oldRecord = {
        "foo" :"bar",
        "baz": "biz",
        "booz" :"bez"
    }

    expect(flipRecord(oldRecord)).toEqual(
        {
            "bar": "foo",
            "biz": "baz",
            "bez" :"booz"
        }
    )

    const record2 = {
        ...oldRecord,
        "amar" :"bar"
    }

    expect(() => flipRecord(record2)).toThrow()
})
