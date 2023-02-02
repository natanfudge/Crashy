import {ClassMappings, Mappings, SerializedMappings} from "./Mappings";
import {Lazy} from "../fudge-commons/collections/HelperClasses";
import {DescriptoredMethod, JavaClass, SimpleMethod} from "../crash/model/Mappable";
import {Dict} from "../fudge-commons/collections/hashmap/HashMap";

type SingleDirectionMappingData = Dict<JavaClass, ClassMappings>

export class MappingsImpl implements Mappings {
    // For debugging
    private readonly id: string;
    private readonly mappings: SingleDirectionMappingData

    // eslint-disable-next-line no-invalid-this
    private readonly mappingsReversed = new Lazy(() => reverseMappingData(this.mappings));

    constructor(mappings: SingleDirectionMappingData, id: string) {
        this.mappings = mappings;
        this.id = id;
    }

    serialize(): SerializedMappings {
        return this.mappings.toRecord(unmappedClass => unmappedClass.getUnmappedFullClassName(),
            (_, {mappedClassName, methods}) => ({
                c: mappedClassName.getUnmappedFullClassName(),
                m: methods.toArray((unmappedMethod, mappedMethod) =>{
                    const unmapped = unmappedMethod.method.getUnmappedMethodName();
                    const mapped = mappedMethod.method.getUnmappedMethodName();
                    const unmappedDescriptor = unmappedMethod.descriptor;
                    // Unmapped, mapped, unmapped descriptor
                    return [unmapped, mapped, unmappedDescriptor]
                } )
            })
        )
    }

    private getMappings(reversed: boolean): SingleDirectionMappingData {
        return reversed ? this.mappingsReversed.get() : this.mappings;
    }

    mapClass(className: JavaClass, reverse: boolean): JavaClass {
        const maps = this.getMappings(reverse);
        return maps.get(className)?.mappedClassName ?? className;
    }
    // reverse: srg class + srg descriptor -> obf class + obf descriptor
    // Not reverse: obf class + obf descriptor -> srg class + srg descriptor

    mapSimpleMethod(methodName: SimpleMethod, reverse: boolean): DescriptoredMethod {
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
                // obf class + desc -> srg class + desc
                methods: mappings.methods.map(
                    (_, mappedName) => mappedName,
                    (unmappedName) => unmappedName
                )
            }
            return reversed
        }
    )
}

