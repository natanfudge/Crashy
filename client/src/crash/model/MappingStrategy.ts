import {JavaClass, SimpleMethod} from "./Mappable";

export interface MappingStrategy {
    mapMethod: (unmapped: SimpleMethod) => SimpleMethod
    mapClass: (unmapped: JavaClass) => JavaClass
}
