import {MappingsImpl} from "./MappingsImpl";
import {DescriptoredMethod, JavaClass, JavaMethod} from "../../model/Mappable";
import { HashMap } from "./HashMap";

export interface Mappings {
    mapClass(className: JavaClass, reverse: boolean): JavaClass

    mapSimpleMethod(methodName: JavaMethod, reverse: boolean): DescriptoredMethod

    mapDescriptoredMethod(methodName: DescriptoredMethod, reverse: boolean): DescriptoredMethod

    serialize(): SerializedMappings
}

export interface SerializedMappings {

}
function deserializeMappings(serialized: SerializedMappings): Mappings {
    throw new Error("TODO")
}

export const EmptyMappings = new MappingsImpl(HashMap.empty());

export interface ClassMappings {
    mappedClassName: JavaClass
    // Key is method name stored as ${className}#{methodName}${descriptor}
    methods: HashMap<DescriptoredMethod, DescriptoredMethod>;
}
