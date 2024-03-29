import {getBuildsCached, MappingsProvider} from "../providers/MappingsProvider";
import {getMappingsCached} from "../MappingsApi";
import {MappingsNamespace} from "../MappingsNamespace";
import {resolveMappingsChain} from "./MappingsResolver";
import {mappingFilterForMappables, MappingsFilter} from "../MappingsFilter";
import {AnyMappable, isSimpleMethod, JavaClass, JavaMethod, Mappable, SimpleMappable, SimpleMethod} from "../../crash/model/Mappable";
import {HashSet} from "../../fudge-lib/collections/hashmap/HashSet";

export interface MappingStrategy {
    mapMethod: (unmapped: SimpleMethod) => SimpleMethod
    mapClass: (unmapped: JavaClass) => JavaClass
}

export const IdentityMapping: MappingStrategy = {
    mapClass: unmapped => unmapped,
    mapMethod: unmapped => unmapped
}


export enum DesiredBuildProblem {
    BuildsLoading, NoBuildsForNamespace
}

export type DesiredBuild = string | DesiredBuildProblem

export function isValidDesiredBuild(desiredBuild: DesiredBuild): desiredBuild is string {
    return typeof desiredBuild === "string";
}

/**
 * Information required to produce a MappingStrategy
 */
export interface MappingContext {
    originalNamespace: MappingsNamespace
    desiredNamespace: MappingsNamespace;
    // undefined if builds are still loading
    desiredBuild: DesiredBuild;
    minecraftVersion: string | undefined
    // isDeobfuscated: boolean;
    // loader: LoaderType;
    relevantMappables: HashSet<SimpleMappable>
}

// export function useMappingFor(element: RichStackTraceElement, context: MappingContext): MappingStrategy {
//     return usePromise(
//         getMappingFor(element, context), [context.desiredBuild, context.desiredNamespace]
//     ) ?? IdentityMapping
// }
//
// export function useMappingForName(name: SimpleMappable, context: MappingContext): MappingStrategy {
//     return usePromise(
//         getMappingForName(name, context), [context.desiredBuild, context.desiredNamespace]
//     ) ?? IdentityMapping; // When mappings have not loaded yet keep name as-is
// }

// async function getMappingFor(element: RichStackTraceElement, context: MappingContext): Promise<MappingStrategy> {
//     if (typeof element === "number") {
//         return IdentityMapping
//     } else {
//         return getMappingForName(element.method, context);
//     }
// }

// export for testing
export async function getMappingForContext(context: MappingContext): Promise<MappingStrategy> {
    if (context.desiredBuild === DesiredBuildProblem.BuildsLoading) return IdentityMapping;
    if (context.minecraftVersion === undefined) return IdentityMapping
    //TODO: I don't like how everything is resolved every time
    // const originalNamespace = detectMappingNamespace(context.originalNamespace, context);
    const originalNamespace = context.originalNamespace;
    const mappingChain = resolveMappingsChain(originalNamespace, context.desiredNamespace, context.minecraftVersion);
    if (mappingChain === undefined) {
        throw new Error(`Cannot find path from namespace '${originalNamespace}' to namespace '${context.desiredNamespace}'`)
    }
    const withDirection = resolveDirectionOfMappings(originalNamespace, mappingChain);
    return mappingViaProviderChain(withDirection, context.relevantMappables, {
        // If there are no builds just pass in "", the mappings provider just ignores it
        targetBuild: context.desiredBuild,
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
        // noinspection ReuseOfLocalVariableJS
        currentNamespace = reverse ? provider.fromNamespace : provider.toNamespace;
        return {provider, reverse}
    })
}

interface DesiredVersion {
    targetBuild: string | DesiredBuildProblem.NoBuildsForNamespace;
    minecraftVersion: string
}

async function mappingViaProviderChain(
    providerChain: DirectionedProvider[],
    relevantMappables: HashSet<SimpleMappable>,
    version: DesiredVersion,
): Promise<MappingStrategy> {
    if (providerChain.isEmpty()) return IdentityMapping;
    // Say the relevant mappables are the following:
    // - d#b
    // - abb#d
    // - aqx
    // And we map official => intermediary => yarn.
    // When it comes to the official => intermediary mappings (firstStep), we only want to save mappings that map these 3.
    // When it comes to the intermediary => yarn mappings (currentStep), we only want the mappings that map these IN INTERMEDIARY,
    // as in, we need to compute the following set:
    // - d#b becomes net.minecraft.class_123#method_1234
    // - abb#d becomes net.minecraft.class_523#method_1434
    // - aqx becomes net.minecraft.class_11123#method_14434
    // And filter to only use relevant mappables MAPPED TO NAMESPACE OF STEP (in this case mapped to intermediary)
    let relevantMappablesOfNamespaceOfStep: HashSet<AnyMappable> = relevantMappables

    const steps = await providerChain.mapSync(async (provider, i) => {
        const last = i === providerChain.length - 1
        const filter = mappingFilterForMappables(relevantMappablesOfNamespaceOfStep, provider.reverse)
        const currentStrategy = await mappingViaProviderStep(providerChain[i], version, filter, last)
        // Map the relevant mappables to be relevant for the next step

        if (!last) {
            relevantMappablesOfNamespaceOfStep = relevantMappablesOfNamespaceOfStep.map(mappable => {
                return currentStrategy(mappable);
            })
        }
        return currentStrategy;
    })

    return {
        // Call all the mappings required to go from one namespace to another
        mapClass: unmapped => keepOnMappin<JavaClass>(unmapped, steps),
        mapMethod: unmapped => {
            if (providerChain.length === 0) return unmapped;
            const completelyMapped = keepOnMappin<JavaMethod>(unmapped, steps);
            if (isSimpleMethod(completelyMapped)) {
                return completelyMapped
            } else {
                // Final step: remove descriptor (since originally the unmapped has no descriptor)
                return completelyMapped.method;
            }
        }
    };
}

type MappingStep = <T extends AnyMappable>(unmapped: Mappable<T>) => T

async function mappingViaProviderStep<T extends boolean>(
    dirProvider: DirectionedProvider, version: DesiredVersion, filter: MappingsFilter,
    //We only care about the build for the last mapping, because that's the one the user actually chose.
    last: boolean): Promise<MappingStep> {
    const provider = dirProvider.provider;
    const mappings = await getMappingsCached(provider, {
        minecraftVersion: version.minecraftVersion,
        build: await resolveUsedBuild(last, version, dirProvider),
    }, filter);

    const reverse = dirProvider.reverse;

    return unmapped => unmapped.remap(mappings, reverse)
}

async function resolveUsedBuild(last: boolean, version: DesiredVersion, dirProvider: DirectionedProvider): Promise<string> {
    const provider = dirProvider.provider;
    if (last && version.targetBuild !== DesiredBuildProblem.NoBuildsForNamespace) {
        return version.targetBuild;
    }
    return (await getBuildsCached(provider, version.minecraftVersion)).firstOr(() => "no-build")
}


function keepOnMappin<Out extends AnyMappable>(target: Mappable<Out>, calls: ((value: AnyMappable) => AnyMappable)[]): Out {
    if (calls.length === 0) throw new Error("Expected to map at least once!")
    let current: AnyMappable = target;
    for (const call of calls) {
        current = call(current)
    }
    return current as Out;
}

