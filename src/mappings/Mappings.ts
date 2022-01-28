import {StringMap} from "crash-parser/src/model/CrashReport";
import {MappingsNamespace} from "./MappingsNamespace";
import {
    IntermediaryToYarnMappingsProvider,
    MappingsBuilds,
    MappingsProvider,
    MappingsVersion
} from "./MappingsProvider";
import {PromiseMemoryCache} from "../utils/PromiseMemoryCache";
import {useEffect, useState} from "react";
import {BiMap} from "../utils/BiMap";

type SimpleMethodName = string
type DescriptoredMethodName = string


export interface Mappings {
    /**
     * Must use dot.notation e.g. net.minecraft.gui.GuiThing
     */
    classes: BiMap<string, string>
    /**
     * Stack trace lines include method names without the descriptor - so we need a map from these "simple" method names
     * to the desired namespace
     *
     * Descriptors use slashes/in/package/names
     */
    noDescriptorToDescriptorMethods: BiMap<SimpleMethodName, DescriptoredMethodName>
    /**
     * In cases where we go through multiple namespaces to get to the desired namespace, we need to not lose information along the way.
     * So in that case if you go through namespaces a -> b -> c -> d it will be:
     * - Stack trace includes SimpleMethodNames from namespace a
     * - first Mappings maps those names to DescriptoredMethodNames from namespace b (using noDescriptorToDescriptorMethods)
     * - second Mappings maps those names to DescriptoredMethodNames from namespace c (using descriptorToDescriptorMethods)
     * - third Mappings maps those names to DescriptoredMethodNames from namespace d (using descriptorToDescriptorMethods)
     *
     * Using descriptors as much as possible ensures the mappings are as accurate as possible.
     *
     * Descriptors use slashes/in/package/names
     */
    descriptorToDescriptorMethods: BiMap<DescriptoredMethodName, DescriptoredMethodName>
    // fields: StringMap
}

export const EmptyMappings: Mappings = {
    classes: BiMap.Empty,
    noDescriptorToDescriptorMethods: BiMap.Empty,
    descriptorToDescriptorMethods: BiMap.Empty
}

export function remap(name: string, map: StringMap): string {
    const mapped = map[name];
    return mapped !== undefined ? mapped : name;
}


async function buildsOfNoCache(namespace: MappingsNamespace, minecraftVersion: string): Promise<MappingsBuilds> {
    switch (namespace) {
        case "Intermediary":
        case "Official":
            return [];
        case "Yarn":
            return IntermediaryToYarnMappingsProvider.getBuilds(minecraftVersion)
        default:
            throw new Error("TODO")
    }
}

const buildsCache = new PromiseMemoryCache<MappingsBuilds>();

export async function buildsOf(namespace: MappingsNamespace, minecraftVersion: string): Promise<MappingsBuilds> {
    return buildsCache.get(
        namespace + minecraftVersion,
        () => buildsOfNoCache(namespace, minecraftVersion)
    ).catch(e => {
        console.error("Could not get mapping builds", e);
        return [];
    })
}


const mappingsCache = new PromiseMemoryCache<Mappings>()

export function useAnyMappingsLoading(): boolean {
    const [loading, setLoading] = useState(false);
    const promiseChangeCallback = () => setLoading(mappingsCache.anyPromisesUnfulfilled());
    useEffect(() => {
        mappingsCache.onOngoingPromisesChange(promiseChangeCallback)
        return () => mappingsCache.unsubscribeToOngoingPromisesChange(promiseChangeCallback)
    })
    return loading;
}

export async function getMappingsCached(mappingsProvider: MappingsProvider, version: MappingsVersion): Promise<Mappings> {
    return mappingsCache.get(
        mappingsProvider.fromNamespace + mappingsProvider.toNamespace + version.build + version.minecraftVersion,
        () => mappingsProvider.getMappings(version)
    ).catch(e => {
        console.error("Could not get mappings", e);
        return EmptyMappings;
    });
}
