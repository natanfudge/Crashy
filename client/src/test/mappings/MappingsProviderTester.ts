//    const versions = await getYarnBuilds("1.18.1");
//     const mappings = await getYarnMappings(versions[0].version, AllowAllMappings)
//     expect(mappings.mapClass(JavaClass.dotSeperated("net.minecraft.class_5973"), false))
//         .toEqual(JavaClass.dotSeperated("net.minecraft.util.math.MathConstants"))
//     expect(mappings.mapSimpleMethod(JavaMethod.dotSeperated("net.minecraft.class_3060", "method_13365"), false))
//         .toEqual(
//             JavaMethod.dotSeperated("net.minecraft.server.command.ForceLoadCommand", "register").withDescriptor("(Lcom/mojang/brigadier/CommandDispatcher;)V")
//         )
//     expect(mappings.mapDescriptoredMethod(
//         JavaMethod.dotSeperated("net.minecraft.class_3060", "method_13365")
//             .withDescriptor("(Lcom/mojang/brigadier/CommandDispatcher;)V"), false))
//         .toEqual(
//                  JavaMethod.dotSeperated("net.minecraft.server.command.ForceLoadCommand", "register").withDescriptor("(Lcom/mojang/brigadier/CommandDispatcher;)V")
//         )
//
//     expect(mappings.mapClass(JavaClass.dotSeperated("net.minecraft.util.math.MathConstants"), true))
//         .toEqual(JavaClass.dotSeperated("net.minecraft.class_5973"))
//     expect(mappings.mapSimpleMethod(JavaMethod.dotSeperated("net.minecraft.server.command.ForceLoadCommand", "register"), true))
//         .toEqual(JavaMethod.dotSeperated("net.minecraft.class_3060", "method_13365")
//             .withDescriptor("(Lcom/mojang/brigadier/CommandDispatcher;)V"))
//     expect(mappings.mapDescriptoredMethod(
//         JavaMethod.dotSeperated("net.minecraft.server.command.ForceLoadCommand", "register")
//             .withDescriptor("(Lcom/mojang/brigadier/CommandDispatcher;)V"), true)
//     )
//         .toEqual(JavaMethod.dotSeperated("net.minecraft.class_3060", "method_13365")
//             .withDescriptor("(Lcom/mojang/brigadier/CommandDispatcher;)V")
//         )
//    expect(
//         result.method.classIn.getUnmappedFullName() === "net.minecraft.class_276" &&
//         ((result.method.getUnmappedMethodName() === "method_1232" && result.descriptor === "(I)V") ||
//             (result.method.getUnmappedMethodName() === "method_1234" && result.descriptor === "(IIZ)V") ||
//             (result.method.getUnmappedMethodName() === "method_1234" && result.descriptor === "(FFFF)V"))
//     ).toBeTruthy()
import { AllowAllMappings } from "../../mappings/MappingsFilter";
import {MappingsProvider} from "../../mappings/providers/MappingsProvider";
import {DescriptoredMethod, JavaClass} from "../../crash/model/Mappable";
import {equalsOfAnything} from "../../fudge-commons/collections/hashmap/EqualsImplementation";
import {typedKeys} from "../../fudge-commons/methods/Typescript";

export interface MappingAssertions {
    classes: Record<string, string>
    methods: Record<string, string>
    // simpleMethods: Record<string, MethodMappingAssertion>
    // descMethods: Record<string, string>
}

export interface MethodMappingAssertion {
    class: string
    possibleMethods: string[]
}

// interface ClassMappingAssertion

