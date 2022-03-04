import { JavaClass } from "../../crash/model/Mappable";
import { Mappings } from "./Mappings";
import { MappingsFilter } from "./MappingsFilter";
export declare class MappingsBuilder {
    private readonly classMappings;
    private readonly filter;
    private readonly methodsToAdd;
    constructor(filter: MappingsFilter);
    addClass(unmapped: string, mapped: string): JavaClass | undefined;
    addMethod(unmappedClassName: JavaClass, unmappedMethodName: string, unmappedDescriptor: string, mappedMethodName: string): void;
    remapDescriptor(descriptor: string): string;
    build(): Mappings;
}
