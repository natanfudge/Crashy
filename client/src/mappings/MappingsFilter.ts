import {
    AnyMappable,
    BasicMappable,
    DescriptoredMethod,
    isJavaMethod,
    JavaClass,
    JavaMethod
} from "../crash/model/Mappable";
import {HashSet} from "../fudge-commons/collections/hashmap/HashSet";
import {Lazy} from "../fudge-commons/collections/HelperClasses";


export interface MappingsFilter {
    needClass(javaClass: JavaClass): boolean

    needMethod(method: DescriptoredMethod): boolean

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
    needMethod(method: DescriptoredMethod): boolean {
        return true
    },
    needMethodByName(methodName: string): boolean {
        return true
    },
    usingReverse: false
}

export function mappingFilterForMappables(mappables: HashSet<AnyMappable>, reverse: boolean): MappingsFilter {
    // Calculate method names so we can check if we need individual method names
    const mappableMethodNames = new Lazy(
        () => mappables.filter(m => isJavaMethod(m)).map(m => (m as JavaMethod).getUnmappedMethodName())
    )
    return {
        needClass(javaClass: JavaClass): boolean {
            return mappables.contains(javaClass)
        },
        // we want: method_22979
        // (which is: func_228423_a_ )
        needMethod(descriptoredMethod: DescriptoredMethod): boolean {
            // return true
            return mappables.contains(descriptoredMethod) || mappables.contains(descriptoredMethod.method)
        },
        needMethodByName(methodName: string): boolean {
            return mappableMethodNames.get().contains(methodName)
        },
        usingReverse: reverse
    }
}
