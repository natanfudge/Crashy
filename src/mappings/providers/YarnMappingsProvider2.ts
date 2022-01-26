import {extractMappings, profiler, profilerDel, withDotNotation} from "./ProviderUtils";
import {ClassData} from "./ClassItem";
import {Mappings} from "../Mappings";

export async function getYarnMappings2(build: string): Promise<Mappings> {
    profiler("Downloading Yarn Mappings");
    const domain = /*isOlderMcVersion(mcVersion, "1.14") ?
        `${NO_CORS_BYPASS}/https://maven.legacyfabric.net`
        : */"https://maven.fabricmc.net"
    const res = await fetch(`${domain}/net/fabricmc/yarn/${build}/yarn-${build}-v2.jar`);

    profilerDel("Downloading Yarn Mappings");


    const unzipped = await extractMappings(res);
    return loadYarnMappings(unzipped);
}

async function loadYarnMappings(rawMappings: string): Promise<Mappings> {
    profiler("Parsing Yarn Mappings");

//yarn v2's are backwards from 1.14-1.14.2
//     const reversed = isSameOrOlderMcVersion(mcVersion, "1.14.2") && isSameOrNewerMcVersion(mcVersion, "1.14");

    const retval = await parseTinyFile(rawMappings);

    profilerDel("Parsing Yarn Mappings");
    return retval;
}

export const ClassMethodSeperator = "#"

async function parseTinyFile(contents: string): Promise<Mappings> {
    const class_mappings = contents.split("\nc").map(e => e.split("\n").map(c => c.split("\t", -1)));
    const first_line = class_mappings.shift();
    if (first_line === undefined) {
        throw new Error("ERROR PARSING YARN MAPPINGS FILE!");
    }

    const mappings : Mappings = {
        classes: {},
        methods: {}
    }


    for (const clazz of class_mappings) {
        const class_def = clazz[0];
        const fromClass = class_def?.[1];
        const toClass = class_def?.[2];
        if (fromClass === undefined || toClass === undefined) {
            throw new Error("ERROR PARSING YARN MAPPINGS FILE, bad class definition???");
        }

        // const classData = new ClassData(from);
        // classes.set(from, classData);
        mappings.classes[withDotNotation(fromClass)] = withDotNotation(toClass);
        // classData.addMapping(to)
        // let current_class = await this.getOrAddClass(from);
        // if (current_class == null) {
        //     console.error("ERROR PARSING YARN MAPPINGS FILE, could not find intermediaries for class: " + from + " " + to);
        //     continue;
        // }
        // current_class.addMapping(to);

        for (const item of clazz) {
            // skip empty line
            if (item.join("").trim() === "") continue;
            switch (item[1]) {
                // class method
                case "m":
                    const fromMethod = item[3]
                    const toMethod = item[4]
                    mappings.methods[withDotNotation(fromClass + ClassMethodSeperator + fromMethod)] =
                        withDotNotation(toClass + ClassMethodSeperator + toMethod);
                    break;
                default:
                // console.error(item);
                // console.error("ERROR PARSING YARN MAPPINGS FILE, unknown class element: " + item.join(","));
            }
        }
    }
    return mappings;

// for (const clazz of class_mappings) {
//     const class_def = clazz.shift();
//     const from = class_def?.[reversed ? 2 : 1];
//     const to = class_def?.[reversed ? 1 : 2];
//     if (!from || !to) {
//         console.error("ERROR PARSING YARN MAPPINGS FILE, bad class definition???");
//         continue;
//     }
//
//     let current_class = await this.getOrAddClass(from);
//     if (current_class == null) {
//         continue;
//     }
//
//     for (const item of clazz) {
//         // skip empty line
//         if (item.join("").trim() === "") continue;
//         switch (item[1]) {
//             // class method
//             case "m":
//                 current = current_class.getOrAddMethod(item[reversed ? 4 : 3],);
//                 current?.addMapping(item[reversed ? 3 : 4]);
//                 break;
//             default:
//             // console.error(item);
//             // console.error("ERROR PARSING YARN MAPPINGS FILE, unknown class element: " + item.join(","));
//         }
//     }
// }
}


// async getOrAddClass(class_name: string) {
//     // for (const clazz of Array.from(this.classes.values())) {
//     //     if (clazz.getMapping(mapping) === class_name) {
//     //         return clazz;
//     //     }
//     //     if (clazz.getMapping("Official") === class_name) {
//     //         return clazz;
//     //     }
//     // }
//      console.log(`adding class: ${class_name}`);
//     const clazz = new ClassData(this, class_name);
//     this.classes.set(class_name, clazz);
//     return clazz;
// }
