import {StringMap} from "crash-parser/src/model/CrashReport";
import {MappingsNamespace} from "./MappingsNamespace";
import {
    IntermediaryToYarnMappingsProvider,
    MappingsBuilds,
    MappingsProvider,
    OfficialToIntermediaryMappingsProvider
} from "./MappingsProvider";
import {MemoryCache, PromiseMemoryCache} from "../utils/PromiseMemoryCache";
import {JavaClass, JavaMethod, Loader, RichStackTraceElement} from "crash-parser/src/model/RichCrashReport";
import {usePromise} from "../ui/utils/PromiseBuilder";
import {flipRecord} from "../utils/Javascript";
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

export interface MappingContext {
    desiredNamespace: MappingsNamespace;
    // undefined if builds are still loading
    desiredBuild: string | undefined;
    //TODO: check if we need this when done
    minecraftVersion: string;
    isDeobfuscated: boolean;
    loader: Loader;
}

export interface MappingMethod {
    mapMethod: (unmapped: string) => string
    mapClass: (unmapped: string) => string
}

export const IdentityMapping: MappingMethod = {
    mapClass: unmapped => unmapped,
    mapMethod: unmapped => unmapped
}


type Mappable = JavaClass | JavaMethod

function isJavaMethod(mappable: Mappable): mappable is JavaMethod {
    return "class" in mappable;
}

export function useMappingFor(element: RichStackTraceElement, context: MappingContext): MappingMethod {
    return usePromise(
        getMappingFor(element, context), [context.desiredBuild, context.desiredNamespace]
    ) ?? IdentityMapping
}

export function useMappingForName(name: Mappable, context: MappingContext): MappingMethod {
    return usePromise(
        getMappingForName(name, context), [context.desiredBuild, context.desiredNamespace]
    ) ?? IdentityMapping; // When mappings have not loaded yet keep name as-is
}

//TODO: implement mapping loading detection via querying the PromiseMemoryCache object, and remove isLoading in Mappings.
async function getMappingFor(element: RichStackTraceElement, context: MappingContext): Promise<MappingMethod> {
    if (typeof element === "number") {
        return IdentityMapping
    } else {
        return getMappingForName(element.method, context);
    }
}

async function getMappingForName(name: Mappable, context: MappingContext): Promise<MappingMethod> {
    if (context.desiredBuild === undefined) return IdentityMapping;
    if (isIntermediaryName(name)) {
        switch (context.desiredNamespace) {
            case "Intermediary":
                // If it's intermediary => intermediary, keep name as is
                return IdentityMapping;
            case "Yarn":
                return mappingViaProvider(IntermediaryToYarnMappingsProvider, context.desiredBuild, {reverse: false})
            case "Official":
                return mappingViaProvider(OfficialToIntermediaryMappingsProvider, context.desiredBuild, {reverse: true})
            default:
                throw new Error("TODO")
        }
    } else {
        //TODO
        return IdentityMapping;
    }
}

const reversedClassMappingsCache = new MemoryCache<Record<string, string>>();
const reversedMethodMappingsCache = new MemoryCache<Record<string, string>>();

async function mappingViaProvider(
    provider: MappingsProvider, build: string, options: { reverse: boolean }
): Promise<MappingMethod> {
    const mappings = await getMappingsCached(provider, build);
    const key = provider.fromNamespace + provider.toNamespace + build;

    const usedClassMappings = options.reverse ? reversedClassMappingsCache.get(key, () => flipRecord(mappings.classes))
        : mappings.classes
    const usedMethodMappings = options.reverse ? reversedMethodMappingsCache.get(key, () => flipRecord(mappings.methods))
        : mappings.methods
    return {
        mapMethod: unmapped => usedMethodMappings[unmapped] ?? unmapped,
        mapClass: unmapped => usedClassMappings[unmapped] ?? unmapped
    };
}

async function mappingViaProviderChain(
    firstMapProvider: { provider: MappingsProvider, reverse: boolean },
    secondMapProvider: { provider: MappingsProvider, reverse: boolean },
    build: string
): Promise<MappingMethod> {
    const [firstMap, secondMap] = await Promise.all([
        mappingViaProvider(firstMapProvider.provider, build, {reverse: firstMapProvider.reverse}),
        mappingViaProvider(secondMapProvider.provider, build, {reverse: secondMapProvider.reverse}),
    ]);

    return {
        mapClass: unmapped => secondMap.mapClass(firstMap.mapClass(unmapped)),
        mapMethod: unmapped => secondMap.mapMethod(firstMap.mapMethod(unmapped))
    };
}

function isIntermediaryName(mappable: Mappable): boolean {
    if (isJavaMethod(mappable)) {
        return isIntermediaryMethodName(mappable)
    } else {
        return isIntermediaryClassName(mappable)
    }
}

function isIntermediaryClassName(javaClass: JavaClass): boolean {
    return javaClass.simpleName.startsWith("class_")
        && javaClass.packageName === "net.minecraft"
}

function isIntermediaryMethodName(javaMethod: JavaMethod): boolean {
    return isIntermediaryClassName(javaMethod.class)
        || javaMethod.name.startsWith("method_")
}


export async function buildsOfNoCache(namespace: MappingsNamespace, minecraftVersion: string): Promise<MappingsBuilds> {
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
    );
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
