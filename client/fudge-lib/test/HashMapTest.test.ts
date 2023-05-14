import {expect, test} from 'vitest'
import {HashMap} from "../src/collections/hashmap/HashMap";

test("HashMap works with strings", () => {
    const stringMap = new HashMap<string, string>(100);
    stringMap.put("Foo", "Bar")
    stringMap.put("Biz", "Baz")
    stringMap.put("Boz", "Booz")

    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            for (let k = 0; k < 3; k++) {
                stringMap.put(i.toString() + j.toString() + k.toString(), j.toString() + "val")
            }
        }
    }

    expect(stringMap.get("Foo")).toEqual("Bar")
    expect(stringMap.get("Biz")).toEqual("Baz")
    expect(stringMap.get("Boz")).toEqual("Booz")

    expect(stringMap.get("122")).toEqual("2val")
    expect(stringMap.get("123")).toEqual(undefined)
    expect(stringMap.get("451")).toEqual("5val")

    stringMap.put("Foo", "Hola")
    expect(stringMap.get("Foo")).toEqual("Hola")


})

test("HashMap works with numbers", () => {
    const numberMap = new HashMap<number, string>(100);

    numberMap.put(1, "Bar")
    numberMap.put(-70, "Baz")
    numberMap.put(12312414, "Booz")
    // ,
    //   "overrides": [
    //     "restrict-plus-operands"
    //   ]

    expect(numberMap.get(1)).toEqual("Bar")
    expect(numberMap.get(-70)).toEqual("Baz")

    numberMap.put(1, "Hola")
    expect(numberMap.get(1)).toEqual("Hola")

    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            for (let k = 0; k < 3; k++) {
                numberMap.put(i + j + k, i + "val")
            }
        }
    }

    expect(numberMap.get(12312414)).toEqual("Booz")

    expect(numberMap.get(20)).toEqual("9val")
})

interface SimpleObject {
    str: string
    num: number | undefined
    bool: boolean
}

interface ComplexObject {
    obj: SimpleObject
    record: Record<string, boolean>
}

test("HashMap works with complex objects", () => {
    const objectMap = new HashMap<ComplexObject, string>(100);

    objectMap.put({
        obj: {
            str: "foo",
            num: 123,
            bool: true
        }, record: {
            "fff": true,
            "bbb":false
        }
    }, "Bar")
    objectMap.put({
        obj:{
            str: "",
            num: undefined,
            bool: false
        }, record: {

        }
    }, "Baz")
    objectMap.put({
        obj: {
            str: "131241 qrqwer q2",
            num: 24312365125,
            bool: true
        }, record: {
            "!2313": false,
            "5555": false,
            "555555555555555": false
        }
    }, "Booz")


    expect(objectMap.get({
        obj: {
            str: "foo",
            num: 123,
            bool: true
        }, record: {
            "fff": true,
            "bbb":false
        }
    })).toEqual("Bar")
    expect(objectMap.get({
        obj:{
            str: "",
            num: undefined,
            bool: false
        }, record: {

        }
    })).toEqual("Baz")
    expect(objectMap.get({
        obj: {
            str: "131241 qrqwer q2",
            num: 24312365125,
            bool: true
        }, record: {
            "!2313": false,
            "5555": false,
            "555555555555555": false
        }
    })).toEqual("Booz")



})

test("HashMap works with simple objects", () => {
    const objectMap = new HashMap<SimpleObject, string>(100);

    const objA = {
        str: "foo",
        num: 123,
        bool: true
    }
    const objB = {
        str: "",
        num: undefined,
        bool: false
    }

    const objC = {
        str: "131241 qrqwer q2",
        num: 24312365125,
        bool: true
    }

    objectMap.put(objA, "Bar")
    objectMap.put(objB, "Baz")
    objectMap.put(objC, "Booz")


    expect(objectMap.get({
        str: "foo",
        num: 123,
        bool: true
    })).toEqual("Bar")
    expect(objectMap.get({
        str: "",
        num: undefined,
        bool: false
    })).toEqual("Baz")
    expect(objectMap.get({
        str: "131241 qrqwer q2",
        num: 24312365125,
        bool: true
    })).toEqual("Booz")

    objectMap.put({
        str: "131241 qrqwer q2",
        num: 24312365125,
        bool: true
    }, "Hola")
    expect(objectMap.get({
        str: "131241 qrqwer q2",
        num: 24312365125,
        bool: true
    })).toEqual("Hola")

    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            for (let k = 0; k < 3; k++) {
                objectMap.put({
                    str: "131241 qrqwer q2",
                    num: i + j * 10 + k * 100,
                    bool: true
                }, i + "val")
            }
        }
    }

    expect(objectMap.get({
        str: "131241 qrqwer q2",
        num: 144,
        bool: true
    })).toEqual("4val")

})
