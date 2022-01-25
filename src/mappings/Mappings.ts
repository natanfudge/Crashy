import {StringMap} from "crash-parser/src/model/CrashReport";
import {MappingsNamespace} from "./MappingsNamespace";
import {
    IntermediaryToYarnMappingsProvider,
    MappingsBuilds,
    MappingsProvider,
    OfficialToIntermediaryMappingsProvider
} from "./MappingsProvider";
import {MemoryCache, PromiseMemoryCache} from "../utils/PromiseMemoryCache";
import {JavaClass, JavaMethod, Loader} from "crash-parser/src/model/RichCrashReport";
import {usePromise} from "../ui/utils/PromiseBuilder";
import {flipRecord} from "../utils/Javascript";


// const

export interface Mappings {
    // Must use dot.notation e.g. net.minecraft.gui.GuiThing
    classes: StringMap
    methods: StringMap
    isLoading?: boolean
    // fields: StringMap
}

export const EmptyMappings: Mappings = {
    classes: {},
    methods: {},
    isLoading: false
}
export const LoadingMappings: Mappings = {
    classes: {},
    methods: {},
    isLoading: true
}

export function remap(name: string, map: StringMap): string {
    const mapped = map[name];
    return mapped !== undefined ? mapped : name;
}

export interface MappingContext {
    desiredNamespace: MappingsNamespace;
    desiredBuild: string;
    //TODO: check if we need this when done
    minecraftVersion: string;
    isDeobfuscated: boolean;
    loader: Loader;
}

type MappingMethod = (unmapped: string) => string

export function useMappingForClass(javaClass: JavaClass, context: MappingContext): MappingMethod {
    return usePromise(
        getMappingForClass(javaClass, context), [context.desiredBuild, context.desiredNamespace]
    ) ?? (name => name); // When mappings have not loaded yet keep name as-is
}

//TODO: implement mapping loading detection via querying the PromiseMemoryCache object, and remove isLoading in Mappings.

async function getMappingForClass(javaClass: JavaClass, context: MappingContext): Promise<MappingMethod> {
    if (isIntermediaryClassName(javaClass)) {
        switch (context.desiredNamespace) {
            case "Intermediary":
                // If it's intermediary => intermediary, keep name as is
                return name => name;
            case "Yarn":
                return classMappingViaProvider(IntermediaryToYarnMappingsProvider, context.desiredBuild, {reverse: false})
            case "Official":
                return classMappingViaProvider(OfficialToIntermediaryMappingsProvider, context.desiredBuild, {reverse: true})
            default:
                throw new Error("TODO")
        }
    } else{
        //TODO
        return name => name
    }
}

const reversedClassMappingsCache = new MemoryCache<Record<string, string>>();

async function classMappingViaProvider(provider: MappingsProvider, build: string, options: { reverse: boolean }): Promise<MappingMethod> {
    const mappings = (await getMappingsCached(provider, build)).classes;
    const mappingsReversed = options.reverse ? reversedClassMappingsCache.get(
        provider.fromNamespace + provider.toNamespace + build, () => flipRecord(mappings)
    ) : undefined
    return name => {
        const usedMappings = options.reverse ? mappingsReversed! : mappings;
        return usedMappings[name] ?? name
    };
}

async function classMappingViaProviderChain(
    firstMapProvider: { provider: MappingsProvider, reverse: boolean },
    secondMapProvider: { provider: MappingsProvider, reverse: boolean },
    build: string
): Promise<MappingMethod> {
    const [firstMap, secondMap] = await Promise.all([
        classMappingViaProvider(firstMapProvider.provider, build, {reverse: firstMapProvider.reverse}),
        classMappingViaProvider(secondMapProvider.provider, build, {reverse: secondMapProvider.reverse}),
    ]);

    return name => secondMap(firstMap(name))
}

function isIntermediaryClassName(javaClass: JavaClass): boolean {
    return javaClass.simpleName.startsWith("class_")
        && javaClass.packageName === "net.minecraft"
}

function isIntermediaryMethodName(javaMethod: JavaMethod): boolean {
    return isIntermediaryClassName(javaMethod.class)
        && javaMethod.name.startsWith("method_")
}


//     [MappingsNamespace.Yarn]: YarnMappingsProvider
//     [MappingsNamespace.MojMap]
// }

// const versionsData: Record<MappingsNamespaceName, string[]> = {
//     [MappingsNamespaceName.Yarn]: ["1.15", "1.16", "1.17", "This super long thingy", "1.18.1+build.14"],
//     [MappingsNamespaceName.Official]: ["1.14"],
//     [MappingsNamespaceName.MojMap]: ["1.14"],
//     [MappingsNamespaceName.Intermediary]: ["1.14"],
//     [MappingsNamespaceName.Srg]: ["1.14"],
//     [MappingsNamespaceName.Mcp]: ["1.14"],
//     [MappingsNamespaceName.Quilt]: ["1.14"]
// }


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
    // return [];
}

const buildsCache = new PromiseMemoryCache<MappingsBuilds>();

export async function buildsOf(namespace: MappingsNamespace, minecraftVersion: string): Promise<MappingsBuilds> {
    return buildsCache.get(
        namespace + minecraftVersion,
        () => buildsOfNoCache(namespace, minecraftVersion)
    );
}


//
// export async function getBuildsCached(mappingsProvider: MappingsProvider, minecraftVersion: string): Promise<MappingsBuilds> {
//     return buildsCache.get(
//         mappingsProvider.fromNamespace + mappingsProvider.toNamespace + minecraftVersion,
//         () => mappingsProvider.getBuilds(minecraftVersion)
//     );
// }

const mappingsCache = new PromiseMemoryCache<Mappings>()

export async function getMappingsCached(mappingsProvider: MappingsProvider, build: string): Promise<Mappings> {
    return mappingsCache.get(
        mappingsProvider.fromNamespace + mappingsProvider.toNamespace + build,
        () => mappingsProvider.getMappings(build)
    );
}
