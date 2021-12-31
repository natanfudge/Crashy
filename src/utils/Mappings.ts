export enum MappingsType {
    Yarn, Official, MojMap, Intermediary, Srg, Mcp, Quilt
}

export function mappingsName(type: MappingsType): string {
    switch (type) {
        case MappingsType.Yarn:
            return "Yarn"
        case MappingsType.Official:
            return "Obfuscated"
        case MappingsType.MojMap:
            return "Mojang"
        case MappingsType.Intermediary:
            return "Intermediary"
        case MappingsType.Srg:
            return "SRG"
        case MappingsType.Mcp:
            return "MCP"
        case MappingsType.Quilt:
            return "Quilt"
    }
}

export const allMappingTypes = [MappingsType.Yarn, MappingsType.Official, MappingsType.MojMap, MappingsType.Intermediary,
    MappingsType.Srg, MappingsType.Mcp, MappingsType.Quilt];


export interface MappingsState {
    type: MappingsType,
    version: string
}

export function withType(state: MappingsState, type: MappingsType): MappingsState {
    return {type: type, version: state.version}
}

export function withVersion(state: MappingsState, version: string): MappingsState {
    return {type: state.type, version: version}
}

const versionsData: Record<MappingsType, string[]> = {
    [MappingsType.Yarn] : ["1.15", "1.16", "1.17", "This super long thingy", "1.18.1+build.14"],
    [MappingsType.Official] : ["1.14"],
    [MappingsType.MojMap] : ["1.14"],
    [MappingsType.Intermediary] : ["1.14"],
    [MappingsType.Srg] : ["1.14"],
    [MappingsType.Mcp] : ["1.14"],
    [MappingsType.Quilt] : ["1.14"]
}

export function versionsOf(mappingsType: MappingsType): string[] {
    return versionsData[mappingsType];
}