import {getYarnBuilds} from "../mappings/YarnMappingsProvider";
import "crash-parser/src/util/Extensions"
import {
    JavaClass,
    javaClassFullName,
    JavaMethod,
    javaMethodFullName,
    javaMethodSimpleName,
    LoaderType
} from "crash-parser/src/model/RichCrashReport";
import {parseCrashReportRich} from "crash-parser/src/parser/CrashReportEnricher";
import {testFabricCrashReport} from "crash-parser/src/test/TestCrashes";
import {getYarnMappings2} from "../mappings/providers/YarnMappingsProvider2";
import {getMappingForName} from "../mappings/MappingMethod";
import {resolveMappingsChain} from "../mappings/MappingsResolver";
import {
    IntermediaryToQuiltMappingsProvider,
    OfficialToIntermediaryMappingsProvider,
    OfficialToSrgMappingsProvider,
    SrgToMcpMappingsProvider
} from "../mappings/MappingsProvider";

// test("Yarn mappings can be retrieved", async () => {
//     const versions = await getYarnBuilds("1.18.1");
//     const mappings = await getYarnMappings(versions[0].version)
//     expect(mappings.classes["net.minecraft.class_5973"]).toEqual("net.minecraft.util.math.MathConstants")
//     expect(mappings.methods["method_13365"]).toEqual("register")
//     // expect(mappings.fields["field_29658"]).toEqual("PI")
// }, 15000)



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
    const testClass: JavaClass = {
        packageName: "net.minecraft",
        simpleName: "class_5973"
    }

    const mappings = await getMappingForName(testClass,{
        desiredNamespace: "Yarn",
        desiredBuild: versions[0].version,
        loader: LoaderType.Fabric,
        isDeobfuscated: false,
        minecraftVersion: "1.18.1"
    })
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
}, 30000)

test("Mappings detection works correctly", () => {
    const report = parseCrashReportRich(testFabricCrashReport);
})
