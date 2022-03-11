import {flipRecord} from "../methods/Javascript";

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

    // const record2 = {
    //     ...oldRecord,
    //     "amar" :"bar"
    // }

    // expect(() => flipRecord(record2)).toThrow()
})

