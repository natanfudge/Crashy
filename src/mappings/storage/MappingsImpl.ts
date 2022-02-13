import {Lazy} from "../../utils/PromiseMemoryCache";
import {DescriptoredMethod, JavaClass, JavaMethod} from "crash-parser/src/model/Mappable";
import {ClassMappings} from "../Mappings";
import {Dict} from "../../utils/hashmap/HashMap";
type SingleDirectionMappingData = Dict<JavaClass, ClassMappings>
export class MappingsImpl {
    private readonly mappings: SingleDirectionMappingData

    // eslint-disable-next-line no-invalid-this
    private readonly mappingsReversed = new Lazy(() => reverseMappingData(this.mappings));

    constructor(mappings: SingleDirectionMappingData) {
        this.mappings = mappings;
    }



    private getMappings(reversed: boolean): SingleDirectionMappingData {
        return reversed ? this.mappingsReversed.get() : this.mappings;
    }

    mapClass(className: JavaClass, reverse: boolean): JavaClass {
        const maps = this.getMappings(reverse);
        return maps.get(className)?.mappedClassName ?? className;
    }

    mapSimpleMethod(methodName: JavaMethod, reverse: boolean): DescriptoredMethod {
        const classMappings = this.getMappings(reverse).get(methodName.classIn);
        if (classMappings !== undefined) {
            // Linear search is fine because we filter down only to the methods we use
            return classMappings.methods.linearSearch(unmapped => unmapped.method.equals(methodName))
                // If class is found but method is not - map just the class
                ?? methodName.withClass(classMappings.mappedClassName).withEmptyDescriptor()
        } else {
            // If the class name is not found - don't map this method. Mapping just by method name can create very incorrect results, e.g. if a method is called run
            // it would be remapped into something almost completely random.
            // Remapping without descriptor is ok because at worst case the wrong method is in the same class and has the same name.
            return methodName.withEmptyDescriptor();
        }
    }

    mapDescriptoredMethod(methodName: DescriptoredMethod, reverse: boolean): DescriptoredMethod {
        // Same logic as mapSimpleMethod when it comes to mapping / not mapping
        const classMappings = this.getMappings(reverse).get(methodName.method.classIn);
        if (classMappings !== undefined) {
            return classMappings?.methods.get(methodName) ?? methodName.withClass(classMappings.mappedClassName)
        } else {
            return methodName;
        }
    }
}

function reverseMappingData(data: SingleDirectionMappingData): SingleDirectionMappingData {
    return data.map(
        (_, mappings) => mappings.mappedClassName,
        (unmappedClass, mappings) => {
            const reversed: ClassMappings = {
                mappedClassName: unmappedClass,
                methods: mappings.methods.map(
                    (_, mappedName) => mappedName,
                    (unmappedName) => unmappedName
                )
            }
            return reversed
        }
    )
}
