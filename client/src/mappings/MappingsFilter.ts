import {BasicMappable, isJavaMethod, JavaClass, JavaMethod} from "../crash/model/Mappable";
import {HashSet} from "../fudge-commons/collections/hashmap/HashSet";
import {Lazy} from "../fudge-commons/collections/HelperClasses";


export interface MappingsFilter {
    needClass(javaClass: JavaClass): boolean

    needMethod(method: JavaMethod): boolean

    /**
     * Some formats only provide the method name so we need to be able to filter by method name only
     */
    needMethodByName(methodName: string): boolean

    usingReverse: boolean
}

export const AllowAllMappings: MappingsFilter = {
    needClass(name: JavaClass): boolean {
        return true
    },
    needMethod(method: JavaMethod): boolean {
        return true
    },
    needMethodByName(methodName: string): boolean {
        return true
    },
    usingReverse: false
}

export function mappingFilterForMappables(mappables: HashSet<BasicMappable>, reverse: boolean): MappingsFilter {
    // Calculate method names so we can check if we need individual method names
    const mappableMethodNames = new Lazy(
        () => mappables.filter(m => isJavaMethod(m)).map(m => (m as JavaMethod).getUnmappedMethodName())
    )
    return {
        needClass(javaClass: JavaClass): boolean {
            return mappables.contains(javaClass)
        },
        needMethod(method: JavaMethod): boolean {
            return mappables.contains(method)
        },
        needMethodByName(methodName: string): boolean {
            return mappableMethodNames.get().contains(methodName)
        },
        usingReverse: reverse
    }
}
