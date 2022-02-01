import {JavaClass, JavaMethod, Loader, LoaderType, RichStackTraceElement} from "crash-parser/src/model/RichCrashReport";
import {usePromise} from "../ui/utils/PromiseBuilder";
import {MappingsProvider, MappingsVersion} from "./MappingsProvider";
import {DescriptoredMethodName, getMappingsCached} from "./Mappings";
import {MemoryCache} from "../utils/PromiseMemoryCache";
import {flipRecord} from "../utils/Javascript";
import {MappingsNamespace} from "./MappingsNamespace";
import {detectMappingNamespace} from "./MappingDetector";
import {resolveMappingsChain} from "./MappingsResolver";
import {BiMap} from "../utils/BiMap";

export interface MappingMethod {
    mapMethod: (unmapped: JavaMethod) => JavaMethod
    mapClass: (unmapped: JavaClass) => JavaClass
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
        currentNamespace = reverse ? provider.fromNamespace : provider.toNamespace;
        return {provider, reverse}
    })
}

// const reversedClassMappingsCache = new MemoryCache<Record<string, string>>();
// const reversedNoDescMethodMappingsCache = new MemoryCache<Record<string, string>>();
// const reversedDescMethodMappingsCache = new MemoryCache<Record<string, string>>();

// async function middlemanMappingViaProvider

interface DesiredVersion {
    targetBuild: string | DesiredBuildProblem.NoBuildsForNamespace;
    minecraftVersion: string
}

async function mappingViaProviderStep<T extends boolean>(
    dirProvider: DirectionedProvider, version: DesiredVersion,
    {
        /**
         * See javadoc for Mappings#descriptorToDescriptorMethods.
         * Initially we map from noDesc to desc, at the middle we map from desc to desc, and at the end we remove the descriptor.
         */
        initial,
        /**
         * We only care about the build for the last mapping, because that's the one the user actually chose.
         */
        last
    }: { initial: T, last: boolean }
): Promise<InternalMappingMethod<T>> {
    const provider = dirProvider.provider;
    const mappings = await getMappingsCached(provider, {
        minecraftVersion: version.minecraftVersion,
        build: await resolveUsedBuild(last, version, dirProvider)
    });
    const reverse = dirProvider.reverse;

    return {
        mapMethod: (unmapped: DescriptoredMethodName | JavaMethod) => {
            return initial ? mappings.mapSimpleMethod(unmapped as JavaMethod, reverse) : mappings.mapDescriptoredMethod(unmapped as DescriptoredMethodName, reverse);
        },
        mapClass: unmapped => mappings.mapClass(unmapped, reverse)
    };
}

export interface InitialMappingMethod {
    mapMethod: (unmapped: JavaMethod) => DescriptoredMethodName
    mapClass: (unmapped: JavaClass) => JavaClass
}

export interface IntermediateMappingMethod {
    mapMethod: (unmapped: DescriptoredMethodName) => DescriptoredMethodName
    mapClass: (unmapped: JavaClass) => JavaClass
}

// type InitialMappingMethod = (unmapped: JavaMethod) => DescriptoredMethodName
// type IntermediateMappingMethod = (partiallyMapped: DescriptoredMethodName) => DescriptoredMethodName

type InternalMappingMethod<Initial extends boolean> = Initial extends true ? InitialMappingMethod : IntermediateMappingMethod

async function resolveUsedBuild(last: boolean, version: DesiredVersion, dirProvider: DirectionedProvider): Promise<string> {
    const provider = dirProvider.provider;
    if (last) {
        // For the user it may appear there are no builds for the target namespace, however, sometimes we gather mappings by flipping existing providers.
        // For example, when a user requests to go from yarn to intermediary, intermediary has no builds, however we need to specify a real yarn build to the provider,
        // because we use the intermediary -> yarn provider (there is no yarn -> intermediary provider)
        if (version.targetBuild === DesiredBuildProblem.NoBuildsForNamespace) {
            const targetNamespace = dirProvider.reverse ? provider.fromNamespace : provider.toNamespace;
            return (await provider.getBuilds(version.minecraftVersion)).firstOr(() => "no-build")
        } else {
            return version.targetBuild;
        }
    }
    return (await provider.getBuilds(version.minecraftVersion)).firstOr(() => "no-build")
}


function removeDescriptor(methodName: string): string {
    return methodName.removeAfterFirstExclusive("(")
}

async function mappingViaProviderChain(
    providerChain: DirectionedProvider[],
    version: DesiredVersion
): Promise<MappingMethod> {
    const firstStepPromise = mappingViaProviderStep(providerChain[0], version, {
        last: providerChain.length === 1,
        initial: true
    })
    const intermediaryProviders = providerChain.drop(1);
    const otherStepsPromise = Promise.all(intermediaryProviders.map(
        (provider, i) => mappingViaProviderStep(provider, version, {
            last: i === intermediaryProviders.length - 1,
            initial: false
        })
    ))

    const [firstStep, otherSteps] = await Promise.all([firstStepPromise, otherStepsPromise]);

    const classMaps = [firstStep, ...otherSteps].map(strategy => ((name: JavaClass) => strategy.mapClass(name)))
    const intermediaryMethodMaps = otherSteps.map(strategy => ((name: DescriptoredMethodName) => strategy.mapMethod(name)))

    return {
        // Call all the mappings required to go from one namespace to another
        mapClass: unmapped => callAll(unmapped, classMaps),
        // Final step: remove descriptor (since originally the unmapped has no descriptor)
        mapMethod: unmapped => {
            const mappedOnce = firstStep.mapMethod(unmapped);
            const completelyMapped = callAll(mappedOnce, intermediaryMethodMaps);
            return completelyMapped.method;
        }
    };
}

function callAll<T>(target: T, calls: ((value: T) => T)[]): T {
    let current = target;
    for (const call of calls) {
        current = call(current)
    }
    return current;
}
