import {MappingsNamespace} from "../MappingsNamespace";


export abstract class AbstractData {
    // readonly classMappings: ClassMappings;
    readonly obfName: string;
    readonly mappings: string[] = [];
    readonly comments: Map<MappingsNamespace, string> = new Map();

    protected constructor(/*classMappings: ClassMappings,*/ obfName: string) {
        // this.classMappings = classMappings;
        this.obfName = obfName;
    }

    addMapping(name: string/*, comment?: string*/) {
        // if (mappingType === "Official") {
        //     throw new Error("Tried to change obf name!");
        // }
        this.mappings.push(name)
        // if (comment)
        //     this.comments.set(mappingType, comment);
    }

    // getMapping(mappingType: MappingsNamespace) {
    //     if (mappingType === "Official") {
    //         return this.obfName;
    //     }
    //     return this.mappings.get(mappingType) ?? "-";
    // }

    // getMappingWithFallback(mappingType: MappingsNamespace, fallbackMappingType: MappingsNamespace) {
    //     if (mappingType === "Official") {
    //         return this.obfName;
    //     }
    //     let mapping = this.mappings.get(mappingType);
    //     if (!mapping) {
    //         if (fallbackMappingType === "Official") {
    //             return this.obfName;
    //         }
    //         mapping = this.mappings.get(fallbackMappingType);
    //     }
    //     return mapping ?? "-";
    // }

    // getMappingWithDoubleFallback(mappingType: MappingsNamespace, fallbackMappingType: MappingsNamespace, fallback2MappingType: MappingsNamespace) {
    //     if (mappingType === "Official") {
    //         return this.obfName;
    //     }
    //     let mapping = this.mappings.get(mappingType);
    //     if (!mapping) {
    //         if (fallbackMappingType === "Official") {
    //             return this.obfName;
    //         }
    //         mapping = this.mappings.get(fallbackMappingType);
    //     }
    //     if (!mapping) {
    //         if (fallback2MappingType === "Official") {
    //             return this.obfName;
    //         }
    //         mapping = this.mappings.get(fallback2MappingType);
    //     }
    //     return mapping ?? "-";
    // }

    getComment(mappingType: MappingsNamespace) {
        return this.comments.get(mappingType);
    }

}

export abstract class ClassItem extends AbstractData {
    // protected obfDesc: string | null;
    protected readonly descriptors: Map<MappingsNamespace, string> = new Map();

    constructor(/*classMappings: ClassMappings, */obfName: string/*, obfDesc: string | null*/) {
        super(/*classMappings,*/ obfName);
        // this.obfDesc = obfDesc;
    }

    // transformDescriptor(mappingType: MappingsNamespace): string | null {
    //     if (this.obfDesc == null) return null;
    //     if (mappingType === "Official") {
    //         return this.obfDesc;
    //     }
    //     return this.obfDesc.replace(/L(.+?);/g, (match, p1) => {
    //         return `L${this.classMappings.classes.get(p1)?.mappings.get(mappingType) ?? p1};`;
    //     });
    // }

    // transformDescriptorWithFallback(mappingType: MappingsNamespace, fallbackMappingType: MappingsNamespace): string | null {
    //     if (this.obfDesc == null) return null;
    //     if ("Official" == mappingType) {
    //         return this.obfDesc;
    //     }
    //     return this.obfDesc.replace(/L(.+?);/g, (match, p1) => {
    //         const clz = this.classMappings.classes.get(p1);
    //         const mapped = clz?.getMappingWithFallback(mappingType, fallbackMappingType);
    //         return `L${!mapped || mapped == "-" || !mapped ? p1 : mapped};`;
    //     });
    // }

