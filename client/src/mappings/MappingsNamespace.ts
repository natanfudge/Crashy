// export enum MappingsNamespace {
//     Yarn, Official, MojMap, Intermediary, Srg, Mcp, Quilt
// }
import { getMappingProviders} from "./providers/MappingsProvider";

// "ForgeRuntime": The way forge maps Minecraft in prod. It uses SRG names for methods and MCP names for classes.
// "OfficialSrg": Official classes with Srg methods. Useful as an intermediary format for converting from ForgeRuntime to something useful.
export type MappingsNamespace = "Yarn" | "Official" | "MojMap" | "Intermediary" | "Srg" | "Mcp" | "Quilt" | "ForgeRuntime" | "OfficialSrg";

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
        case "ForgeRuntime":
            return "MCP.SRG"
        case "OfficialSrg":
            return "Official.SRG"
    }
}

export function getVisibleMappingNamespaces(mcVersion: string): MappingsNamespace[] {
    const namespaces =  getMappingProviders(mcVersion)
        .filter(provider => provider.isVisible())
        .map(provider => provider.toNamespace);
    // Official should always be available (namespaces may not contain it in case no providers are available)
    namespaces.push("Official")
    return namespaces
}
