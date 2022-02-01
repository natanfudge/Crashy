import "crash-parser/src/util/Extensions"
import {
    JavaClass,
    JavaMethod,
    LoaderType
} from "crash-parser/src/model/RichCrashReport";
import {parseCrashReportRich} from "crash-parser/src/parser/CrashReportEnricher";
import {testFabricCrashReport} from "crash-parser/src/test/TestCrashes";
import {getYarnBuilds, getYarnMappings} from "../mappings/providers/YarnMappingsProvider";
import {getMappingForName} from "../mappings/MappingMethod";
import {resolveMappingsChain} from "../mappings/MappingsResolver";
import {
    IntermediaryToQuiltMappingsProvider,
    OfficialToIntermediaryMappingsProvider,
    OfficialToSrgMappingsProvider,
    SrgToMcpMappingsProvider
} from "../mappings/MappingsProvider";

import "crash-parser/src/util/ExtensionsImpl"


//TODO: test it does the shortest path by adding more providers
test("Mappings BFS works correctly", () => {
    const path1 = resolveMappingsChain("Mcp", "Quilt")
    expect(path1).toEqual([SrgToMcpMappingsProvider, OfficialToSrgMappingsProvider, OfficialToIntermediaryMappingsProvider, IntermediaryToQuiltMappingsProvider])

    const path2 = resolveMappingsChain("Official", "Quilt")
    expect(path2).toEqual([OfficialToIntermediaryMappingsProvider, IntermediaryToQuiltMappingsProvider])

    const path3 = resolveMappingsChain("Intermediary", "Srg")
    expect(path3).toEqual([OfficialToIntermediaryMappingsProvider, OfficialToSrgMappingsProvider])
})

test("Remapping works correctly", async () => {
    const versions = await getYarnBuilds("1.18.1");
    // const mappings = await getYarnMappings(versions[0].version)
    const testClass: JavaClass = new JavaClass("net.minecraft.class_5973", false)

    const mappings = await getMappingForName(testClass, {
        desiredNamespace: "Yarn",
        desiredBuild: versions[0].version,
        loader: LoaderType.Fabric,
        isDeobfuscated: false,
        minecraftVersion: "1.18.1"
    })
    const remappedClass = testClass.fullName(mappings)
    expect(remappedClass).toEqual("net.minecraft.util.math.MathConstants")

    const testMethod: JavaMethod = new JavaMethod(new JavaClass("net.minecraft.class_3060",false), "method_13365")

    const remappedMethodFull = testMethod.fullName(mappings)
    const remappedMethodSimple = testMethod.simpleName(mappings)

    expect(remappedMethodFull).toEqual("net.minecraft.server.command.ForceLoadCommand#register")
    expect(remappedMethodSimple).toEqual("ForceLoadCommand#register")
}, 30000)

