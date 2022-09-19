import {BasicMappable, JavaClass, JavaMethod} from "../crash/model/Mappable";
import {HashSet} from "../fudge-commons/collections/hashmap/HashSet";


export interface MappingsFilter {
    needClass(javaClass: JavaClass): boolean

    needMethod(method: JavaMethod): boolean

    usingReverse: boolean
}

export const AllowAllMappings: MappingsFilter = {
    needClass(name: JavaClass): boolean {
        return true
    },
    needMethod(method: JavaMethod): boolean {
        return true
    },
    usingReverse: false
}

export function mappingFilterForMappables(mappables: HashSet<BasicMappable>, reverse: boolean): MappingsFilter {
    return {
        needClass(javaClass: JavaClass): boolean {
            return mappables.contains(javaClass)
        },
        needMethod(method: JavaMethod): boolean {
            return mappables.contains(method)
        },
        usingReverse: reverse
    }
}
