import {MappingsNamespace} from "./MappingsNamespace";
import {getYarnBuilds, getYarnMappings} from "./YarnMappingsProvider";
import {Mappings} from "./Mappings";

export interface MappingsProvider {
    fromNamespace: MappingsNamespace
    toNamespace: MappingsNamespace
    //TODO: cache calls
    getBuilds(minecraftVersion: string): Promise<string[]>

    /**
     * The build is the full version name of the mappings, e.g. 1.18.1+build.13
     */
    //TODO: cache calls
    getMappings(build: string): Promise<Mappings>
}

export const IntermediaryToYarnMappingsProvider: MappingsProvider = {
    fromNamespace: "Intermediary",
    toNamespace: "Yarn",
    async getBuilds(minecraftVersion: string): Promise<string[]> {
        const builds = await getYarnBuilds(minecraftVersion)
        await new Promise(resolve => setTimeout(resolve, 3000))
        return builds.map(build => build.version)
    },
    getMappings(build: string): Promise<Mappings> {
        return getYarnMappings(build)
    }
}
function delay(t: number, v: any) {
    return new Promise(function(resolve) {
        setTimeout(resolve.bind(null, v), t)
    });
}
// export const IntermediaryToQuiltMappingsProvider: MappingsProvider = {
//     fromNamespace: "Intermediary",
//     toNamespace: "Quilt",
//     async getBuilds(minecraftVersion: string): Promise<string[]> {
//         const builds = await getYarnBuilds(minecraftVersion)
//         return builds.map(build => build.version)
//     },
//     getMappings(build: string): Promise<Mappings> {
//         return getYarnMappings(build)
//     }
// }

export const OfficialToIntermediaryMappingsProvider: MappingsProvider = {
    fromNamespace: "Official",
    toNamespace: "Intermediary",
    async getBuilds(minecraftVersion: string): Promise<string[]> {
        throw new Error("TODO")
    },
    getMappings(build: string): Promise<Mappings> {
        throw new Error("TODO")
    }
}

// export const OfficialToSrgMappingsProvider: MappingsProvider = {
//     fromNamespace: "Official",
//     toNamespace: "Srg",
//     async getBuilds(minecraftVersion: string): Promise<string[]> {
//         throw new Error("TODO")
//     },
//     getMappings(build: string): Promise<Mappings> {
//         throw new Error("TODO")
//     }
// }
//
// export const SrgToMcpMappingsProvider: MappingsProvider = {
//     fromNamespace: "Srg",
//     toNamespace: "Mcp",
//     async getBuilds(minecraftVersion: string): Promise<string[]> {
//         throw new Error("TODO")
//     },
//     getMappings(build: string): Promise<Mappings> {
//         throw new Error("TODO")
//     }
// }
// const mappingsProviders: Record<MappingsNamespaceName,MappingsProvider> = {
//     Intermediary: OfficialToIntermediaryMappingsProvider,
//     Yarn: IntermediaryToYarnMappingsProvider,
//     Quilt: IntermediaryToQuiltMappingsProvider,
//     Official: OfficialToIntermediaryMappingsProvider,
//     Srg: OfficialToSrgMappingsProvider,
//     MCP: SrgToMcpMappingsProvider
// }
export const mappingsProviders: MappingsProvider[] = [
    IntermediaryToYarnMappingsProvider,
    // IntermediaryToQuiltMappingsProvider,
    OfficialToIntermediaryMappingsProvider,
    // OfficialToSrgMappingsProvider,
    // SrgToMcpMappingsProvider
]