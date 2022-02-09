import {extractFromZip, NO_CORS_BYPASS, profiler, profilerDel, withDotNotation} from "./ProviderUtils";
import {Mappings} from "../Mappings";
import {BiMap} from "../../utils/BiMap";
import {StringMap} from "crash-parser/src/model/CrashReport";
import {ClassMethodSeperator} from "./TinyMappings";
import {MappingsBuilder, MappingsFilter} from "../storage/MappingsBuilder";
import {JavaClass} from "crash-parser/src/model/Mappable";

enum SRGVersion {
    SRG, TSRG, TSRG2
}

export async function getSrgMappings(mcVersion: string, filter: MappingsFilter): Promise<Mappings> {
    profiler("Downloading SRG Mappings");
    const res = await fetch(`${NO_CORS_BYPASS}/https://maven.minecraftforge.net/de/oceanlabs/mcp/mcp/${mcVersion}/mcp-${mcVersion}-srg.zip`);

    profilerDel("Downloading SRG Mappings");
    const oldFormatMappings = await extractSrgMappings(res);
    const usedMappings = oldFormatMappings ?? await extractTsrgMappings(res);
    const srgVersion = oldFormatMappings !== undefined ? SRGVersion.SRG :
        usedMappings.startsWith("tsrg2") ? SRGVersion.TSRG2 : SRGVersion.TSRG

    return loadSRGMappings(srgVersion, usedMappings, filter)
}

async function extractTsrgMappings(response: Response): Promise<string | undefined> {
    return extractFromZip(response, "config/joined.tsrg")
}

async function extractSrgMappings(response: Response): Promise<string> {
    return (await extractFromZip(response, "joined.srg"))!
}

 function loadSRGMappings(srgVersion: SRGVersion, srg_mappings: string, filter: MappingsFilter): Mappings {
    profiler("Parsing SRG Mappings");
    switch (srgVersion) {
        case SRGVersion.SRG:
            return loadSRG1Mappings(srg_mappings, filter);
        case SRGVersion.TSRG:
            throw new Error("TODO")
            // return loadTSRG1Mappings(srg_mappings);
        case SRGVersion.TSRG2:
            throw new Error("TODO")
            // return loadTSRG2Mappings(srg_mappings);
    }
    profilerDel("Parsing SRG Mappings");
}
// Example: https://maven.minecraftforge.net/de/oceanlabs/mcp/mcp/1.7.10/mcp-1.7.10-srg.zip
 function loadSRG1Mappings(rawMappings: string, filter: MappingsFilter): Mappings {
    const builder = new MappingsBuilder(filter)
    const lines = rawMappings.split("\n");
    for(const line of lines){
        const current_line = line.split(/\s+/);
        switch (current_line[0]) {
            case "CL:":
                builder.addClass(current_line[1],current_line[2])
                break;
            case "FD:":
                // Ignore fields
                break;

            //    Example: MD: aky/a (II)Lrf; net/minecraft/block/BlockFarmland/func_149691_a (II)Lnet/minecraft/util/IIcon;
                //TODO: debug this! make this more readble and make sure its correct
            case "MD:": {
                const obf_parts =  /(.+)\/([^/]+)$/.exec(current_line[1])!;
                const srg_parts = /(.+)\/([^/]+)$/.exec(current_line[3])!
                const className = obf_parts[1]
                builder.addMethod(JavaClass.slashSeperated(className),obf_parts[2],current_line[4],srg_parts[2])
                const id = (/\d+/.exec(srg_parts?.[2]))?.[0];
                if (id === undefined) {
                    console.warn(`NO NUMBERS IN SRG MAPPING??? "${current_line}"`);
                    continue;
                }
                break;
            }
            case "PK:":
                break
        }
    }
    return builder.build();
}

