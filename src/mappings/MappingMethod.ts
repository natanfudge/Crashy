import {JavaClass, JavaMethod, Loader, LoaderType, RichStackTraceElement} from "crash-parser/src/model/RichCrashReport";
import {usePromise} from "../ui/utils/PromiseBuilder";
import {MappingsProvider, MappingsVersion} from "./MappingsProvider";
import {getMappingsCached} from "./Mappings";
import {MemoryCache} from "../utils/PromiseMemoryCache";
import {flipRecord} from "../utils/Javascript";
import {MappingsNamespace} from "./MappingsNamespace";
import {detectMappingNamespace} from "./MappingDetector";
import {resolveMappingsChain} from "./MappingsResolver";
import {BiMap} from "../utils/BiMap";

export interface MappingMethod {
    mapMethod: (unmapped: string) => string
    mapClass: (unmapped: string) => string
}

export const IdentityMapping: MappingMethod = {
    mapClass: unmapped => unmapped,
    mapMethod: unmapped => unmapped
}

export type Mappable = JavaClass | JavaMethod

export enum DesiredBuildProblem {
    BuildsLoading, NoBuildsForNamespace
}
export type DesiredBuild = string | DesiredBuildProblem

export function isValidDesiredBuild(desiredBuild: DesiredBuild): desiredBuild is string {
    return typeof desiredBuild === "string";
}

export interface MappingContext {
    desiredNamespace: MappingsNamespace;
    // undefined if builds are still loading
    desiredBuild: DesiredBuild;
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
    if (context.desiredBuild === DesiredBuildProblem.BuildsLoading) return IdentityMapping;
    const originalNamespace = detectMappingNamespace(name, context);
    const mappingChain = resolveMappingsChain(originalNamespace, context.desiredNamespace);
    if (mappingChain === undefined) {
        throw new Error(`Cannot find path from namespace '${originalNamespace}' to namespace '${context.desiredNamespace}'`)
    }
    const withDirection = resolveDirectionOfMappings(originalNamespace, mappingChain);
    return mappingViaProviderChain(withDirection, {
        // If there are no builds just pass in "", the mappings provider just ignores it
        build: context.desiredBuild === DesiredBuildProblem.NoBuildsForNamespace ? "" : context.desiredBuild,
        minecraftVersion: context.minecraftVersion
    });
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

// const reversedClassMappingsCache = new MemoryCache<Record<string, string>>();
// const reversedNoDescMethodMappingsCache = new MemoryCache<Record<string, string>>();
// const reversedDescMethodMappingsCache = new MemoryCache<Record<string, string>>();

// async function middlemanMappingViaProvider

async function mappingViaProviderStep(
    dirProvider: DirectionedProvider, version: MappingsVersion,
    /**
     * See javadoc for Mappings#descriptorToDescriptorMethods.
     * Initially we map from noDesc to desc, at the middle we map from desc to desc, and at the end we remove the descriptor.
     */
    {initial}: { initial: boolean }
): Promise<MappingMethod> {
    const provider = dirProvider.provider;
    const mappings = await getMappingsCached(provider, version);
    const reverse = dirProvider.reverse;

    const usedClassMappings = reverse ? mappings.classes.getReverseMap() : mappings.classes.getNormalMap();
    // Initial: no-desc -> desc, middleman: desc -> desc
    const usedMethodMappingsInTermsOfDesc = initial ? mappings.noDescriptorToDescriptorMethods : mappings.descriptorToDescriptorMethods;
    const usedMethodMappings = reverse ? usedMethodMappingsInTermsOfDesc.getReverseMap() : usedMethodMappingsInTermsOfDesc.getNormalMap();

    return {
        mapMethod: unmapped => usedMethodMappings[unmapped] ?? unmapped,
        mapClass: unmapped => usedClassMappings[unmapped] ?? unmapped
    };
}


function removeDescriptor(methodName: string): string {
    return methodName.removeAfterFirstExclusive("(")
}

//TODO: this breaks when we do multiple layers... fetch error...
async function mappingViaProviderChain(
    providerChain: DirectionedProvider[],
    version: MappingsVersion
): Promise<MappingMethod> {
    const mappingChain = await Promise.all(
        providerChain.map((provider, i) => mappingViaProviderStep(provider, version, {initial: i === 0}))
    );

    const classMaps = mappingChain.map(strategy => ((name: string) => strategy.mapClass(name)))
    const methodMaps = mappingChain.map(strategy => ((name: string) => strategy.mapMethod(name)))

    return {
        // Call all the mappings required to go from one namespace to another
        mapClass: unmapped => callAll(unmapped, classMaps),
        // Final step: remove descriptor (since originally the unmapped has no descriptor)
        mapMethod: unmapped => removeDescriptor(callAll(unmapped, methodMaps))
    };
}

function callAll<T>(target: T, calls: ((value: T) => T)[]): T {
    let current = target;
    for (const call of calls) {
        current = call(current)
    }
    return current;
}
