
import { AllowAllMappings } from "../../mappings/MappingsFilter";
import {MappingsProvider} from "../../mappings/providers/MappingsProvider";
import {DescriptoredMethod, JavaClass} from "../../crash/model/Mappable";
import {equalsOfAnything} from "fudge-lib/src/collections/hashmap/EqualsImplementation";
import {typedKeys} from "../../fudge-commons/methods/Typescript";
import {expect} from 'vitest'

export interface MappingAssertions {
    classes: Record<string, string>
    methods: Record<string, string>
}


export async function testMappingsProvider(provider: MappingsProvider, mcVersion = "1.18.1", assertions: MappingAssertions) {
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
