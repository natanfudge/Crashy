// export enum MappingsNamespace {
//     Yarn, Official, MojMap, Intermediary, Srg, Mcp, Quilt
// }
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

export const allMappingNamespaces: MappingsNamespace[] = [
    "Yarn",
    "Official",
    "MojMap",
    "Intermediary",
    "Srg",
    "Mcp",
    "Quilt"
];
