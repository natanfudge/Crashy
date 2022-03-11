import {MappingsNamespace} from "../MappingsNamespace";
import {getYarnBuilds, getYarnMappings} from "./YarnMappingsProvider";
import {getIntermediaryMappings} from "./IntermediaryMappingsProvider";
import {MappingsFilter} from "../MappingsFilter";
import {Mappings} from "../Mappings";
import {PromiseMemoryCache} from "fudge-commons/lib/collections/PromiseMemoryCache";


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
     * @deprecated Use getBuildsCached
     */
    getBuilds(minecraftVersion: string): Promise<MappingsBuilds>

    /**
     * The build is the full version name of the mappings, e.g. 1.18.1+build.13
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
        return getYarnMappings(version.build,filter)
    }
}


export const IntermediaryToQuiltMappingsProvider: MappingsProvider = {
    fromNamespace: "Intermediary",
    toNamespace: "Quilt",
    async getBuilds(minecraftVersion: string): Promise<string[]> {
        // const builds = await getYarnBuilds(minecraftVersion)
        // return builds.map(build => build.version)
        throw new Error("TODO")
    },
    getMappings(version: MappingsVersion, filter: MappingsFilter): Promise<Mappings> {
        // return getYarnMappings(build)
        throw new Error("TODO")
    }
}

export const OfficialToIntermediaryMappingsProvider: MappingsProvider = {
    fromNamespace: "Official",
    toNamespace: "Intermediary",
    async getBuilds(): Promise<string[]> {
        return [];
    },
    async getMappings(version: MappingsVersion, filter: MappingsFilter): Promise<Mappings> {
        return getIntermediaryMappings(version.minecraftVersion,filter);
    }
}

export const OfficialToSrgMappingsProvider: MappingsProvider = {
    fromNamespace: "Official",
    toNamespace: "Srg",
    async getBuilds(minecraftVersion: string): Promise<string[]> {
        return [];
    },
    async getMappings(version: MappingsVersion, filter: MappingsFilter): Promise<Mappings> {
        throw new Error("TODO")
        // return getSrgMappings(version.minecraftVersion,filter);
    }
}

export const SrgToMcpMappingsProvider: MappingsProvider = {
    fromNamespace: "Srg",
    toNamespace: "Mcp",
    async getBuilds(minecraftVersion: string): Promise<string[]> {
        throw new Error("TODO")
    },
    getMappings(version: MappingsVersion, filter: MappingsFilter): Promise<Mappings> {
        throw new Error("TODO")
    }
}

export const OfficialToMojmapMappingsProvider: MappingsProvider = {
    fromNamespace: "Official",
    toNamespace: "MojMap",
    async getBuilds(minecraftVersion: string): Promise<string[]> {
        throw new Error("TODO")
    },
    getMappings(version: MappingsVersion, filter: MappingsFilter): Promise<Mappings> {
        throw new Error("TODO")
    }
}

export const allMappingsProviders: MappingsProvider[] = [
    IntermediaryToYarnMappingsProvider,
    IntermediaryToQuiltMappingsProvider,
    OfficialToIntermediaryMappingsProvider,
    OfficialToSrgMappingsProvider,
    SrgToMcpMappingsProvider
]

const buildsCache = new PromiseMemoryCache<MappingsBuilds>();

export async function getBuildsCached(provider: MappingsProvider, minecraftVersion: string): Promise<MappingsBuilds> {
    // noinspection JSDeprecatedSymbols
    return buildsCache.get(
        provider.fromNamespace + provider.toNamespace + minecraftVersion,
        () => provider.getBuilds(minecraftVersion)
    ).catch(e => {
        console.error("Could not get mapping builds", e);
        return [];
    })
}
