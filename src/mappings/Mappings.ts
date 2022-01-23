import {StringMap} from "crash-parser/src/model/CrashReport";
import {MappingsNamespace} from "./MappingsNamespace";
import {getYarnBuilds, getYarnMappings} from "./YarnMappingsProvider";
import {
    IntermediaryToYarnMappingsProvider, MappingsBuilds,
    MappingsProvider,
    OfficialToIntermediaryMappingsProvider
} from "./MappingsProvider";
import {MemoryCache} from "../utils/MemoryCache";



// const

export interface Mappings {
    // Must use dot.notation e.g. net.minecraft.gui.GuiThing
    classes: StringMap
    methods: StringMap
    // fields: StringMap
}

export const EmptyMappings : Mappings = {
    classes: {},
    methods: {}
}

export function remap(name: string, map: StringMap): string {
    const mapped = map[name];
    return mapped !== undefined ? mapped: name;
}


//     [MappingsNamespace.Yarn]: YarnMappingsProvider
//     [MappingsNamespace.MojMap]
// }

// const versionsData: Record<MappingsNamespaceName, string[]> = {
//     [MappingsNamespaceName.Yarn]: ["1.15", "1.16", "1.17", "This super long thingy", "1.18.1+build.14"],
//     [MappingsNamespaceName.Official]: ["1.14"],
//     [MappingsNamespaceName.MojMap]: ["1.14"],
//     [MappingsNamespaceName.Intermediary]: ["1.14"],
//     [MappingsNamespaceName.Srg]: ["1.14"],
//     [MappingsNamespaceName.Mcp]: ["1.14"],
//     [MappingsNamespaceName.Quilt]: ["1.14"]
// }


export async function buildsOfNoCache(namespace: MappingsNamespace, minecraftVersion: string): Promise<MappingsBuilds> {
    switch (namespace) {
        case "Intermediary":
            return [];
        case "Yarn":
            return IntermediaryToYarnMappingsProvider.getBuilds(minecraftVersion)
        case "Official":
            return [];
    }
    // return [];
}

const buildsCache = new MemoryCache<MappingsBuilds>();
export async function buildsOf(namespace: MappingsNamespace, minecraftVersion: string): Promise<MappingsBuilds> {
    return buildsCache.get(
        namespace + minecraftVersion,
        () => buildsOfNoCache(namespace,minecraftVersion)
    );
}



//
// export async function getBuildsCached(mappingsProvider: MappingsProvider, minecraftVersion: string): Promise<MappingsBuilds> {
//     return buildsCache.get(
//         mappingsProvider.fromNamespace + mappingsProvider.toNamespace + minecraftVersion,
//         () => mappingsProvider.getBuilds(minecraftVersion)
//     );
// }

const mappingsCache = new MemoryCache<Mappings>()

export async function getMappingsCached(mappingsProvider: MappingsProvider, build: string): Promise<Mappings> {
    return mappingsCache.get(
        mappingsProvider.fromNamespace + mappingsProvider.toNamespace + build,
        () => mappingsProvider.getMappings(build)
    );
}
