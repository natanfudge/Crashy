import {Mappings} from "../Mappings";
import {withDotNotation} from "./ProviderUtils";
import {StringMap} from "crash-parser/src/model/CrashReport";
import {mapRecord} from "../../utils/Javascript";
import {BiMap} from "../../utils/BiMap";

export const ClassMethodSeperator = "#"

export async function parseTinyFile(contents: string): Promise<Mappings> {
    const classMappings = contents.split("\nc").map(e => e.split("\n").map(c => c.split("\t", -1)));
    const first_line = classMappings.shift();
    if (first_line === undefined) {
        throw new Error("ERROR PARSING YARN MAPPINGS FILE!");
    }

    // We keep the slash notation at the start because that's what descriptors use
    const classesWithSlashNotation: StringMap = {}
    const noDescriptorToDescriptorMethods: StringMap = {}
    const descriptorToDescriptorMethods: StringMap = {}

    // We go through all the class mappings first and store them so we can remap descriptors on each individual method below
    for (const classMapping of classMappings) {
        const [, fromClass, toClass] = classMapping[0];
        classesWithSlashNotation[fromClass] = toClass;
    }

    for (const clazz of classMappings) {
        const [,fromClass,toClass] = clazz[0];

        for (const item of clazz) {
            // Skip anything that can't be a method declaration
            if (item.length < 5) continue;
            const [,identifier,descriptor,methodUnmapped,methodMapped] = item;
            switch (identifier) {
                // class method
                case "m":
                    // const descriptor = item[2]
                    // const fromMethod = item[3]
                    // const toMethod = item[4]

                    const simpleFromMethodName = withDotNotation(fromClass + ClassMethodSeperator + methodUnmapped)
                    const fullFromMethodName = simpleFromMethodName + descriptor;
                    const fullToMethodName = withDotNotation(toClass + ClassMethodSeperator + methodMapped)
                        + remapDescriptor(descriptor, classesWithSlashNotation)
                    noDescriptorToDescriptorMethods[simpleFromMethodName] = fullToMethodName;
                    descriptorToDescriptorMethods[fullFromMethodName] = fullToMethodName;
                    break;
                default:
            }
        }
    }

    return {
        classes: new BiMap(mapRecord(classesWithSlashNotation, k => withDotNotation(k),( k, v )=> withDotNotation(v))),
        descriptorToDescriptorMethods: new BiMap(descriptorToDescriptorMethods),
        noDescriptorToDescriptorMethods: new BiMap(noDescriptorToDescriptorMethods)
    };
}

// function addMethod()

function remapDescriptor(descriptor: string, classMappings: StringMap): string {
    return descriptor.replace(/L(.+?);/g, (match, p1) => `L${classMappings[p1] ?? p1};`);
}
