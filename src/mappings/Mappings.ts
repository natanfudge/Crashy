import {StringMap} from "crash-parser/src/model/CrashReport";
import {MappingsNamespace} from "./MappingsNamespace";
import {getYarnBuilds, getYarnMappings} from "./YarnMappingsProvider";
import {IntermediaryToYarnMappingsProvider, OfficialToIntermediaryMappingsProvider} from "./MappingsProvider";



// const

export interface Mappings {
    classes: StringMap
    methods: StringMap
    fields: StringMap
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

export async function buildsOf(mappingsType: MappingsNamespace, minecraftVersion: string): Promise<string[]> {
    switch (mappingsType) {
        case "Intermediary":
            return [];
        case "Yarn":
            return IntermediaryToYarnMappingsProvider.getBuilds(minecraftVersion)
        case "Official":
            return [];
    }
    return [];
}

//TODO: Given a trace mapped with namespace X, and given a user preference of namespace Y, we must find a pathway from X to Y.
// The best solution may be to give the computer a list of all possible conversions, and then use an algorithm to find the shortest series of conversions that leads from X to Y.