    // transformDescriptorWithDoubleFallback(mappingType: MappingsNamespace, fallbackMappingType: MappingsNamespace, fallback2MappingType: MappingsNamespace): string | null {
    //     if (this.obfDesc == null) return null;
    //     if ("Official" == mappingType) {
    //         return this.obfDesc;
    //     }
    //     return this.obfDesc.replace(/L(.+?);/g, (match, p1) => {
    //         const clz = this.classMappings.classes.get(p1);
    //         const mapped = clz?.getMappingWithDoubleFallback(mappingType, fallbackMappingType, fallback2MappingType);
    //         return `L${mapped == "-" || !mapped ? p1 : mapped};`;
    //     });
    // }

    setDescriptor(mappingType: MappingsNamespace, desc: string | null) {
        // if (mappingType === "Official") {
        //     if (this.obfDesc != null) throw new Error("Tried to change obf descriptor!");
        //     else this.obfDesc = desc;
        //     return
        // }
        if (desc == null) {
            return;
        }
        this.descriptors.set(mappingType, desc);
    }

    // getDescriptor(mappingType: MappingsNamespace) {
    //     if (mappingType === "Official") {
    //         return this.obfDesc;
    //     }
    //     if (!this.descriptors.has(mappingType)) {
    //         const newDesc = this.transformDescriptor(mappingType);
    //         if (newDesc) {
    //             this.descriptors.set(mappingType, newDesc);
    //         }
    //         return newDesc;
    //     }
    //     return this.descriptors.get(mappingType);
    // }

    abstract getKey(): string;
}

export class ClassData extends AbstractData {
    fields: Map<string, FieldData> = new Map();
    methods: Map<string, MethodData> = new Map();

    constructor(/*mappings: ClassMappings,*/ obfName: string) {
        super(/*mappings,*/ obfName);
    }

    // getOrAddField(field_name: string, field_desc: string | null, mapping: MappingsNamespace): FieldData | null {
    //     if (mapping === "Official" && this.fields.has(field_name)) {
    //         const field = this.fields.get(field_name);
    //         if (field?.getDescriptor("Official") == null) {
    //             field?.setDescriptor("Official", this.classMappings.reverseTransformDesc(field_desc, mapping));
    //         }
    //         return field ?? null;
    //     }
    //     for (const field of this.fields.values()) {
    //         if (field.getMapping(mapping) === field_name || field.getMapping("Official") === field_name) {
    //             if (field.getDescriptor("Official") == null) {
    //                 field.setDescriptor("Official", this.classMappings.reverseTransformDesc(field_desc, mapping));
    //             }
    //             return field;
    //         }
    //     }
    //     const obfDesc = this.classMappings.reverseTransformDesc(field_desc, mapping);
    //     if (mapping != "Official") console.log(`adding ${this.obfName};${field_name}:${obfDesc}`)
    //     const fd = new FieldData(this.classMappings, field_name, obfDesc);
    //     this.fields.set(fd.getKey(), fd);
    //     return fd;
    // }

    getOrAddMethod(method_name: string,/* method_desc: string,*/): MethodData | null {
        // if (mapping === "Official" && this.methods.has(method_name + method_desc)) {
        //     return this.methods.get(method_name + method_desc) ?? null;
        // }
        // for (const method of this.methods.values()) {
        //     if ((method.getMapping(mapping) === method_name || method.getMapping("Official") === method_name) && method.getDescriptor(mapping) === method_desc) {
        //         return method;
        //     }
        // }
        // const obfDesc = this.classMappings.reverseTransformDesc(method_desc, mapping);
        // if (mapping != "Official") console.log(`adding ${this.obfName};${method_name}${obfDesc}`)
        const fd = new MethodData(/*this.classMappings,*/ method_name/*, obfDesc*/);
        this.methods.set(fd.getKey(), fd);
        return fd;
    }
}

export class MethodData extends ClassItem {
    readonly params: Map<MappingsNamespace, Map<number, string>> = new Map();

    getKey(): string {
        return this.obfName /*+ this.obfDesc*/;
    }

}

export class FieldData extends ClassItem {

    getKey(): string {
        return this.obfName;
    }
}
