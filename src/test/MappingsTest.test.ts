import {getYarnBuilds, getYarnMappings} from "../mappings/YarnMappingsProvider";
import {resolveMappingsChain} from "../mappings/MappingsResolver";
import {
    IntermediaryToQuiltMappingsProvider,
    OfficialToIntermediaryMappingsProvider,
    OfficialToSrgMappingsProvider,
    SrgToMcpMappingsProvider
} from "../mappings/MappingsProvider";

test("Yarn mappings can be retrieved", async () => {
    const versions = await getYarnBuilds("1.18.1");
    const mappings = await getYarnMappings(versions[0].version)
    expect(mappings.classes["net/minecraft/class_5973"]).toEqual("net/minecraft/util/math/MathConstants")
    expect(mappings.methods["method_13365"]).toEqual("register")
    expect(mappings.fields["field_29658"]).toEqual("PI")
})

test("Mappings BFS works correctly", () => {
    const path1 = resolveMappingsChain("Mcp", "Quilt")
    expect(path1).toEqual([SrgToMcpMappingsProvider, OfficialToSrgMappingsProvider, OfficialToIntermediaryMappingsProvider, IntermediaryToQuiltMappingsProvider])

    const path2 = resolveMappingsChain("Official", "Quilt")
    expect(path2).toEqual([OfficialToIntermediaryMappingsProvider, IntermediaryToQuiltMappingsProvider])

    const path3 = resolveMappingsChain("Intermediary", "Srg")
    expect(path3).toEqual([OfficialToIntermediaryMappingsProvider, OfficialToSrgMappingsProvider])
})

//TODO: test it does the shortest path by adding more providers