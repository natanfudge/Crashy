import {MappingsNamespace} from "./MappingsNamespace";
import {getYarnBuilds} from "./YarnMappingsProvider";
import {EmptyMappings, Mappings} from "./Mappings";
import {getYarnMappings2} from "./providers/YarnMappingsProvider2";
import {getIntermediaryMappings} from "./providers/IntermediaryMappingsProvider";

export type MappingsBuilds = string[];

export interface MappingsVersion {
    minecraftVersion: string
    build: string
}

export interface MappingsProvider {
    fromNamespace: MappingsNamespace
    toNamespace: MappingsNamespace

    getBuilds(minecraftVersion: string): Promise<MappingsBuilds>

    /**
     * The build is the full version name of the mappings, e.g. 1.18.1+build.13
     */
    getMappings(version: MappingsVersion): Promise<Mappings>
}


export const IntermediaryToYarnMappingsProvider: MappingsProvider = {
    fromNamespace: "Intermediary",
    toNamespace: "Yarn",
    async getBuilds(minecraftVersion: string): Promise<string[]> {
        const builds = await getYarnBuilds(minecraftVersion)
        // await new Promise(resolve => setTimeout(resolve, 3000))
        return builds.map(build => build.version)
    },
    getMappings(version: MappingsVersion): Promise<Mappings> {
        return getYarnMappings2(version.build)
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
    getMappings(version: MappingsVersion): Promise<Mappings> {
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
    async getMappings(version: MappingsVersion): Promise<Mappings> {
        return getIntermediaryMappings(version.minecraftVersion);
    }
}

export const OfficialToSrgMappingsProvider: MappingsProvider = {
    fromNamespace: "Official",
    toNamespace: "Srg",
    async getBuilds(minecraftVersion: string): Promise<string[]> {
        throw new Error("TODO")
    },
    async getMappings(version: MappingsVersion): Promise<Mappings> {
        return EmptyMappings;
        // throw new Error("TODO")
    }
}

export const SrgToMcpMappingsProvider: MappingsProvider = {
    fromNamespace: "Srg",
    toNamespace: "Mcp",
    async getBuilds(minecraftVersion: string): Promise<string[]> {
        throw new Error("TODO")
    },
    getMappings(version: MappingsVersion): Promise<Mappings> {
        throw new Error("TODO")
    }
}

export const OfficialToMojmapMappingsProvider: MappingsProvider = {
    fromNamespace: "Official",
    toNamespace: "MojMap",
    async getBuilds(minecraftVersion: string): Promise<string[]> {
        throw new Error("TODO")
    },
    getMappings(version: MappingsVersion): Promise<Mappings> {
        throw new Error("TODO")
    }
}
const mappingsProvidersForEveryNamespace: Record<MappingsNamespace,MappingsProvider> = {
    Intermediary: OfficialToIntermediaryMappingsProvider,
    Yarn: IntermediaryToYarnMappingsProvider,
    Quilt: IntermediaryToQuiltMappingsProvider,
    Official: OfficialToIntermediaryMappingsProvider,
    Srg: OfficialToSrgMappingsProvider,
    Mcp: SrgToMcpMappingsProvider,
    MojMap: OfficialToMojmapMappingsProvider
}
export const allMappingsProviders: MappingsProvider[] = [
    IntermediaryToYarnMappingsProvider,
    IntermediaryToQuiltMappingsProvider,
    OfficialToIntermediaryMappingsProvider,
    OfficialToSrgMappingsProvider,
    SrgToMcpMappingsProvider
]

