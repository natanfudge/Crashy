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
    "MojMap",
    "Mcp",
    "Quilt",
    "Intermediary",
    "Srg",
    "Official"
];

export function namespaceHasMultipleBuildsPerMcVersion(namespace: MappingsNamespace): boolean {
    switch (namespace) {
        case "Yarn":
        case "Mcp":
        case "Quilt":
            return true;
        case "Official":
        case "MojMap":
        case "Intermediary":
        case "Srg":
           return false;
    }
}
