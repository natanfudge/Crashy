import {Mappings} from "crash-parser/src/util/common/Mappings";
import {MappingsBuilder} from "crash-parser/src/util/common/MappingsBuilder";
import {MappingsFilter} from "crash-parser/src/util/common/MappingsFilter";

export const ClassMethodSeperator = "#"

export  function parseTinyFile(contents: string, filter: MappingsFilter): Mappings {
    const classMappings = contents.split("\nc").map(e => e.split("\n").map(c => c.split("\t", -1)));
    const first_line = classMappings.shift();
    if (first_line === undefined) {
        throw new Error("ERROR PARSING YARN MAPPINGS FILE!");
    }

    const mappings = new MappingsBuilder(filter)

    for (const clazz of classMappings) {
        const [, fromClass, toClass] = clazz[0];
        const javaClass = mappings.addClass(fromClass, toClass)
        // Class's contents are not needed
        if (javaClass === undefined) continue;

        for (const item of clazz) {
            // Skip anything that can't be a method declaration
            if (item.length < 5) continue;
            const [, identifier, descriptor, methodUnmapped, methodMapped] = item;
            switch (identifier) {
                // class method
                case "m":
                    mappings.addMethod(javaClass, methodUnmapped, descriptor, methodMapped)
                    break;
                default:
            }
        }
    }

    return mappings.build()
}
