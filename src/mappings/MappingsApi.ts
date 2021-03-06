import {MappingsNamespace} from "./MappingsNamespace";
import {
    getBuildsCached,
    IntermediaryToYarnMappingsProvider,
    MappingsBuilds,
    MappingsProvider,
    MappingsVersion
} from "./providers/MappingsProvider";
import {PromiseMemoryCache} from "../utils/PromiseMemoryCache";
import {useEffect, useState} from "react";
import {EmptyMappings, Mappings} from "crash-parser/src/util/common/Mappings";
import {MappingsFilter} from "crash-parser/src/util/common/MappingsFilter";


export async function buildsOf(namespace: MappingsNamespace, minecraftVersion: string): Promise<MappingsBuilds> {
    switch (namespace) {
        case "Intermediary":
        case "Official":
            return [];
        case "Yarn":
            return getBuildsCached(IntermediaryToYarnMappingsProvider, minecraftVersion)
        default:
            throw new Error("TODO")
    }
}

export async function getMappingsCached(mappingsProvider: MappingsProvider, version: MappingsVersion, filter: MappingsFilter): Promise<Mappings> {
    return mappingsCache.get(
        mappingsProvider.fromNamespace + mappingsProvider.toNamespace + version.build + version.minecraftVersion,
        () => mappingsProvider.getMappings(version, filter)
    ).catch(e => {
        console.error("Could not get mappings", e);
        return EmptyMappings;
    });
}

export function useAnyMappingsLoading(): boolean {
    const [loading, setLoading] = useState(false);
    const promiseChangeCallback = () => setLoading(mappingsCache.anyPromisesUnfulfilled());
    useEffect(() => {
        mappingsCache.onOngoingPromisesChange(promiseChangeCallback)
        return () => mappingsCache.unsubscribeToOngoingPromisesChange(promiseChangeCallback)
    })
    return loading;
}


const mappingsCache = new PromiseMemoryCache<Mappings>()

