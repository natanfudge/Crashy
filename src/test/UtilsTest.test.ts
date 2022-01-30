import {parseCrashReportRich} from "crash-parser/src/parser/CrashReportEnricher";
import {testFabricCrashReport} from "crash-parser/src/test/TestCrashes";
import {flipRecord} from "../utils/Javascript";
import {HashMap} from "../utils/hashmap/HashMap";

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

    // const record2 = {
    //     ...oldRecord,
    //     "amar" :"bar"
    // }

    // expect(() => flipRecord(record2)).toThrow()
})

test("HashMap works correctly", () => {
    const stringMap = new HashMap<string,string>(100);
    stringMap.put("Foo","Bar")
    stringMap.put("Biz","Baz")
    stringMap.put("Boz","Booz")

    expect(stringMap.get("Foo")).toEqual("Bar")
    expect(stringMap.get("Biz")).toEqual("Baz")
    expect(stringMap.get("Boz")).toEqual("Booz")

    stringMap.put("Foo","Hola")
    expect(stringMap.get("Foo")).toEqual("Hola")

    const numberMap = new HashMap<number,string>(100);

    numberMap.put(1,"Bar")
    numberMap.put(-70,"Baz")
    numberMap.put(12312414,"Booz")

    expect(numberMap.get(1)).toEqual("Bar")
    expect(numberMap.get(-70)).toEqual("Baz")
    expect(numberMap.get(12312414)).toEqual("Booz")

    numberMap.put(1,"Hola")
    expect(numberMap.get(1)).toEqual("Hola")

    //TODO: test all other types and a large amount of stuff
})
