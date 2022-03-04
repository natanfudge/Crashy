import { JavaClass, JavaMethod } from "./Mappable";
export interface MappingStrategy {
    mapMethod: (unmapped: JavaMethod) => JavaMethod;
    mapClass: (unmapped: JavaClass) => JavaClass;
}
