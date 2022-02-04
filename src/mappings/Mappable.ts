import {Mappings} from "./Mappings";
import {MappingMethod} from "./MappingMethod";
import {hashString} from "../utils/hashmap/Hashing";
import {ClassMethodSeperator} from "./providers/TinyMappings";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyMappable = Mappable<any>
// These are the mappables that appear in a crash report
export type BasicMappable = JavaClass | JavaMethod

export interface Mappable<To extends AnyMappable> {
    remap(mappings: Mappings, reverse: boolean): To
}

const EnableAssertions = false;

export class JavaClass implements Mappable<JavaClass> {
    remap(mappings: Mappings, reverse: boolean): JavaClass {
        return mappings.mapClass(this, reverse)
    }

    // Stored in dot.qualified.names
    private readonly _fullUnmappedName: string
    private _packageName?: string
    private _simpleName?: string


    get fullUnmappedName() {
        return this._fullUnmappedName;
    }

    getPackageName(): string {
        if (this._packageName === undefined) this.populatePackageSplit()
        return this._packageName!;
    }

    getSimpleName(): string {
        if (this._simpleName === undefined) this.populatePackageSplit()
        return this._simpleName!;
    }

    method(methodName: string): JavaMethod {
        return new JavaMethod(this, methodName)
    }

    descriptoredMethod(methodName: string, descriptor: string): DescriptoredMethod {
        return new JavaMethod(this, methodName).withDescriptor(descriptor)
    }

    private populatePackageSplit() {
        const split = this.fullUnmappedName.splitToTwoOnLast(".")
        if (split === undefined) {
            this._packageName = "";
            this._simpleName = this.fullUnmappedName;
        } else {
            this._packageName = split[0]
            this._simpleName = split[1]
        }
    }

    constructor(fullName: string, slashSeperated: boolean) {
        if (EnableAssertions && ((fullName.includes("/") && !slashSeperated) || (fullName.includes(".") && slashSeperated)) && (!fullName.startsWith("java.base"))) {
            throw new Error("Unexpected slash/period when defined otherwise")
        }
        this._fullUnmappedName = slashSeperated ? fullName.replace(/\//g, ".") : fullName;
    }

    static dotSeperated(fullName: string) {
        return new JavaClass(fullName, false)
    }

    fullName(mappings: MappingMethod) {
        return mappings.mapClass(this).fullUnmappedName;
    }

    equals(other: JavaClass) {
        return other.fullUnmappedName === this.fullUnmappedName;
    }

    // We have a lot of extra fields so we override hashCode()
    hashCode(): number {
        return hashString(this.fullUnmappedName)
    }
}

export class JavaMethod implements Mappable<DescriptoredMethod> {
    classIn: JavaClass
    name: string

    constructor(classIn: JavaClass, name: string) {
        this.classIn = classIn;
        this.name = name;
    }

    remap(mappings: Mappings, reverse: boolean): DescriptoredMethod {
        return mappings.mapSimpleMethod(this, reverse);
    }

    static dotSeperated(classIn: string, name: string) {
        return new JavaMethod(JavaClass.dotSeperated(classIn), name)
    }

    simpleName(mappings: MappingMethod): string {
        const mapped = mappings.mapMethod(this)
        return mapped.classIn.getSimpleName() + ClassMethodSeperator + mapped.name
    }

    fullName(mappings: MappingMethod): string {
        return mappings.mapMethod(this).fullUnmappedName();
    }

    withEmptyDescriptor(): DescriptoredMethod {
        return new DescriptoredMethod(this, "")
    }

    withDescriptor(desc: string): DescriptoredMethod {
        return new DescriptoredMethod(this, desc)
    }

    withClass(classIn: JavaClass): JavaMethod {
        return new JavaMethod(classIn, this.name)
    }

    fullUnmappedName(): string {
        return this.classIn.fullUnmappedName + ClassMethodSeperator + this.name;
    }

    equals(other: JavaMethod): boolean {
        return other.name === this.name && other.classIn.equals(this.classIn);
    }
}

export class DescriptoredMethod implements Mappable<DescriptoredMethod> {
    method: JavaMethod;
    descriptor: string;

    constructor(method: JavaMethod, descriptor: string) {
        this.method = method;
        this.descriptor = descriptor;
    }

    remap(mappings: Mappings, reverse: boolean): DescriptoredMethod {
        return mappings.mapDescriptoredMethod(this, reverse);
    }
}