import {MappingsNamespace} from "../MappingsNamespace";
import {getYarnBuilds, getYarnMappings, yarnSupportsMcVersion} from "./YarnMappingsProvider";
import {getIntermediaryMappings} from "./IntermediaryMappingsProvider";
import {MappingsFilter} from "../MappingsFilter";
import {EmptyMappings, Mappings} from "../Mappings";
import {PromiseMemoryCache} from "../../fudge-commons/collections/PromiseMemoryCache";
import {getSrgMappings} from "./SrgMappingsProvider";
import {getMcpBuilds, getMcpMappings, mcpSupportsMcVersion} from "./McpMappingsProvider";
import {getMojangMappings, mojmapSupportedMinecraftVersion} from "./MojangMappingsProvider";


export type MappingsBuilds = string[];

export interface MappingsVersion {
    minecraftVersion: string
    build: string
}

//TODO: what happens when mappings don't exist for a version?
export interface MappingsProvider {
    fromNamespace: MappingsNamespace
    toNamespace: MappingsNamespace

    /**
     * @deprecated Use getBuildsCached (overriding is ok)
     */
    getBuilds(minecraftVersion: string): Promise<MappingsBuilds>

    supportsMinecraftVersion(version: string): boolean

    /**
     * The build is the full version name of the mappings, e.g. 1.18.1+build.13
     * @deprecated use getMappingsCached (overriding is ok)
     */
    getMappings(version: MappingsVersion, filter: MappingsFilter): Promise<Mappings>
}


export const IntermediaryToYarnMappingsProvider: MappingsProvider = {
    fromNamespace: "Intermediary",
    toNamespace: "Yarn",
    async getBuilds(minecraftVersion: string): Promise<string[]> {
        const builds = await getYarnBuilds(minecraftVersion)
        return builds.map(build => build.version)
    },
    getMappings(version: MappingsVersion, filter: MappingsFilter): Promise<Mappings> {
        return getYarnMappings(version.build, filter)
    },
    supportsMinecraftVersion(version: string): boolean {
        return yarnSupportsMcVersion(version);
    }
}


// export const IntermediaryToQuiltMappingsProvider: MappingsProvider = {
//     fromNamespace: "Intermediary",
//     toNamespace: "Quilt",
//     async getBuilds(minecraftVersion: string): Promise<string[]> {
//         // const builds = await getYarnBuilds(minecraftVersion)
//         // return builds.map(build => build.version)
//         throw new Error("TODO")
//     },
//     getMappings(version: MappingsVersion, filter: MappingsFilter): Promise<Mappings> {
//         // return getYarnMappings(build)
//         throw new Error("TODO")
//     },
//     supportsMinecraftVersion(version: string): boolean {
//         //TODO
//         return false;
//     }
// }

export const OfficialToIntermediaryMappingsProvider: MappingsProvider = {
    fromNamespace: "Official",
    toNamespace: "Intermediary",
    async getBuilds(): Promise<string[]> {
        return [];
    },
    async getMappings(version: MappingsVersion, filter: MappingsFilter): Promise<Mappings> {
        return getIntermediaryMappings(version.minecraftVersion, filter);
    },
    supportsMinecraftVersion(version: string): boolean {
        // Intermediary came around the same time that yarn did
        return yarnSupportsMcVersion(version);
    }
}

const snapshotRegex = RegExp("(rc)|(w)|(pre)")
export const OfficialToSrgMappingsProvider: MappingsProvider = {
    fromNamespace: "Official",
    toNamespace: "Srg",
    async getBuilds(minecraftVersion: string): Promise<string[]> {
        return [];
    },
    async getMappings(version: MappingsVersion, filter: MappingsFilter): Promise<Mappings> {
        return await getSrgMappings(version.minecraftVersion, filter) ?? EmptyMappings;
    },
    supportsMinecraftVersion(version: string): boolean {
        //TODO: test that srg doesn't show in snapshots

        // Avoid snapshots
        return !snapshotRegex.test(version);
    }
}

export const SrgToMcpMappingsProvider: MappingsProvider = {
    fromNamespace: "Srg",
    toNamespace: "Mcp",
    async getBuilds(minecraftVersion: string): Promise<string[]> {
        const builds = await getMcpBuilds(minecraftVersion)
        if (builds == undefined) return []
        return builds.map(num => String(num))
    },
    async getMappings(version: MappingsVersion, filter: MappingsFilter): Promise<Mappings> {
        return await getMcpMappings(version.minecraftVersion, version.build, filter) ?? EmptyMappings
    },
    supportsMinecraftVersion(version: string): boolean {
        //TODO: test that mcp doesn't show in versions older than 1.15

        return mcpSupportsMcVersion(version)
    }
}

export const OfficialToMojmapMappingsProvider: MappingsProvider = {
    fromNamespace: "Official",
    toNamespace: "MojMap",
    async getBuilds(minecraftVersion: string): Promise<string[]> {
        return [];
    },
    getMappings(version: MappingsVersion, filter: MappingsFilter): Promise<Mappings> {
        return getMojangMappings(version.minecraftVersion,filter)
    },
    supportsMinecraftVersion(version: string): boolean {
        //TODO: test that mojmap doesn't show in versions older than 1.14.4
        return mojmapSupportedMinecraftVersion(version);
    }
}

// This is the order it will show up in the UI
 const allMappingsProviders: MappingsProvider[] = [
    IntermediaryToYarnMappingsProvider,
    // IntermediaryToQuiltMappingsProvider,
     SrgToMcpMappingsProvider,
     OfficialToMojmapMappingsProvider,
     OfficialToIntermediaryMappingsProvider,
    OfficialToSrgMappingsProvider,
]

export function getMappingProviders(mcVersion: string): MappingsProvider[] {
    return allMappingsProviders.filter(provider => provider.supportsMinecraftVersion(mcVersion))
}

const buildsCache = new PromiseMemoryCache<MappingsBuilds>();

export async function getBuildsCached(provider: MappingsProvider, minecraftVersion: string): Promise<MappingsBuilds> {
    // noinspection JSDeprecatedSymbols
    return buildsCache.get(
        provider.fromNamespace + provider.toNamespace + minecraftVersion,
        () => provider.getBuilds(minecraftVersion).catch(e => {
            console.error("Could not get mapping builds", e);
            return [];
        })
    )
}
