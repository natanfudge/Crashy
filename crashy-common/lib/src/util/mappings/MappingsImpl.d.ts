import { ClassMappings, Mappings, SerializedMappings } from "./Mappings";
import { DescriptoredMethod, JavaClass, JavaMethod } from "../../crash/model/Mappable";
import { Dict } from "../../collections/hashmap/HashMap";
declare type SingleDirectionMappingData = Dict<JavaClass, ClassMappings>;
export declare class MappingsImpl implements Mappings {
    private readonly mappings;
    private readonly mappingsReversed;
    constructor(mappings: SingleDirectionMappingData);
    serialize(): SerializedMappings;
    private getMappings;
    mapClass(className: JavaClass, reverse: boolean): JavaClass;
    mapSimpleMethod(methodName: JavaMethod, reverse: boolean): DescriptoredMethod;
    mapDescriptoredMethod(methodName: DescriptoredMethod, reverse: boolean): DescriptoredMethod;
}
export {};
