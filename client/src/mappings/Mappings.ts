import {MappingsImpl} from "./MappingsImpl";
import {MappingsBuilder} from "./MappingsBuilder";
import {AllowAllMappings} from "./MappingsFilter";
import {DescriptoredMethod, JavaClass, JavaMethod, SimpleMethod} from "../crash/model/Mappable";
import {HashMap} from "fudge-lib/src/collections/hashmap/HashMap";

export interface Mappings {
    mapClass(className: JavaClass, reverse: boolean): JavaClass

    mapSimpleMethod(methodName: SimpleMethod, reverse: boolean): JavaMethod

    mapDescriptoredMethod(methodName: DescriptoredMethod, reverse: boolean): DescriptoredMethod
    //
    // serialize(): SerializedMappings
}

export type SerializedMappings = Record<string, ClassMappingsEntry>

export interface ClassMappingsEntry {
    // Mapped Class name (shortened to save space)
    c: string
    // Method entries (shortened to save space)
    m: MethodEntry[]
}

// Unmapped, mapped, unmapped descriptor
export type MethodEntry = [string, string, string]

// function deserializeMappings(serialized: SerializedMappings): Mappings {
//     const builder = new MappingsBuilder(AllowAllMappings);
//     for (const unmappedClass in serialized) {
//         const {c, m} = serialized[unmappedClass];
//         const javaClass = builder.addClass(unmappedClass, c);
//         if (javaClass !== undefined) {
//             for (const [unmappedMethod, mappedMethod, unmappedDescriptor] of m) {
//                 builder.addMethod(javaClass, unmappedMethod, unmappedDescriptor, mappedMethod);
//             }
//         }
//     }
//     return builder.build();
// }

export const EmptyMappings = new MappingsImpl(HashMap.empty(), "Empty");

export interface ClassMappings {
    mappedClassName: JavaClass
    // Key is method name stored as ${className}#{methodName}${descriptor}
    methods: HashMap<DescriptoredMethod, DescriptoredMethod>;
}
