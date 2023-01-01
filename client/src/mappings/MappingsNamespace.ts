// export enum MappingsNamespace {
//     Yarn, Official, MojMap, Intermediary, Srg, Mcp, Quilt
// }
import {Mappings} from "./Mappings";
import { getMappingProviders} from "./providers/MappingsProvider";

export type MappingsNamespace = "Yarn" | "Official" | "MojMap" | "Intermediary" | "Srg" | "Mcp" | "Quilt";

export function mappingsName(type: MappingsNamespace): string {
    switch (type) {
        case "Yarn":
            return "Yarn"
        case "Official":
            return "Obfuscated"
        case "MojMap":
            return "Mojang"
        case "Intermediary":
            return "Intermediary"
        case "Srg":
            return "SRG"
        case "Mcp":
            return "MCP"
        case "Quilt":
            return "Quilt"
    }
}

export function getMappingNamespaces(mcVersion: string): MappingsNamespace[] {
    const namespaces =  getMappingProviders(mcVersion).map(provider => provider.toNamespace);
    // Official should always be available
    namespaces.push("Official")
    return namespaces
}

// export const allMappingNamespaces: MappingsNamespace[] = [
//     "Yarn",
//     "MojMap",
//     "Mcp",
//     "Quilt",
//     "Intermediary",
//     "Srg",
//     "Official"
// ];

