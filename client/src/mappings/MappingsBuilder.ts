import {ClassMappings, Mappings} from "./Mappings";
import {MappingsImpl} from "./MappingsImpl";
import {MappingsFilter} from "./MappingsFilter";
import {DescriptoredMethod, JavaClass} from "../crash/model/Mappable";
import {HashMap, MutableDict} from "../fudge-lib/collections/hashmap/HashMap";

export class MappingsBuilder {
    private readonly classMappings: MutableDict<JavaClass, JavaClass>
    private readonly filter: MappingsFilter
    // For debugging
    private readonly id: string;

    private readonly methodsToAdd: { unmapped: DescriptoredMethod, mappedName: string }[] = [];

    constructor(filter: MappingsFilter, id: string) {
        this.classMappings = new HashMap(undefined)
        this.filter = filter;
        this.id = id;
    }

    // Returns undefined if this class's  methods are not needed (it's still put in the Dict for remapping)
    addClass(unmapped: string, mapped: string): JavaClass | undefined {
        if (unmapped === undefined) throw new Error("Unmapped name must not be undefined")
        if (mapped === undefined) throw new Error("mapped name must not be undefined")
        const unmappedClass = new JavaClass(unmapped, true)
        const mappedClass = new JavaClass(mapped, true);
        this.classMappings.put(unmappedClass, mappedClass)

        return this.filter.needClass( mappedClass) || this.filter.needClass(unmappedClass) ? unmappedClass : undefined;
    }

    addMethod(unmappedClassName: JavaClass, unmappedMethodName: string, unmappedDescriptor: string, mappedMethodName: string) {
        const method = unmappedClassName.withMethod(unmappedMethodName)

        this.methodsToAdd.push({unmapped: method.withDescriptor(unmappedDescriptor), mappedName: mappedMethodName})
    }

    remapDescriptor(descriptor: string): string {
        return descriptor.replace(/L(.+?);/g, (match, p1: string) => {
            const remapped = this.classMappings.get(new JavaClass(p1, true))
                ?.getUnmappedFullClassName()?.replaceAll(".", "/") ?? p1
            return `L${remapped};`
        });
    }

    build(): Mappings {
        const finalMappings = new HashMap<JavaClass, ClassMappings>(undefined)
        this.classMappings.forEach((unmapped, mapped) => {
            if (this.filter.needClass(mapped) || this.filter.needClass(unmapped)) {
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
                throw new Error(`Class ${unmapped.method.classIn.toString()} not found in mappings`)
            }

            // Possible optimization: we don't need to store this remapped descriptor, we can only calculate it when we actually need it
            // based off of the class mappings
            const mapped = classEntry.mappedClassName.withDescMethod(mappedName, this.remapDescriptor(unmapped.descriptor));
            if (this.filter.needMethod(mapped) || this.filter.needMethod(unmapped)) {
                classEntry.methods.put(unmapped, mapped)
            }

        }
        return new MappingsImpl(finalMappings, this.id);
    }
}
