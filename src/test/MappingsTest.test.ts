import {getYarnMappings, getYarnBuilds} from "../mappings/YarnMappingsProvider";

test("Yarn mappings can be retrieved", async () => {
    const versions = await getYarnBuilds("1.18.1");
    const mappings = await getYarnMappings(versions[0])
    expect(mappings.classes["net/minecraft/class_5973"]).toEqual("net/minecraft/util/math/MathConstants")
    expect(mappings.methods["method_13365"]).toEqual("register")
    expect(mappings.fields["field_29658"]).toEqual("PI")
})