export async function testMappingsProvider(provider: MappingsProvider, mcVersion = "1.18.1", assertions: MappingAssertions) {
    // noinspection JSDeprecatedSymbols
    const versions = await provider.getBuilds(mcVersion);
    const mappings = await provider.getMappings({minecraftVersion: mcVersion, build: versions[0]}, AllowAllMappings);

    for (const unmappedClass in assertions.classes) {
        const mappedClass = assertions.classes[unmappedClass];
        expect(mappings.mapClass(JavaClass.anySeparation(unmappedClass), false).getUnmappedFullClassName()).toEqual(mappedClass)
        expect(mappings.mapClass(JavaClass.anySeparation(mappedClass), true).getUnmappedFullClassName()).toEqual(unmappedClass)
    }

    //: better method: specify all possible mappings of an obf method name and let the tester do the rest

    for (const unmappedMethod in assertions.methods) {
        const mappedMethod = assertions.methods[unmappedMethod];

        if(!unmappedMethod.includes("#")) {
            throw new Error(`Invalid Test: specified unmapped method '${unmappedMethod}' doesn't include method separator #`)
        }

        if(!mappedMethod.includes("#")) {
            throw new Error(`Invalid Test: specified mapped method '${mappedMethod}' doesn't include method separator #`)
        }

        // if(unmappedMethod.includes("/")) {
        //     throw new Error(`Invalid Test: specified unmapped method '${unmappedMethod}' has slashes / instead of dots .`)
        // }
        //
        // if(mappedMethod.includes("/")) {
        //     throw new Error(`Invalid Test: specified mapped method '${mappedMethod}' has slashes / instead of dots .`)
        // }

        const unmappedDescriptoredMethod = DescriptoredMethod.parse(unmappedMethod);
        const unmappedSimpleMethod = unmappedDescriptoredMethod.method;

        const mappedDescriptoredMethod = DescriptoredMethod.parse(mappedMethod);
        const mappedSimpleMethod = mappedDescriptoredMethod.method;

        expectToEqualAny(mappings.mapSimpleMethod(unmappedSimpleMethod, false).getUnmappedFullName(), Object.values(assertions.methods));
        expectToEqualAny(mappings.mapSimpleMethod(mappedSimpleMethod, true).getUnmappedFullName(), typedKeys(assertions.methods));

        expect(mappings.mapDescriptoredMethod(unmappedDescriptoredMethod,false).getUnmappedFullName()).toEqual(mappedMethod)
        expect(mappings.mapDescriptoredMethod(mappedDescriptoredMethod,true).getUnmappedFullName()).toEqual(unmappedMethod)
    }
}

function expectToEqualAny<T>(target: T, toAny: T[]) {
    // eslint-disable-next-line
    if (toAny.none(element => equalsOfAnything(target, element))) {
        const options = toAny.map(option => "\t" + String(option)).join("\n")
        throw new Error(`Expected to be equal to one of multiple options, but is equal to none.\nActual: ${target}\nExpected Options:\n ${options}`)
    }

}

//     expect(mappings.mapSimpleMethod(JavaMethod.dotSeperated("net.minecraft.class_3060", "method_13365"), false))
//         .toEqual(
//             JavaMethod.dotSeperated("net.minecraft.server.command.ForceLoadCommand", "register").withDescriptor("(Lcom/mojang/brigadier/CommandDispatcher;)V")
//         )
//     expect(mappings.mapDescriptoredMethod(
//         JavaMethod.dotSeperated("net.minecraft.class_3060", "method_13365")
//             .withDescriptor("(Lcom/mojang/brigadier/CommandDispatcher;)V"), false))
//         .toEqual(
//                  JavaMethod.dotSeperated("net.minecraft.server.command.ForceLoadCommand", "register").withDescriptor("(Lcom/mojang/brigadier/CommandDispatcher;)V")
//         )
//
//     expect(mappings.mapClass(JavaClass.dotSeperated("net.minecraft.util.math.MathConstants"), true))
//         .toEqual(JavaClass.dotSeperated("net.minecraft.class_5973"))
//     expect(mappings.mapSimpleMethod(JavaMethod.dotSeperated("net.minecraft.server.command.ForceLoadCommand", "register"), true))
//         .toEqual(JavaMethod.dotSeperated("net.minecraft.class_3060", "method_13365")
//             .withDescriptor("(Lcom/mojang/brigadier/CommandDispatcher;)V"))
//     expect(mappings.mapDescriptoredMethod(
//         JavaMethod.dotSeperated("net.minecraft.server.command.ForceLoadCommand", "register")
//             .withDescriptor("(Lcom/mojang/brigadier/CommandDispatcher;)V"), true)
//     )
//         .toEqual(JavaMethod.dotSeperated("net.minecraft.class_3060", "method_13365")
//             .withDescriptor("(Lcom/mojang/brigadier/CommandDispatcher;)V")
//         )
//    expect(
//         result.method.classIn.getUnmappedFullName() === "net.minecraft.class_276" &&
//         ((result.method.getUnmappedMethodName() === "method_1232" && result.descriptor === "(I)V") ||
//             (result.method.getUnmappedMethodName() === "method_1234" && result.descriptor === "(IIZ)V") ||
//             (result.method.getUnmappedMethodName() === "method_1234" && result.descriptor === "(FFFF)V"))
//     ).toBeTruthy()
