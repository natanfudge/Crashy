import {MappingsNamespace} from "./MappingsNamespace";
import {
    getBuildsCached,
    getMappingProviders,
    MappingsBuilds,
    MappingsProvider,
    MappingsVersion
} from "./providers/MappingsProvider";
import {MappingsFilter} from "./MappingsFilter";
import {EmptyMappings, Mappings} from "./Mappings";
import {useEffect, useState} from "react";
import {PromiseMemoryCache} from "fudge-lib/dist/collections/PromiseMemoryCache";


export async function buildsOf(namespace: MappingsNamespace, minecraftVersion: string): Promise<MappingsBuilds> {
    if (namespace === "Official") return [];
    const provider = getMappingProviders(minecraftVersion).find(provider => provider.toNamespace == namespace);
    if (provider == undefined) throw new Error("Can't find builds for unrecognized mapping namespace: " + namespace)
    return getBuildsCached(provider, minecraftVersion)
}

export async function getMappingsCached(mappingsProvider: MappingsProvider, version: MappingsVersion, filter: MappingsFilter): Promise<Mappings> {
    return mappingsCache.get(
        mappingsProvider.fromNamespace + mappingsProvider.toNamespace + version.build + version.minecraftVersion,
        () => mappingsProvider.getMappings(version, filter).catch(e => {
                console.error("Could not get mappings", e);
                return EmptyMappings;
            }
        ));
}



const mappingsCache = new PromiseMemoryCache<Mappings>()

