import "../../fudge-commons/extensions/Extensions"

import {getYarnBuilds} from "../../mappings/providers/YarnMappingsProvider";
import {getMappingForName} from "../../mappings/resolve/MappingStrategy";
import {resolveMappingsChain} from "../../mappings/resolve/MappingsResolver";
import {
    IntermediaryToYarnMappingsProvider,
    OfficialToIntermediaryMappingsProvider,
    OfficialToSrgMappingsProvider,
    SrgToMcpMappingsProvider
} from "../../mappings/providers/MappingsProvider";

import "../../fudge-commons/extensions/ExtensionsImpl"
import {JavaClass, SimpleMappable, SimpleMethod} from "../../crash/model/Mappable";
import {HashSet} from "../../fudge-commons/collections/hashmap/HashSet";
import {LoaderType} from "../../crash/model/RichCrashReport";
import {expect, test} from 'vitest'



test("Mappings BFS works correctly", () => {
    const path1 = resolveMappingsChain("Mcp", "Yarn", "1.14.4")
    expect(path1).toEqual([SrgToMcpMappingsProvider, OfficialToSrgMappingsProvider, OfficialToIntermediaryMappingsProvider, IntermediaryToYarnMappingsProvider])

    const path2 = resolveMappingsChain("Official", "Yarn", "1.14.4")
    expect(path2).toEqual([OfficialToIntermediaryMappingsProvider, IntermediaryToYarnMappingsProvider])

    const path3 = resolveMappingsChain("Intermediary", "Srg", "1.14.4")
    expect(path3).toEqual([OfficialToIntermediaryMappingsProvider, OfficialToSrgMappingsProvider])
})

test("Remapping works correctly", async () => {
    const versions = await getYarnBuilds("1.18.1");
    // const builds = versions[0].version;
    // const mappings = await getYarnMappings(builds, AllowAllMappings)
    const testClass: JavaClass = JavaClass.dotSeperated("net.minecraft.class_5973")
    const testMethod: SimpleMethod = SimpleMethod.dotSeperated("net.minecraft.class_3060", "method_13365")

    const mappingStrategy = await getMappingForName(testClass, {
        relevantMappables: HashSet.of<SimpleMappable>(testClass, testMethod, testMethod.classIn),
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


test("Remapping from yarn to mojmap works correctly", async () => {
    const testClass: JavaClass = JavaClass.dotSeperated("net.minecraft.client.MinecraftClient")
    const testMethod: SimpleMethod = SimpleMethod.dotSeperated("net.minecraft.client.MinecraftClient", "tick")

    const mappingStrategy = await getMappingForName(testClass, {
        relevantMappables: HashSet.of<SimpleMappable>(testClass, testMethod, testMethod.classIn),
        desiredNamespace: "MojMap",
        desiredBuild: "1.17.1+build.65",
        loader: LoaderType.Fabric,
        isDeobfuscated: true,
        minecraftVersion: "1.17.1"
    })
    const remappedClass = testClass.fullName(mappingStrategy)
    expect(remappedClass).toEqual("net.minecraft.client.Minecraft")


    const remappedMethodFull = testMethod.fullName(mappingStrategy)
    const remappedMethodSimple = testMethod.simpleName(mappingStrategy)

    expect(remappedMethodFull).toEqual("net.minecraft.client.Minecraft#tick")
    expect(remappedMethodSimple).toEqual("Minecraft#tick")
}, 30000)


test("Remapping from ForgeRuntime to yarn works correctly", async () => {
    const testClass: JavaClass = JavaClass.dotSeperated("net.minecraft.client.Minecraft")
    const testMethod: SimpleMethod = SimpleMethod.dotSeperated("net.minecraft.client.Minecraft", "m_91383_")

    const mappingStrategy = await getMappingForName(testClass, {
        relevantMappables: HashSet.of<SimpleMappable>(testClass, testMethod, testMethod.classIn),
        desiredNamespace: "Yarn",
        desiredBuild: "1.18.2+build.4",
        loader: LoaderType.Forge,
        isDeobfuscated: false,
        minecraftVersion: "1.18.2"
    })
    const remappedClass = testClass.fullName(mappingStrategy)
    expect(remappedClass).toEqual("net.minecraft.client.MinecraftClient")

    const remappedMethodFull = testMethod.fullName(mappingStrategy)
    const remappedMethodSimple = testMethod.simpleName(mappingStrategy)

    expect(remappedMethodFull).toEqual("net.minecraft.client.MinecraftClient#render")
    expect(remappedMethodSimple).toEqual("MinecraftClient#render")
}, 30_000)