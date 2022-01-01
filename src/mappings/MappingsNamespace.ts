export enum MappingsNamespace {
    Yarn, Official, MojMap, Intermediary, Srg, Mcp, Quilt
}

export function mappingsName(type: MappingsNamespace): string {
    switch (type) {
        case MappingsNamespace.Yarn:
            return "Yarn"
        case MappingsNamespace.Official:
            return "Obfuscated"
        case MappingsNamespace.MojMap:
            return "Mojang"
        case MappingsNamespace.Intermediary:
            return "Intermediary"
        case MappingsNamespace.Srg:
            return "SRG"
        case MappingsNamespace.Mcp:
            return "MCP"
        case MappingsNamespace.Quilt:
            return "Quilt"
    }
}

export const allMappingTypes = [MappingsNamespace.Yarn, MappingsNamespace.Official, MappingsNamespace.MojMap, MappingsNamespace.Intermediary,
    MappingsNamespace.Srg, MappingsNamespace.Mcp, MappingsNamespace.Quilt];