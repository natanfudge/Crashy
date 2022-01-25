import {getYarnBuilds, getYarnMappings} from "../mappings/YarnMappingsProvider";
import "crash-parser/src/util/Extensions"
import {
    JavaClass,
    javaClassFullName,
    JavaMethod,
    javaMethodFullName,
    javaMethodSimpleName
} from "crash-parser/src/model/RichCrashReport";
import {parseCrashReportRich} from "crash-parser/src/parser/CrashReportEnricher";
import {testFabricCrashReport} from "crash-parser/src/test/TestCrashes";
import {hasNecDeobfuscation} from "../mappings/MappingsDetection";

test("Yarn mappings can be retrieved", async () => {
    const versions = await getYarnBuilds("1.18.1");
    const mappings = await getYarnMappings(versions[0].version)
    expect(mappings.classes["net/minecraft/class_5973"]).toEqual("net/minecraft/util/math/MathConstants")
    expect(mappings.methods["method_13365"]).toEqual("register")
    // expect(mappings.fields["field_29658"]).toEqual("PI")
})

//TODO: test it does the shortest path by adding more providers
//TODO: restore when we have the other mappings
// test("Mappings BFS works correctly", () => {
//     const path1 = resolveMappingsChain("Mcp", "Quilt")
//     expect(path1).toEqual([SrgToMcpMappingsProvider, OfficialToSrgMappingsProvider, OfficialToIntermediaryMappingsProvider, IntermediaryToQuiltMappingsProvider])
//
//     const path2 = resolveMappingsChain("Official", "Quilt")
//     expect(path2).toEqual([OfficialToIntermediaryMappingsProvider, IntermediaryToQuiltMappingsProvider])
//
//     const path3 = resolveMappingsChain("Intermediary", "Srg")
//     expect(path3).toEqual([OfficialToIntermediaryMappingsProvider, OfficialToSrgMappingsProvider])
// })

test("Remapping works correctly", async () => {
    const versions = await getYarnBuilds("1.18.1");
    const mappings = await getYarnMappings(versions[0].version)
    const testClass: JavaClass = {
        packageName: "net.minecraft",
        simpleName: "class_5973"
    }
    const remappedClass = javaClassFullName(testClass, mappings);
    expect(remappedClass).toEqual("net.minecraft.util.math.MathConstants")

    const testMethod: JavaMethod = {
        class: testClass,
        name: "method_13365"
    }

    const remappedMethodFull = javaMethodFullName(testMethod, mappings);
    const remappedMethodSimple = javaMethodSimpleName(testMethod, mappings);

    expect(remappedMethodFull).toEqual("net.minecraft.util.math.MathConstants.register")
    expect(remappedMethodSimple).toEqual("MathConstants.register")
}, 15000)

test("Mappings detection works correctly", () => {
    const report = parseCrashReportRich(testFabricCrashReport);
})
