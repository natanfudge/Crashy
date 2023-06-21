import "fudge-lib/dist/extensions/Extensions"

import {getYarnBuilds} from "../../mappings/providers/YarnMappingsProvider";
import {DesiredBuildProblem, getMappingForContext, MappingContext} from "../../mappings/resolve/MappingStrategy";
import {resolveMappingsChain} from "../../mappings/resolve/MappingsResolver";
import {
    IntermediaryToYarnMappingsProvider,
    OfficialToIntermediaryMappingsProvider,
    OfficialToSrgMappingsProvider,
    SrgToMcpMappingsProvider
} from "../../mappings/providers/MappingsProvider";

import "fudge-lib/dist/extensions/ExtensionsImpl"
import {JavaClass, SimpleMappable, SimpleMethod} from "../../crash/model/Mappable";
import {HashSet} from "fudge-lib/dist/collections/hashmap/HashSet";
import {LoaderType} from "../../crash/model/RichCrashReport";
import {expect, test} from 'vitest'
import {fetcher} from "fudge-lib/dist/methods/Http";
import fetch from "node-fetch";
// @ts-ignore
fetcher.fetch = fetch

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

    const mappingStrategy = await getMappingForContext({
        originalNamespace: "Intermediary",
        relevantMappables: HashSet.of<SimpleMappable>(testClass, testMethod, testMethod.classIn),
        desiredNamespace: "Yarn",
        desiredBuild: versions[0].version,
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

    const mappingStrategy = await getMappingForContext({
        relevantMappables: HashSet.of<SimpleMappable>(testClass, testMethod, testMethod.classIn),
        desiredNamespace: "MojMap",
        desiredBuild: "1.17.1+build.65",
        originalNamespace: "Yarn",
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

    const mappingStrategy = await getMappingForContext({
        relevantMappables: HashSet.of<SimpleMappable>(testClass, testMethod, testMethod.classIn),
        desiredNamespace: "Yarn",
        desiredBuild: "1.18.2+build.4",
        originalNamespace: "ForgeRuntime",
        minecraftVersion: "1.18.2"
    })
    const remappedClass = testClass.fullName(mappingStrategy)
    expect(remappedClass).toEqual("net.minecraft.client.MinecraftClient")

    const remappedMethodFull = testMethod.fullName(mappingStrategy)
    const remappedMethodSimple = testMethod.simpleName(mappingStrategy)

    expect(remappedMethodFull).toEqual("net.minecraft.client.MinecraftClient#render")
    expect(remappedMethodSimple).toEqual("MinecraftClient#render")
}, 30_000)


// test("Remapping m_7731 works to intermediary works", async () => {
//     const testClass = JavaClass.dotSeperated("net.minecraft.world.level.Level")
//     const testMethod = testClass.withMethod("m_7731_")
//
//     const context: Omit<MappingContext, "desiredNamespace"> = {
//         relevantMappables: HashSet.of<SimpleMappable>(testClass, testMethod, testMethod.classIn),
//         desiredBuild: DesiredBuildProblem.NoBuildsForNamespace,
//         loader: LoaderType.Forge,
//         isDeobfuscated: false,
//         minecraftVersion: "1.18.2"
//     }
//
//     const finalMappingStrategy = await getMappingForName(testClass, {
//             ...context, desiredNamespace: "Intermediary"
//         }
//     )
//
//     const remappedMethodFull = testMethod.fullName(finalMappingStrategy)
//     const remappedMethodSimple = testMethod.simpleName(finalMappingStrategy)
//
//     expect(remappedMethodFull).toEqual("net.minecraft.class_1945#method_8652")
//     expect(remappedMethodSimple).toEqual("class_1945.method_8652")
// }, 30_000)


// Expected mapping path.
// net.minecraft.world.level.Level#m_7731_ ->
// net.minecraft.src.C_1596_#m_7731_(Lnet/minecraft/core/BlockPos;Lnet/minecraft/world/level/block/state/BlockState;I)Z
// cav#a(Lgj;Lcov;I)Z
//