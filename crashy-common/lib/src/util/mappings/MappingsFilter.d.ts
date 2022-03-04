import { BasicMappable, JavaClass, JavaMethod } from "../../crash/model/Mappable";
import { HashSet } from "../../collections/hashmap/HashSet";
export interface MappingsFilter {
    needClass(javaClass: JavaClass): boolean;
    needMethod(method: JavaMethod): boolean;
    usingReverse: boolean;
}
export declare const AllowAllMappings: MappingsFilter;
export declare function mappingFilterForMappables(mappables: HashSet<BasicMappable>, reverse: boolean): MappingsFilter;
