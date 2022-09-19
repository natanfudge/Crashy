import "../fudge-commons/src/util/Extensions"

import {getYarnBuilds, getYarnMappings} from "../mappings/providers/YarnMappingsProvider";
import {getMappingForName} from "../mappings/resolve/MappingStrategy";
import {resolveMappingsChain} from "../mappings/resolve/MappingsResolver";
import {
    IntermediaryToQuiltMappingsProvider,
    OfficialToIntermediaryMappingsProvider,
    OfficialToSrgMappingsProvider,
    SrgToMcpMappingsProvider
} from "../mappings/providers/MappingsProvider";

import "../fudge-commons/src/util/ExtensionsImpl"
import {BasicMappable, JavaClass, JavaMethod} from "../crash/model/Mappable";
import {HashSet} from "../fudge-commons/collections/hashmap/HashSet";
import {LoaderType} from "../crash/model/RichCrashReport";



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
    // const builds = versions[0].version;
    // const mappings = await getYarnMappings(builds, AllowAllMappings)
    const testClass: JavaClass =  JavaClass.dotSeperated("net.minecraft.class_5973")
    const testMethod: JavaMethod = JavaMethod.dotSeperated("net.minecraft.class_3060","method_13365")

    const mappingStrategy = await getMappingForName(testClass, {
        relevantMappables: HashSet.of<BasicMappable>(testClass, testMethod, testMethod.classIn),
        desiredNamespace: "Yarn",
        desiredBuild: versions[0].version,
        loader: LoaderType.Fabric,
        isDeobfuscated: false,
        minecraftVersion: "1.18.1"
    })
    const remappedClass = testClass.fullName(mappingStrategy)
    expect(remappedClass).toEqual("net.minecraft.util.math.MathConstants")


    const remappedMethodFull = testMethod.fullName(mappingStrategy)
    const remappedMethodSimple = testMethod.simpleName(mappingStrategy)

    expect(remappedMethodFull).toEqual("net.minecraft.server.command.ForceLoadCommand#register")
    expect(remappedMethodSimple).toEqual("ForceLoadCommand#register")
}, 30000)

