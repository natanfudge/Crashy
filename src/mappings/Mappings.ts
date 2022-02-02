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
import {BiMap} from "../utils/BiMap";
import {
    JavaClass,
    JavaMethod,
} from "crash-parser/src/model/RichCrashReport";
import {mapRecord} from "../utils/Javascript";
import {Entry, HashMap, Dict, MutableDict} from "../utils/hashmap/HashMap";

type SimpleMethodName = string

// type DescriptoredMethodName = string

export interface DescriptoredMethodName {
    method: JavaMethod,
    descriptor: string
}

// function descriptoredMethodNameAsKey(name: DescriptoredMethodName): string {
//     return javaMethodFullUnmappedName(name.method) + name.descriptor;
// }
//
// function parseDescriptoredMethodName(name: string): DescriptoredMethodName {
//     const [simpleMethodNameWithClass, descriptorWithoutLeadingBrace] = name.splitToTwo("(")
//     const [fullClassName, simpleMethodName] = simpleMethodNameWithClass.splitToTwo("#")
//     return {
//         method: {
//             name: simpleMethodName,
//             classIn: parseJavaClass(fullClassName)
//         },
//         descriptor: "(" + descriptorWithoutLeadingBrace
//     }
// }
//
// // function javaClassAsKey(javaClass: JavaClass) : string {}
//
// function parseJavaClass(name: string): JavaClass {
//     const [packageName, simpleName] = name.splitToTwoOnLast(".")
//     return {packageName, simpleName}
// }
//
// // type ExtendedMappable = Mappable | DescriptoredMethodName
// type PossibleDescriptors =
// interface ClassMapping

// Key is class name stored as dot.qualified.names
// type SingleDirectionMappings = HashMap<JavaClass, ClassMappings>

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

// {
//     private readonly mappings: HashMap<JavaClass, ClassMappings>
//     // We need a way to resolve methods that don't have any class or descriptor associated with them
//     private readonly classlessMethodsMap = this.gatherMethodInfo();
//     constructor(mappings: HashMap<JavaClass, ClassMappings>) {
//         this.mappings = mappings;
//     }
//
//     private gatherMethodInfo(): ClasslessMethodsToPossibleClasses {
//         const map : ClasslessMethodsToPossibleClasses = new HashMap(this.mappings.size);
//         this.mappings.forEach((classIn, classMappings) => {
//             classMappings.methods.forEach(descriptored => {
//                 const newEntry = {key: descriptored.method,value: [descriptored]}
//
//                 // If the method name has not been inputted to the map yet
//                 map.putIfAbsent(descriptored.method.name,  HashMap.fromArray([newEntry]))
//                     // If the method name was inputted but a descriptor has not
//                     ?.putIfAbsent(descriptored.method,[descriptored])
//                     // If a previous descriptor was added already
//                     ?.push(descriptored)
//             })
//         })
//         return map;
//     }
//
//     get(className: JavaClass): ClassMappings | undefined {
//         return this.mappings.get(className)
//     }
//
//     // Returns undefined if method does not exist
//     possibleDescriptorsFor(method: JavaMethod): DescriptoredMethodName[]  | undefined {
//         return this.classlessMethodsMap.get(method.name)?.get(method);
//     }
//
//     toReversed(): SingleDirectionMappingData {
//          return new SingleDirectionMappingData(
//              this.mappings.map(
//                  (_, mappings) => mappings.mappedClassName,
//                  (unmappedClass, mappings) => {
//                      const reversed: ClassMappings = {
//                          mappedClassName: unmappedClass,
//                          methods: mappings.methods.map(
//                              (_, mappedName) => mappedName,
//                              (unmappedName) => unmappedName
//                          )
//                      }
//                      return reversed
//                  }
//              )
//          )
//     }
//
// }

interface ClassMappings {
    mappedClassName: JavaClass
    // Key is method name stored as ${className}#{methodName}${descriptor}
    methods: HashMap<DescriptoredMethodName, DescriptoredMethodName>;
}

// // Probably: make SingleDirectionMappings a class and give it a lazy .getClasslessMethods(), .getDescriptorlessMethods()
// type ClasslessMethodsToPossibleClasses = HashMap<string, DescriptorlessMethodsToPossibleDescriptors>;
// type DescriptorlessMethodsToPossibleDescriptors = HashMap<JavaMethod, DescriptoredMethodName[]>

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

    mapSimpleMethod(methodName: JavaMethod, reverse: boolean): DescriptoredMethodName {
        const classMappings = this.getMappings(reverse).get(methodName.classIn);
        if (classMappings !== undefined) {
            // Linear search is fine because we filter down only to the methods we use
            return classMappings.methods.linearSearch(unmapped => unmapped.method.equals(methodName)) ?? methodName.withClass(classMappings.mappedClassName).withEmptyDescriptor()
        } else {
            // If the class name is not found - don't map this method. Mapping just by method name can create very incorrect results, e.g. if a method is called run
            // it would be remapped into something almost completely random.
            // Remapping without descriptor is ok because at worst case the wrong method is in the same class and has the same name.
            return methodName.withEmptyDescriptor();
        }
    }

    mapDescriptoredMethod(methodName: DescriptoredMethodName, reverse: boolean): DescriptoredMethodName {
        return this.getMappings(reverse).get(methodName.method.classIn)?.methods?.get(methodName) ?? methodName;
    }
}

