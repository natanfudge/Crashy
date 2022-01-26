import {JavaClass, JavaMethod, Loader, LoaderType, RichStackTraceElement} from "crash-parser/src/model/RichCrashReport";
import {usePromise} from "../ui/utils/PromiseBuilder";
import {MappingsProvider, MappingsVersion} from "./MappingsProvider";
import {getMappingsCached} from "./Mappings";
import {MemoryCache} from "../utils/PromiseMemoryCache";
import {flipRecord} from "../utils/Javascript";
import {MappingsNamespace} from "./MappingsNamespace";
import {detectMappingNamespace} from "./MappingDetector";
import {resolveMappingsChain} from "./MappingsResolver";

export interface MappingMethod {
    mapMethod: (unmapped: string) => string
    mapClass: (unmapped: string) => string
}

export const IdentityMapping: MappingMethod = {
    mapClass: unmapped => unmapped,
    mapMethod: unmapped => unmapped
}

export type Mappable = JavaClass | JavaMethod


export interface MappingContext {
    desiredNamespace: MappingsNamespace;
    // undefined if builds are still loading
    desiredBuild: string | undefined;
    minecraftVersion: string
    isDeobfuscated: boolean;
    loader: LoaderType;
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

async function getMappingFor(element: RichStackTraceElement, context: MappingContext): Promise<MappingMethod> {
    if (typeof element === "number") {
        return IdentityMapping
    } else {
        return getMappingForName(element.method, context);
    }
}

export async function getMappingForName(name: Mappable, context: MappingContext): Promise<MappingMethod> {
    if (context.desiredBuild === undefined) return IdentityMapping;
    const originalNamespace = detectMappingNamespace(name, context);
    const mappingChain = resolveMappingsChain(originalNamespace, context.desiredNamespace);
    if (mappingChain === undefined) {
        throw new Error(`Cannot find path from namespace '${originalNamespace}' to namespace '${context.desiredNamespace}'`)
    }
    const withDirection = resolveDirectionOfMappings(originalNamespace, mappingChain);
    return mappingViaProviderChain(withDirection, {build: context.desiredBuild, minecraftVersion: context.minecraftVersion});
}

type DirectionedProvider = { provider: MappingsProvider, reverse: boolean }
// We are given a series of mapping providers from resolveMappingsChain, but in some of them we need the reverse direction,
// so we need to know which ones to reverse.
function resolveDirectionOfMappings(
    fromNamespace: MappingsNamespace, providerChain: MappingsProvider[]
): DirectionedProvider[] {
    let currentNamespace = fromNamespace;
    return providerChain.map(provider => {
        const reverse = currentNamespace !== provider.fromNamespace;
        currentNamespace = reverse ? provider.fromNamespace : provider.toNamespace;
        return {provider, reverse}
    })
}

const reversedClassMappingsCache = new MemoryCache<Record<string, string>>();
const reversedMethodMappingsCache = new MemoryCache<Record<string, string>>();

async function mappingViaProvider(
    dirProvider: DirectionedProvider, version: MappingsVersion
): Promise<MappingMethod> {
    const provider = dirProvider.provider;
    const mappings = await getMappingsCached(provider, version);
    const key = provider.fromNamespace + provider.toNamespace + version.build + version.minecraftVersion;

    const usedClassMappings = dirProvider.reverse ? reversedClassMappingsCache.get(key, () => flipRecord(mappings.classes))
        : mappings.classes
    const usedMethodMappings = dirProvider.reverse ? reversedMethodMappingsCache.get(key, () => flipRecord(mappings.noDescriptorToDescriptorMethods))
        : mappings.noDescriptorToDescriptorMethods
    return {
        mapMethod: unmapped => usedMethodMappings[unmapped] ?? unmapped,
        mapClass: unmapped => usedClassMappings[unmapped] ?? unmapped
    };
}

async function mappingViaProviderChain(
    providerChain: DirectionedProvider[],
    version: MappingsVersion
): Promise<MappingMethod> {
    const mappingChain = await Promise.all(
        providerChain.map(provider => mappingViaProvider(provider, version))
    );

    const classMaps = mappingChain.map(strategy => ((name: string) => strategy.mapClass(name)))
    const methodMaps = mappingChain.map(strategy => ((name: string) => strategy.mapMethod(name)))

    return {
        // Call all the mappings required to go from one namespace to another
        mapClass: unmapped => callAll(unmapped, classMaps),
        mapMethod: unmapped => callAll(unmapped, methodMaps)
    };
}

function callAll<T>(target: T, calls: ((value: T) => T)[]): T {
    let current = target;
    for (const call of calls) {
        current = call(current)
    }
    return current;
}
