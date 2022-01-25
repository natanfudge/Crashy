import {MappingsNamespace} from "./MappingsNamespace";
import {getYarnBuilds, getYarnMappings} from "./YarnMappingsProvider";
import {Mappings} from "./Mappings";
import {PromiseMemoryCache} from "../utils/PromiseMemoryCache";

export type MappingsBuilds = string[];

export interface MappingsProvider {
    fromNamespace: MappingsNamespace
    toNamespace: MappingsNamespace

    getBuilds(minecraftVersion: string): Promise<MappingsBuilds>

    /**
     * The build is the full version name of the mappings, e.g. 1.18.1+build.13
     */
    getMappings(build: string): Promise<Mappings>
}


export const IntermediaryToYarnMappingsProvider: MappingsProvider = {
    fromNamespace: "Intermediary",
    toNamespace: "Yarn",
    async getBuilds(minecraftVersion: string): Promise<string[]> {
        const builds = await getYarnBuilds(minecraftVersion)
        // await new Promise(resolve => setTimeout(resolve, 3000))
        return builds.map(build => build.version)
    },
    getMappings(build: string): Promise<Mappings> {
        return getYarnMappings(build)
    }
}

// export function reverseMappingsProvider(provider: MappingsProvider): MappingsProvider  {
//     return {
//         fromNamespace: provider.toNamespace,
//         toNamespace: provider.fromNamespace,
//         async getMappings(build: string): Promise<Mappings> {
//
//             return {
//                 classes: name => {
//                     const key = provider.g
//                 },
//                 methods: name => name
//             }
//         },
//         getBuilds(minecraftVersion: string): Promise<MappingsBuilds> {
//         }
//     }
// }


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
     getBuilds(minecraftVersion: string): Promise<string[]> {
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
export const allMappingsProviders: MappingsProvider[] = [
    IntermediaryToYarnMappingsProvider,
    // IntermediaryToQuiltMappingsProvider,
    OfficialToIntermediaryMappingsProvider,
    // OfficialToSrgMappingsProvider,
    // SrgToMcpMappingsProvider
]
