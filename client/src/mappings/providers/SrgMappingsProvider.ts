import {Mappings} from "../Mappings";
import {MappingsFilter} from "../MappingsFilter";
import {isOlderThan1_12_2} from "./ProviderUtils";
import {MappingsBuilder} from "../MappingsBuilder";
import {JavaClass} from "../../crash/model/Mappable";
import {extractFromZip} from "../../fudge-commons/methods/Zip";
import {strFromU8} from "fflate";
import {CrashyServer, HttpStatusCode} from "../../server/CrashyServer";
import {httpGet} from "../../fudge-commons/methods/Http";

export {}


enum SRGVersion {
    SRG, TSRG, TSRG2
}

//https://files.minecraftforge.net/de/oceanlabs/mcp/mcp//mcp--srg.zip
export async function getSrgMappings(mcVersion: string, filter: MappingsFilter): Promise<Mappings | undefined> {
    if (isOlderThan1_12_2(mcVersion)) {
        const url = `https://maven.minecraftforge.net/de/oceanlabs/mcp/mcp/${mcVersion}/mcp-${mcVersion}-srg.zip`
        const res = await httpGet({url});
        if (res.status == HttpStatusCode.NotFound) {
            // Srg doesn't support snapshots I think
            return undefined
        }

        const unzipped = await extractFromZip(await res.arrayBuffer())
        const mappings = strFromU8(unzipped[srg1Path]);

        return loadSRG1Mappings(mappings, filter)
    } else {
        // Forge doesn't support CORS starting from 1.12.2 so we need to use the Crashy server as a proxy
        const mappings = await CrashyServer.getTsrg(mcVersion)
        return parseTsrg(mappings,filter)
    }
}

const srg1Path = "joined.srg"


// Example: https://maven.minecraftforge.net/de/oceanlabs/mcp/mcp/1.7.10/mcp-1.7.10-srg.zip
function loadSRG1Mappings(rawMappings: string, filter: MappingsFilter): Mappings {
    const builder = new MappingsBuilder(filter, "SRG1")
    const lines = rawMappings.split("\n");
    for (const line of lines) {
        const lineArray = line.split(/\s+/);
        switch (lineArray[0]) {
            case "CL:":
                builder.addClass(lineArray[1], lineArray[2])
                break;
            case "FD:":
                // Ignore fields
                break;

            //    Example: MD: aky/a (II)Lrf; net/minecraft/block/BlockFarmland/func_149691_a (II)Lnet/minecraft/util/IIcon;
            case "MD:": {
                const [_, unmapped, unmappedDescriptor, mapped, mappedDescriptor] = lineArray;
                const [unmappedClass, unmappedMethod] = unmapped.splitToTwoOnLast("/")!;
                const [mappedClass, mappedMethod] = mapped.splitToTwoOnLast("/")!;

                builder.addMethod(JavaClass.slashSeperated(unmappedClass), unmappedMethod, unmappedDescriptor, mappedMethod)
                break;
            }
            case "PK:":
                break
        }
    }
    return builder.build();
}

function parseTsrg(mappings: string, filter: MappingsFilter) {
    const tsrg2 = mappings.startsWith("tsrg2")
    const lines = mappings.split("\n");
    if (tsrg2) {
        lines.shift()
    }
    const builder = new MappingsBuilder(filter, "Tsrg");
    let currentClass: JavaClass | undefined = undefined;
    for (const line of lines) {
        if (line === "") continue
        const indent = (/^\t*/.exec(line))![0];
        if (indent.length === 0) {
            // class, Example: a net/minecraft/client/renderer/Quaternion
            const [unmappedName, mappedName] = line.trim().split(/\s+/);
            currentClass = builder.addClass(unmappedName, mappedName)
        } else if (indent.length === 1) {
            // Field or method
            const memberParts = line.trim().split(/\s+/);

            const fieldLength = tsrg2? 3 : 2;

            if (memberParts.length === fieldLength) {
                // field, Example: a field_195895_a
            } else {
                if(currentClass == null) {
                    // class is not needed
                    continue
                    // throw new Error("A class was not read before reading the method (line = " + line + "). Tsrg2: " + tsrg2 + ". Part length: " + memberParts.length)
                }
                // Method, Example: a (La;)V func_195890_a
                const [unmappedMethodName, unmappedDescriptor, mappedMethodName] = memberParts;
                builder.addMethod(currentClass!, unmappedMethodName, unmappedDescriptor, mappedMethodName);
            }
        }
    }
    return builder.build();
}

// function parseTsrg1(mappings: string, filter: MappingsFilter): Mappings {
//     return parseTsrg(filter, lines);
// }
// function parseTsrg2(mappings: string, filter: MappingsFilter): Mappings {
//     const lines = mappings.split("\n");
//     // Ignore header
//     lines.shift()
//     return parseTsrg(filter, lines);
// }


// function loadTSRG2Mappings(tsrg2_mappings: string, filter: MappingsFilter): Mappings {
//     const builder = new MappingsBuilder(filter);
//     const lines = tsrg2_mappings.split("\n");
//     // Ignore the header
//     lines.shift();
//     let currentClass: JavaClass | null | undefined = null;
//     for(const line of lines){
//         const indent = line.match(/^\t*/)!![0];
//         if (indent.length == 0) {
//             // zq net/minecraft/src/C_141897_ 141897
//             const [unmappedName,mappedName] = line.trim().split(/\s+/);
//             currentClass = builder.addClass(unmappedName,mappedName)
//         } else if (indent.length == 1) {
//             const fmParts = line.trim().split(/\s+/);
//             if (fmParts.length == 3) {
//                 //field
//             } else {
//                 // method
//                 const [unmappedMethodName,]
//                 current_item = currentClass?.getOrAddMethod(fmParts[0], fmParts[1], MappingTypes.OBF);
//                 current_item?.addMapping(MappingTypes.SRG, fmParts[2]);
//                 if (!this.srgMethods.has(fmParts[3])) this.srgMethods.set(fmParts[3], []);
//                 if (current_item) this.srgMethods.get(fmParts[3])?.push(<MethodData>current_item);
//             }
//         } else if (indent.length == 2) {
//             // Parameter
//         }
//     }
// }
