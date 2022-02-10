import {DescriptoredMethod, JavaClass, JavaMethod} from "crash-parser/src/model/Mappable";
import {HashMap, MutableDict} from "../../utils/hashmap/HashMap";
import {ClassMappings, Mappings} from "../Mappings";
import {MappingsImpl} from "./MappingsImpl";

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

export class MappingsBuilder {
    private readonly classMappings: MutableDict<JavaClass, JavaClass>
    private readonly filter: MappingsFilter

    private readonly methodsToAdd: { unmapped: DescriptoredMethod, mappedName: string }[] = [];

    constructor(filter: MappingsFilter) {
        this.classMappings = new HashMap(undefined)
        this.filter = filter;
    }

    // Returns undefined if this class's  methods are not needed (it's still put in the Dict for remapping)
    addClass(unmapped: string, mapped: string): JavaClass | undefined {
        const unmappedClass = new JavaClass(unmapped, true)
        const mappedClass = new JavaClass(mapped, true);
        this.classMappings.put(unmappedClass, mappedClass)

        return this.filter.needClass(this.filter.usingReverse ? mappedClass : unmappedClass) ? unmappedClass : undefined;
    }

    addMethod(unmappedClassName: JavaClass, unmappedMethodName: string, unmappedDescriptor: string, mappedMethodName: string) {
        const method = unmappedClassName.withMethod(unmappedMethodName)

        this.methodsToAdd.push({unmapped: method.withDescriptor(unmappedDescriptor), mappedName: mappedMethodName})
    }

    remapDescriptor(descriptor: string): string {
        return descriptor.replace(/L(.+?);/g, (match, p1) =>
            `L${this.classMappings.get(new JavaClass(p1, true))?.getUnmappedFullName()?.replace(/"."/g, "/") ?? p1};`
        );
    }

    build(): Mappings {
        const finalMappings = new HashMap<JavaClass, ClassMappings>(undefined)
        this.classMappings.forEach((unmapped, mapped) => {
            if (this.filter.needClass(this.filter.usingReverse ? mapped : unmapped)) {
                finalMappings.put(unmapped, {
                    mappedClassName: mapped,
                    methods: new HashMap(undefined)
                })
            }
        })
        // We only add the methods once we are done with everything, so we have all the classes ready for remapping method descriptors
        for (const {unmapped, mappedName} of this.methodsToAdd) {
            const classEntry = finalMappings.get(unmapped.method.classIn)
            if (classEntry === undefined) {
                throw new Error(`Class ${unmapped.method.classIn} not found in mappings`)
            }

            // Possible optimization: we don't need to store this remapped descriptor, we can only calculate it when we actually need it
            // based off of the class mappings
            const mapped = classEntry.mappedClassName.withDescMethod(mappedName, this.remapDescriptor(unmapped.descriptor));
            if (this.filter.needMethod(this.filter.usingReverse ? mapped.method : unmapped.method)) {
                classEntry.methods.put(unmapped, mapped)
            }

        }
        return new MappingsImpl(finalMappings);
    }
}
