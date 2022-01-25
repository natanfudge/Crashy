import {mcVersionCompare, NO_CORS_BYPASS, profiler, profilerDel } from "./ProviderUtils";
import {MappingsNamespace} from "../MappingsNamespace";
import {ClassItem} from "./ClassItem";

/*
Credit to https://github.com/wagyourtail/wagyourtail.xyz/blob/master/views/sections/Projects/MinecraftMappingViewer/App/app.ts
 */

export async function getYarnMappings(version: number, mcVersion: string) {
    profiler("Downloading Yarn Mappings");
    let res: Response;
    if (mcVersionCompare(mcVersion, "1.14") !== -1)
        res = await fetch(`https://maven.fabricmc.net/net/fabricmc/yarn/${mcVersion}+build.${version}/yarn-${mcVersion}+build.${version}-v2.jar`);
    else
        res = await fetch(`${NO_CORS_BYPASS}/https://maven.legacyfabric.net/net/fabricmc/yarn/${mcVersion}+build.${version}/yarn-${mcVersion}+build.${version}-v2.jar`);
    profilerDel("Downloading Yarn Mappings");
    const zip = new JSZip();
    const zipContent = await zip.loadAsync(await res.arrayBuffer());
    const mappings = await zipContent.file("mappings/mappings.tiny")?.async("string");
    if (mappings) {
        await this.loadYarnMappings(mappings);
    } else {
        console.error("ERROR PARSING YARN MAPPINGS ZIP!");
    }
}

async function loadYarnMappings(yarn_mappings: string, mcVersion: string) {
    // if (this.loadedMappings.has(MappingTypes.YARN)) this.clearMappings(MappingTypes.YARN);
    profiler("Parsing Yarn Mappings");
    // if (!this.loadedMappings.has(MappingTypes.INTERMEDIARY)) {
    //     await this.getIntermediaryMappings();
    //     if (!this.loadedMappings.has(MappingTypes.INTERMEDIARY)) {
    //         alert("FAILED TO LOAD INTERMEDIARY DEPENDENCY");
    //         return;
    //     }
    // }

    //yarn v2's are backwards from 1.14-1.14.2
    const reversed = mcVersionCompare(mcVersion, "1.14.2") < 1 && mcVersionCompare(mcVersion, "1.14") > -1;

    await parseTinyFile(yarn_mappings, "Intermediary", "Yarn", reversed);

    // this.loadedMappings.add("");
    profilerDel("Parsing Yarn Mappings");
}

async function parseTinyFile(contents: string, mapping_From: MappingsNamespace, mapping_To: MappingsNamespace, reversed?: boolean) {
    const class_mappings = contents.split("\nc").map(e => e.split("\n").map(c => c.split("\t", -1)));
    const first_line = class_mappings.shift();
    if (!first_line) {
        console.error("ERROR PARSING YARN MAPPINGS FILE!");
        return;
    }

    let current: ClassItem | null = null;
    let current_param: string | null = null;

    for (const clazz of class_mappings) {
        const class_def = clazz[0];
        const from = class_def?.[reversed ? 2 : 1];
        const to = class_def?.[reversed ? 1 : 2];
        if (!from || !to) {
            console.error("ERROR PARSING YARN MAPPINGS FILE, bad class definition???");
            continue;
        }

        let current_class = await this.getOrAddClass(from, mapping_From);
        if (current_class == null) {
            console.error("ERROR PARSING YARN MAPPINGS FILE, could not find intermediaries for class: " + from + " " + to);
            continue;
        }
        current_class.addMapping(mapping_To, to);
    }

    for (const clazz of class_mappings) {
        const class_def = clazz.shift();
        const from = class_def?.[reversed ? 2 : 1];
        const to = class_def?.[reversed ? 1 : 2];
        if (!from || !to) {
            console.error("ERROR PARSING YARN MAPPINGS FILE, bad class definition???");
            continue;
        }

        let current_class = await this.getOrAddClass(from, mapping_From);
        if (current_class == null) {
            continue;
        }

        for (const item of clazz) {
            //skip empty line
            if (item.join("").trim() === "") continue;
            switch (item[1]) {
                // class comment
                case "c":
                    current_class.comments.set(mapping_To, item.slice(2).join("\t").replace(/\\n/g, "<br>"));
                    break;
                // class method
                case "m":
                    current = current_class.getOrAddMethod(item[reversed ? 4 : 3], reversed ? this.transformDesc(this.reverseTransformDesc(item[2], mapping_To), mapping_From) ?? item[2] : item[2], mapping_From);
                    current?.addMapping(mapping_To, item[reversed ? 3 : 4]);
                    break;
                // class field
                case "f":
                    current = current_class.getOrAddField(item[reversed ? 4 : 3], reversed ? this.transformDesc(this.reverseTransformDesc(item[2], mapping_To), mapping_From) ?? item[2] : item[2], mapping_From);
                    current?.addMapping(mapping_To, item[reversed ? 3 : 4]);
                    break;
                case "":
                    switch (item[2]) {
                        // item comment
                        case "c":
                            current?.comments.set(mapping_To, item.slice(3).join("\t").replace(/\\n/g, "<br>"));
                            break;
                        // item param
                        case "p":
                            if (current && current instanceof MethodData) {
                                if (!current.params.has(mapping_To)) current.params.set(mapping_To, new Map());
                                current.params.get(mapping_To)?.set(parseInt(item[3]), current_param = item[5]);
                            } else {
                                console.error("ERROR PARSING YARN MAPPINGS FILE, param on field??? " + item.join(","));
                            }
                            break;
                        case "":
                            switch (item[3]) {
                                //param comment
                                case "c":
                                    current?.comments.set(mapping_To, (current?.comments.get(mapping_To) ?? "") + `<br>@param ${current_param} ${item.slice(4).join("\t").replace(/\\n/g, "<br>")}`);
                                    break;
                                default:
                                    console.error("ERROR PARSING YARN MAPPINGS FILE, unknown item-item element: " + item.join(","));
                            }
                            break;
                        default:
                            console.error("ERROR PARSING YARN MAPPINGS FILE, unknown class item element: " + item.join(","));
                    }
                    break;
                default:
                    console.error(item);
                    console.error("ERROR PARSING YARN MAPPINGS FILE, unknown class element: " + item.join(","));
            }
        }
    }
}


