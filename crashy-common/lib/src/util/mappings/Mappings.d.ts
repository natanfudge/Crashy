import { MappingsImpl } from "./MappingsImpl";
import { DescriptoredMethod, JavaClass, JavaMethod } from "../../crash/model/Mappable";
import { HashMap } from "../../collections/hashmap/HashMap";
export interface Mappings {
    mapClass(className: JavaClass, reverse: boolean): JavaClass;
    mapSimpleMethod(methodName: JavaMethod, reverse: boolean): DescriptoredMethod;
    mapDescriptoredMethod(methodName: DescriptoredMethod, reverse: boolean): DescriptoredMethod;
    serialize(): SerializedMappings;
}
export declare type SerializedMappings = Record<string, ClassMappingsEntry>;
export interface ClassMappingsEntry {
    c: string;
    m: MethodEntry[];
}
export declare type MethodEntry = [string, string, string];
export declare const EmptyMappings: MappingsImpl;
export interface ClassMappings {
    mappedClassName: JavaClass;
    methods: HashMap<DescriptoredMethod, DescriptoredMethod>;
}
