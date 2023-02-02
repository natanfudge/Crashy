import {MappingsNamespace} from "../MappingsNamespace";
import {getYarnBuilds, getYarnMappings, yarnSupportsMcVersion} from "./YarnMappingsProvider";
import {getIntermediaryMappings} from "./IntermediaryMappingsProvider";
import {MappingsFilter} from "../MappingsFilter";
import {EmptyMappings, Mappings} from "../Mappings";
import {PromiseMemoryCache} from "../../fudge-commons/collections/PromiseMemoryCache";
import {getSrgMappings} from "./SrgMappingsProvider";
import {getMcpBuilds, getMcpMappings, mcpSupportsMcVersion} from "./McpMappingsProvider";
import {getMojangMappings, mojmapSupportedMinecraftVersion} from "./MojangMappingsProvider";
import {
    ForgeRuntimeToOfficialSrgMappings,
    forgeUsesPureSrgForMinecraftVersion,
    OfficialSrgToSrgMappings
} from "./ForgeRuntimeMappingsProvider";
import {getMappingsCached} from "../MappingsApi";


export type MappingsBuilds = string[];

export interface MappingsVersion {
    minecraftVersion: string
    build: string
}

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

    /**
     * If false and supportsMinecraftVersion is true, it will be used as a step for other mappings, but
     * the user won't be able to select it as a final mapping
     */

    isVisible(): boolean
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
    },
    isVisible(): boolean {
        return true
    }
}


// export const IntermediaryToQuiltMappingsProvider: MappingsProvider = {
//     fromNamespace: "Intermediary",
//     toNamespace: "Quilt",
//     async getBuilds(minecraftVersion: string): Promise<string[]> {
//         // const builds = await getYarnBuilds(minecraftVersion)
//         // return builds.map(build => build.version)
//     },
//     getMappings(version: MappingsVersion, filter: MappingsFilter): Promise<Mappings> {
//         // return getYarnMappings(build)
//     },
//     supportsMinecraftVersion(version: string): boolean {
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
    },
    isVisible(): boolean {
        return true
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

        // Avoid snapshots
        return !snapshotRegex.test(version);
    },
    isVisible(): boolean {
        return true
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
        return mcpSupportsMcVersion(version)
    },
    isVisible(): boolean {
        return true
    }
}
//
export const ForgeRuntimeToOfficialSrgMappingsProvider: MappingsProvider = {
    fromNamespace: "ForgeRuntime",
    toNamespace: "OfficialSrg",
    supportsMinecraftVersion(version: string): boolean {
        return !forgeUsesPureSrgForMinecraftVersion(version);
    },
    async getMappings(version: MappingsVersion, filter: MappingsFilter): Promise<Mappings> {
        // Important note: we don't cache the value because if another provider will want the mappings it will have a different filter
        const mojmap = await OfficialToMojmapMappingsProvider.getMappings(version, filter)
        return new ForgeRuntimeToOfficialSrgMappings(mojmap, true, "ForgeRuntime -> OfficialSrg");
    },
    async getBuilds(minecraftVersion: string): Promise<MappingsBuilds> {
        return []
    },
    isVisible(): boolean {
        return false
    }
}

export const OfficialSrgToSrgMappingsProvider: MappingsProvider = {
    fromNamespace: "OfficialSrg",
    toNamespace: "Srg",
    supportsMinecraftVersion(version: string): boolean {
        return !forgeUsesPureSrgForMinecraftVersion(version);
    },
    async getMappings(version: MappingsVersion, filter: MappingsFilter): Promise<Mappings> {
        // Important note: we don't cache the value because if another provider will want the mappings it will have a different filter
        // Possible optimization: somehow reuse the Official -> Srg when going from ForgeRuntime to other things (we use it twice)
        const srgMappings = await OfficialToSrgMappingsProvider.getMappings(version,filter)
        return new OfficialSrgToSrgMappings(srgMappings);
    },
    async getBuilds(minecraftVersion: string): Promise<MappingsBuilds> {
        return []
    },
    isVisible(): boolean {
        return false
    }
}

export const OfficialToMojmapMappingsProvider: MappingsProvider = {
    fromNamespace: "Official",
    toNamespace: "MojMap",
    async getBuilds(minecraftVersion: string): Promise<string[]> {
        return [];
    },
    getMappings(version: MappingsVersion, filter: MappingsFilter): Promise<Mappings> {
        return getMojangMappings(version.minecraftVersion, filter)
    },
    supportsMinecraftVersion(version: string): boolean {
        return mojmapSupportedMinecraftVersion(version);
    },
    isVisible(): boolean {
        return true
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
    OfficialSrgToSrgMappingsProvider,
    ForgeRuntimeToOfficialSrgMappingsProvider
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
