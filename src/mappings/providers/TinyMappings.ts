import {Mappings} from "../Mappings";
import {withDotNotation} from "./ProviderUtils";
import {StringMap} from "crash-parser/src/model/CrashReport";
import {mapRecord} from "../../utils/Javascript";

export const ClassMethodSeperator = "#"

export async function parseTinyFile(contents: string): Promise<Mappings> {
    const class_mappings = contents.split("\nc").map(e => e.split("\n").map(c => c.split("\t", -1)));
    const first_line = class_mappings.shift();
    if (first_line === undefined) {
        throw new Error("ERROR PARSING YARN MAPPINGS FILE!");
    }

    // We keep the slash notation at the start because that's what descriptors use
    const classesWithSlashNotation: StringMap = {}
    const noDescriptorToDescriptorMethods: StringMap = {}
    const descriptorToDescriptorMethods: StringMap = {}
    // const mappings : Mappings = {
    //     classes: {},
    //     noDescriptorToDescriptorMethods: {},
    //     descriptorToDescriptorMethods: {}
    // }

    // We go through all the class mappings first and store them so we can remap descriptors on each individual method below
    for (const clazz of class_mappings) {
        const class_def = clazz[0];
        const fromClass = class_def?.[1];
        const toClass = class_def?.[2];
        if (fromClass === undefined || toClass === undefined) {
            throw new Error("ERROR PARSING YARN MAPPINGS FILE, bad class definition???");
        }
        classesWithSlashNotation[fromClass] = toClass;
    }

    for (const clazz of class_mappings) {
        const class_def = clazz[0];
        const fromClass = class_def?.[1];
        const toClass = class_def?.[2];
        if (fromClass === undefined || toClass === undefined) {
            throw new Error("ERROR PARSING YARN MAPPINGS FILE, bad class definition???");
        }
        for (const item of clazz) {
            // skip empty line
            if (item.join("").trim() === "") continue;
            switch (item[1]) {
                // class method
                case "m":
                    const descriptor = item[2]
                    const fromMethod = item[3]
                    const toMethod = item[4]

                    const simpleFromMethodName = withDotNotation(fromClass + ClassMethodSeperator + fromMethod)
                    const fullFromMethodName = simpleFromMethodName + descriptor;
                    const fullToMethodName = withDotNotation(toClass + ClassMethodSeperator + toMethod)
                        + remapDescriptor(descriptor, classesWithSlashNotation)
                    noDescriptorToDescriptorMethods[simpleFromMethodName] = fullToMethodName;
                    descriptorToDescriptorMethods[fullFromMethodName] = fullToMethodName;
                    break;
                default:
            }
        }
    }

    return {
        classes: mapRecord(classesWithSlashNotation, k => withDotNotation(k), v => withDotNotation(v)),
        descriptorToDescriptorMethods,
        noDescriptorToDescriptorMethods
    };
}

function remapDescriptor(descriptor: string, classMappings: StringMap): string {
    return descriptor.replace(/L(.+?);/g, (match, p1) => `L${classMappings[p1] ?? p1};`);
}
