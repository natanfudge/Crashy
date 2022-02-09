import {DescriptoredMethod, JavaClass, JavaMethod} from "crash-parser/src/model/Mappable";
import {HashMap} from "../utils/hashmap/HashMap";
import {MappingsImpl} from "./storage/MappingsImpl";

export interface Mappings {
    mapClass(className: JavaClass, reverse: boolean): JavaClass

    mapSimpleMethod(methodName: JavaMethod, reverse: boolean): DescriptoredMethod

    mapDescriptoredMethod(methodName: DescriptoredMethod, reverse: boolean): DescriptoredMethod
}

export const EmptyMappings = new MappingsImpl(HashMap.empty());

export interface ClassMappings {
    mappedClassName: JavaClass
    // Key is method name stored as ${className}#{methodName}${descriptor}
    methods: HashMap<DescriptoredMethod, DescriptoredMethod>;
}
