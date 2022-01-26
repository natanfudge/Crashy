import {StringMap} from "crash-parser/src/model/CrashReport";
import {MappingsNamespace} from "./MappingsNamespace";
import {IntermediaryToYarnMappingsProvider, MappingsBuilds, MappingsProvider} from "./MappingsProvider";
import {PromiseMemoryCache} from "../utils/PromiseMemoryCache";
import {useEffect, useState} from "react";


export interface Mappings {
    // Must use dot.notation e.g. net.minecraft.gui.GuiThing
    classes: StringMap
    methods: StringMap
    // fields: StringMap
}

export const EmptyMappings: Mappings = {
    classes: {},
    methods: {},
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

export async function getMappingsCached(mappingsProvider: MappingsProvider, build: string): Promise<Mappings> {
    return mappingsCache.get(
        mappingsProvider.fromNamespace + mappingsProvider.toNamespace + build,
        () => mappingsProvider.getMappings(build)
    );
}
