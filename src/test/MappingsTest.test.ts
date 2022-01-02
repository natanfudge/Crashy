import {getYarnBuilds, getYarnMappings} from "../mappings/YarnMappingsProvider";
import {BFS} from "../mappings/MappingsResolver";
import {MappingsNamespace} from "../mappings/MappingsNamespace";
import {mappingsProviders} from "../mappings/MappingsProvider";

test("Yarn mappings can be retrieved", async () => {
    const versions = await getYarnBuilds("1.18.1");
    const mappings = await getYarnMappings(versions[0].version)
    expect(mappings.classes["net/minecraft/class_5973"]).toEqual("net/minecraft/util/math/MathConstants")
    expect(mappings.methods["method_13365"]).toEqual("register")
    expect(mappings.fields["field_29658"]).toEqual("PI")
})

test("Mappings BFS works correctly", () => {
    const path = BFS("Mcp", "Quilt", mappingsProviders)
    const x = 2
})

//TODO: test it does the shortest path by adding more providers