export interface MappingsFilter {
    classFilter(name: string): boolean

    methodFilter(className: string, methodName: string, descriptor: string): boolean
}

export const AllowAllMappings: MappingsFilter = {
    classFilter(name: string): boolean {
        return true
    },
    methodFilter(className: string, methodName: string, descriptor: string): boolean {
        return true
    }
}

export class MappingsBuilder {
    private readonly mappings: MutableDict<JavaClass, ClassMappings>
    private readonly filter: MappingsFilter

    constructor(filter: MappingsFilter) {
        this.mappings = new HashMap(undefined)
        this.filter = filter;
    }

    addClass(unmapped: string, mapped: string) {
        // zj Initial hash: 1205
        // zj Initial capacity: 3079
        this.mappings.put(new JavaClass(unmapped, true), {
            methods: new HashMap(undefined),
            mappedClassName: new JavaClass(mapped, true)
        })
    }

    addMethod(unmappedClassName: string, unmappedMethodName: string, unmappedDescriptor: string, mappedMethodName: string) {
        const classKey = new JavaClass(unmappedClassName, true)
        // zj get hash: 3477
        // zj get capacity: 4618
        const classEntry = this.mappings.get(classKey)
        if (classEntry === undefined) {
            const linearFind = this.mappings.linearSearch(k => k.equals(classKey))
            if (linearFind !== undefined) {
                throw new Error(`Bug in hashmap! item ${unmappedClassName} exists but map is not finding it`)
            } else {
                throw new Error(`Class ${unmappedClassName} not found in mappings`)
            }

        }
        classEntry.methods.put({
            method: new JavaMethod(classKey, unmappedMethodName),
            descriptor: unmappedDescriptor
        }, {
            method: new JavaMethod(classEntry.mappedClassName, mappedMethodName),
            // Possible optimization: we don't need to store this remapped descriptor, we can only calculate it when we actually need it
            // based off of the class mappings
            descriptor: this.remapDescriptor(unmappedDescriptor)
        })
    }

    remapDescriptor(descriptor: string): string {
        return descriptor.replace(/L(.+?);/g, (match, p1) => `L${this.mappings.get(new JavaClass(p1, true)) ?? p1};`);
    }

    build(): Mappings {
        return new Mappings(this.mappings);
    }
}


//
// export interface Mappings {
//     /**
//      * Must use dot.notation e.g. net.minecraft.gui.GuiThing
//      */
//     classes: BiMap<string, string>
//     /**
//      * Stack trace lines include method names without the descriptor - so we need a map from these "simple" method names
//      * to the desired namespace
//      *
//      * Descriptors use slashes/in/package/names
//      */
//     noDescriptorToDescriptorMethods: BiMap<SimpleMethodName, DescriptoredMethodName>
//     /**
//      * In cases where we go through multiple namespaces to get to the desired namespace, we need to not lose information along the way.
//      * So in that case if you go through namespaces a -> b -> c -> d it will be:
//      * - Stack trace includes SimpleMethodNames from namespace a
//      * - first Mappings maps those names to DescriptoredMethodNames from namespace b (using noDescriptorToDescriptorMethods)
//      * - second Mappings maps those names to DescriptoredMethodNames from namespace c (using descriptorToDescriptorMethods)
//      * - third Mappings maps those names to DescriptoredMethodNames from namespace d (using descriptorToDescriptorMethods)
//      *
//      * Using descriptors as much as possible ensures the mappings are as accurate as possible.
//      *
//      * Descriptors use slashes/in/package/names
//      */
//     descriptorToDescriptorMethods: BiMap<DescriptoredMethodName, DescriptoredMethodName>
//     // fields: StringMap
// }

export const EmptyMappings: Mappings = new Mappings(HashMap.empty());

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

export async function getMappingsCached(mappingsProvider: MappingsProvider, version: MappingsVersion, filter: MappingsFilter): Promise<Mappings> {
    return mappingsCache.get(
        mappingsProvider.fromNamespace + mappingsProvider.toNamespace + version.build + version.minecraftVersion,
        () => mappingsProvider.getMappings(version,filter)
    ).catch(e => {
        console.error("Could not get mappings", e);
        return EmptyMappings;
    });
}