// async function loadTSRG1Mappings(tsrg_mappings: string): Mappings {
//     const lines = tsrg_mappings.split("\n");
//     let current_class: ClassData | null | undefined = null;
//     while (lines.length) {
//         const current_line = <string>lines.shift();
//         const indent = <string>current_line.match(/^\t*/)?.[0];
//         if (indent.length == 0) {
//             const cParts = current_line.trim().split(/\s+/);
//             current_class = await this.getOrAddClass(cParts[0], MappingTypes.OBF);
//             if (current_class == null) {
//                 continue;
//             }
//             current_class.addMapping(MappingTypes.SRG, cParts[1]);
//         } else if (indent.length == 1) {
//             const fmParts = current_line.trim().split(/\s+/);
//             //field
//             if (fmParts.length == 2) {
//                 const current_field = current_class?.getOrAddField(fmParts[0], null, MappingTypes.OBF);
//                 current_field?.addMapping(MappingTypes.SRG, fmParts[1]);
//                 const id = fmParts[1].match(/\d+/)?.[0];
//                 if (!id) {
//                     console.warn(`NO NUMBERS IN SRG MAPPING??? "${current_line}"`);
//                     continue;
//                 }
//                 if (!this.srgFields.has(id)) this.srgFields.set(id, []);
//                 if (current_field) this.srgFields.get(id)?.push(current_field);
//                 //method
//             } else {
//                 const current_method = current_class?.getOrAddMethod(fmParts[0], fmParts[1], MappingTypes.OBF);
//                 current_method?.addMapping(MappingTypes.SRG, fmParts[2]);
//                 const id = fmParts[2].match(/\d+/)?.[0];
//                 if (!id) {
//                     console.warn(`NO NUMBERS IN SRG MAPPING??? "${current_line}"`);
//                     continue;
//                 }
//                 if (!this.srgMethods.has(id)) this.srgMethods.set(id, []);
//                 if (current_method) this.srgMethods.get(id)?.push(current_method);
//             }
//         }
//     }
//
// }
//
// async function loadTSRG2Mappings(tsrg2_mappings: string): Mappings {
//     const lines = tsrg2_mappings.split("\n");
//     lines.shift();
//     let current_class: ClassData | null | undefined = null;
//     let current_item: AbstractData | null | undefined = undefined;
//     while (lines.length) {
//         const current_line = <string>lines.shift();
//         const indent = <string>current_line.match(/^\t*/)?.[0];
//         if (indent.length == 0) {
//             const cParts = current_line.trim().split(/\s+/);
//             current_class = await this.getOrAddClass(cParts[0], MappingTypes.OBF);
//             if (current_class == null) {
//                 continue;
//             }
//             current_class.addMapping(MappingTypes.SRG, cParts[1]);
//         } else if (indent.length == 1) {
//             const fmParts = current_line.trim().split(/\s+/);
//             //field
//             if (fmParts.length == 3) {
//                 current_item = current_class?.getOrAddField(fmParts[0], null, MappingTypes.OBF);
//                 current_item?.addMapping(MappingTypes.SRG, fmParts[1]);
//                 if (!this.srgFields.has(fmParts[2])) this.srgFields.set(fmParts[2], []);
//                 if (current_item) this.srgFields.get(fmParts[2])?.push(<FieldData>current_item);
//                 //method
//             } else {
//                 current_item = current_class?.getOrAddMethod(fmParts[0], fmParts[1], MappingTypes.OBF);
//                 current_item?.addMapping(MappingTypes.SRG, fmParts[2]);
//                 if (!this.srgMethods.has(fmParts[3])) this.srgMethods.set(fmParts[3], []);
//                 if (current_item) this.srgMethods.get(fmParts[3])?.push(<MethodData>current_item);
//             }
//             //param
//         } else if (indent.length == 2) {
//             const pParts = current_line.trim().split(/\s+/);
//             // verify cus things like "static" are at this level too
//             if (pParts.length == 4) {
//                 if (current_item instanceof MethodData) {
//                     if (!current_item.params.has(MappingTypes.SRG)) current_item.params.set(MappingTypes.SRG, new Map());
//                     current_item.params.get(MappingTypes.SRG)?.set(parseInt(pParts[0]), pParts[2]);
//                     if (!this.srgMethods.has(pParts[3])) this.srgMethods.set(pParts[3], []);
//                     this.srgMethods.get(pParts[3])?.push(current_item);
//                 }
//             }
//         }
//     }
// }
