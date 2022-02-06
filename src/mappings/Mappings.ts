import {StringMap} from "crash-parser/src/model/CrashReport";
import {MappingsNamespace} from "./MappingsNamespace";
import {
    IntermediaryToYarnMappingsProvider,
    MappingsBuilds,
    MappingsProvider,
    MappingsVersion
} from "./MappingsProvider";
import {Lazy, PromiseMemoryCache} from "../utils/PromiseMemoryCache";
import {useEffect, useState} from "react";
import {Dict, HashMap, MutableDict} from "../utils/hashmap/HashMap";
import {DescriptoredMethod, JavaClass, JavaMethod} from "./Mappable";

type SingleDirectionMappingData = Dict<JavaClass, ClassMappings>

function reverseMappingData(data: SingleDirectionMappingData): SingleDirectionMappingData {
    return data.map(
        (_, mappings) => mappings.mappedClassName,
        (unmappedClass, mappings) => {
            const reversed: ClassMappings = {
                mappedClassName: unmappedClass,
                methods: mappings.methods.map(
                    (_, mappedName) => mappedName,
                    (unmappedName) => unmappedName
                )
            }
            return reversed
        }
    )
}


interface ClassMappings {
    mappedClassName: JavaClass
    // Key is method name stored as ${className}#{methodName}${descriptor}
    methods: HashMap<DescriptoredMethod, DescriptoredMethod>;
}


export class Mappings {
    private readonly mappings: SingleDirectionMappingData


    // eslint-disable-next-line no-invalid-this
    private readonly mappingsReversed = new Lazy(() => reverseMappingData(this.mappings));


    private getMappings(reversed: boolean): SingleDirectionMappingData {
        return reversed ? this.mappingsReversed.get() : this.mappings;
    }

    constructor(mappings: SingleDirectionMappingData) {
        this.mappings = mappings;
    }

    mapClass(className: JavaClass, reverse: boolean): JavaClass {
        const maps = this.getMappings(reverse);
        return maps.get(className)?.mappedClassName ?? className;
    }

    mapSimpleMethod(methodName: JavaMethod, reverse: boolean): DescriptoredMethod {
        const classMappings = this.getMappings(reverse).get(methodName.classIn);
        if (classMappings !== undefined) {
            // Linear search is fine because we filter down only to the methods we use
            return classMappings.methods.linearSearch(unmapped => unmapped.method.equals(methodName))
                // If class is found but method is not - map just the class
                ?? methodName.withClass(classMappings.mappedClassName).withEmptyDescriptor()
        } else {
            // If the class name is not found - don't map this method. Mapping just by method name can create very incorrect results, e.g. if a method is called run
            // it would be remapped into something almost completely random.
            // Remapping without descriptor is ok because at worst case the wrong method is in the same class and has the same name.
            return methodName.withEmptyDescriptor();
        }
    }

    mapDescriptoredMethod(methodName: DescriptoredMethod, reverse: boolean): DescriptoredMethod {
        // Same logic as mapSimpleMethod when it comes to mapping / not mapping
        const classMappings = this.getMappings(reverse).get(methodName.method.classIn);
        if (classMappings !== undefined) {
            return classMappings?.methods.get(methodName) ?? methodName.withClass(classMappings.mappedClassName)
        } else {
            return methodName;
        }
    }
}

export interface MappingsFilter {
    needClass(javaClass: JavaClass): boolean

    needMethod(method: JavaMethod): boolean

    usingReverse: boolean
}

export const AllowAllMappings: MappingsFilter = {
    needClass(name: JavaClass): boolean {
        return true
    },
    needMethod(method: JavaMethod): boolean {
        return true
    },
    usingReverse: false
}

export class MappingsBuilder {
    private readonly classMappings: MutableDict<JavaClass, JavaClass>
    // private readonly mappings: MutableDict<JavaClass, ClassMappings>
    private readonly filter: MappingsFilter

    private readonly methodsToAdd: { unmapped: DescriptoredMethod, mappedName: string }[] = [];

    constructor(filter: MappingsFilter) {
        this.classMappings = new HashMap(undefined)
        this.filter = filter;
    }

    // Returns undefined if this class's  methods are not needed (it's still put in the Dict for remapping)
    addClass(unmapped: string, mapped: string): JavaClass | undefined {
        const unmappedClass = new JavaClass(unmapped, true)
        const mappedClass = new JavaClass(mapped, true);
        this.classMappings.put(unmappedClass, mappedClass)

        return this.filter.needClass(this.filter.usingReverse ? mappedClass : unmappedClass) ? unmappedClass : undefined;
    }

    //VERY IMPORTANT TODO: WE NEED THE MAPPINGS OF CLASSES THAT EXIST IN DESCRIPTORS!

    addMethod(unmappedClassName: JavaClass, unmappedMethodName: string, unmappedDescriptor: string, mappedMethodName: string) {
        const method = unmappedClassName.withMethod(unmappedMethodName)

        this.methodsToAdd.push({unmapped: method.withDescriptor(unmappedDescriptor), mappedName: mappedMethodName})
    }

    remapDescriptor(descriptor: string): string {
        return descriptor.replace(/L(.+?);/g, (match, p1) =>
            `L${this.classMappings.get(new JavaClass(p1, true))?.getUnmappedFullName()?.replaceAll(".", "/") ?? p1};`
        );
    }

    build(): Mappings {
        const finalMappings = new HashMap<JavaClass, ClassMappings>(undefined)
        this.classMappings.forEach((unmapped, mapped) => {
            if (this.filter.needClass(this.filter.usingReverse ? mapped : unmapped)) {
                finalMappings.put(unmapped, {
                    mappedClassName: mapped,
                    methods: new HashMap(undefined)
                })
            }
        })
        // We only add the methods once we are done with everything, so we have all the classes ready for remapping method descriptors
        for (const {unmapped, mappedName} of this.methodsToAdd) {
            const classEntry = finalMappings.get(unmapped.method.classIn)
            if (classEntry === undefined) {
                throw new Error(`Class ${unmapped.method.classIn} not found in mappings`)
            }

            // Possible optimization: we don't need to store this remapped descriptor, we can only calculate it when we actually need it
            // based off of the class mappings
            const mapped = classEntry.mappedClassName.withDescMethod(mappedName, this.remapDescriptor(unmapped.descriptor));
            if (this.filter.needMethod(this.filter.usingReverse ? mapped.method : unmapped.method)) {
                classEntry.methods.put(unmapped, mapped)
            }

        }
        return new Mappings(finalMappings);
    }
}

export const EmptyMappings: Mappings = new Mappings(HashMap.empty());

export function remap(name: string, map: StringMap): string {
    const mapped = map[name];
    return mapped !== undefined ? mapped : name;
}


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


const buildsCache = new PromiseMemoryCache<MappingsBuilds>();

export async function getBuildsCached(provider: MappingsProvider, minecraftVersion: string): Promise<MappingsBuilds> {
    // noinspection JSDeprecatedSymbols
    return buildsCache.get(
        provider.fromNamespace + provider.toNamespace + minecraftVersion,
        () => provider.getBuilds(minecraftVersion)
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

export async function getMappingsCached(mappingsProvider: MappingsProvider, version: MappingsVersion, filter: MappingsFilter): Promise<Mappings> {
    return mappingsCache.get(
        mappingsProvider.fromNamespace + mappingsProvider.toNamespace + version.build + version.minecraftVersion,
        () => mappingsProvider.getMappings(version, filter)
    ).catch(e => {
        console.error("Could not get mappings", e);
        return EmptyMappings;
    });
}
