import {StringMap} from "crash-parser/src/model/CrashReport";
import {MappingsNamespace} from "./MappingsNamespace";
import {getYarnBuilds, getYarnMappings} from "./YarnMappingsProvider";



// const

export interface Mappings {
    classes: StringMap
    methods: StringMap
    fields: StringMap
}


//     [MappingsNamespace.Yarn]: YarnMappingsProvider
//     [MappingsNamespace.MojMap]
// }

const versionsData: Record<MappingsNamespace, string[]> = {
    [MappingsNamespace.Yarn]: ["1.15", "1.16", "1.17", "This super long thingy", "1.18.1+build.14"],
    [MappingsNamespace.Official]: ["1.14"],
    [MappingsNamespace.MojMap]: ["1.14"],
    [MappingsNamespace.Intermediary]: ["1.14"],
    [MappingsNamespace.Srg]: ["1.14"],
    [MappingsNamespace.Mcp]: ["1.14"],
    [MappingsNamespace.Quilt]: ["1.14"]
}

export async function versionsOf(mappingsType: MappingsNamespace): Promise<string[]> {
    switch (mappingsType) {

    }
    return [];
    // return versionsData[mappingsType];
}

//TODO: Given a trace mapped with namespace X, and given a user preference of namespace Y, we must find a pathway from X to Y.
// The best solution may be to give the computer a list of all possible conversions, and then use an algorithm to find the shortest series of conversions that leads from X to Y.