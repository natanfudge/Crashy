import {MappingStrategy} from "../../../src/mappings/resolve/MappingStrategy";
import {hashString} from "../../../src/utils/hashmap/Hashing";
import {ClassMethodSeperator} from "../../../src/mappings/providers/TinyMappings";
import {Mappings} from "../../../src/mappings/Mappings";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyMappable = Mappable<any>
// These are the mappables that appear in a crash report
export type BasicMappable = JavaClass | JavaMethod

export interface Mappable<To extends AnyMappable> {
    remap(mappings: Mappings, reverse: boolean): To
}

const EnableAssertions = false;

export class JavaClass implements Mappable<JavaClass> {
    // Stored in dot.qualified.format
    private readonly _fullUnmappedName: string
    private _packageName?: string
    private _simpleName?: string

    constructor(fullName: string, slashSeperated: boolean) {
        if (EnableAssertions && ((fullName.includes("/") && !slashSeperated) || (fullName.includes(".") && slashSeperated)) && (!fullName.startsWith("java.base"))) {
            throw new Error("Unexpected slash/period when defined otherwise")
        }
        this._fullUnmappedName = slashSeperated ? fullName.replace(/\//g, ".") : fullName;
    }

    static dotSeperated(fullName: string) {
        return new JavaClass(fullName, false)
    }
    static slashSeperated(fullName: string) {
        return new JavaClass(fullName, true)
    }

     getUnmappedFullName() {
        return this._fullUnmappedName;
    }

    fullName(mappings: MappingStrategy) {
        return mappings.mapClass(this)._fullUnmappedName;
    }

    getUnmappedPackageName(): string {
        if (this._packageName === undefined) this.populatePackageSplit()
        return this._packageName!;
    }

    getUnmappedSimpleName(): string {
        if (this._simpleName === undefined) this.populatePackageSplit()
        return this._simpleName!;
    }

    simpleName(mappings: MappingStrategy){
        return mappings.mapClass(this).getUnmappedSimpleName();
    }

    withMethod(methodName: string): JavaMethod {
        return new JavaMethod(this, methodName)
    }

    withDescMethod(methodName: string, descriptor: string): DescriptoredMethod {
        return new JavaMethod(this, methodName).withDescriptor(descriptor)
    }

    private populatePackageSplit() {
        const split = this._fullUnmappedName.splitToTwoOnLast(".")
        if (split === undefined) {
            this._packageName = "";
            this._simpleName = this._fullUnmappedName;
        } else {
            this._packageName = split[0]
            this._simpleName = split[1]
        }
    }

    remap(mappings: Mappings, reverse: boolean): JavaClass {
        return mappings.mapClass(this, reverse)
    }

    equals(other: JavaClass) {
        return other._fullUnmappedName === this._fullUnmappedName;
    }

    // We have a lot of extra fields so we override hashCode()
    hashCode(): number {
        return hashString(this._fullUnmappedName)
    }

    toString() {
        return this._fullUnmappedName;
    }
}

/**
 * Full Name: package.class#method
 * Simple Name: class#method
 * Method Name: method
 */
export class JavaMethod implements Mappable<DescriptoredMethod> {
    readonly classIn: JavaClass
    private readonly _name: string

    constructor(classIn: JavaClass, name: string) {
        this.classIn = classIn;
        this._name = name;
    }

    static dotSeperated(classIn: string, name: string) {
        return new JavaMethod(JavaClass.dotSeperated(classIn), name)
    }

    getUnmappedMethodName() : string {
        return this._name;
    }

    simpleName(mappings: MappingStrategy): string {
        const mapped = mappings.mapMethod(this)
        return mapped.classIn.getUnmappedSimpleName() + ClassMethodSeperator + mapped.getUnmappedMethodName()
    }

    getUnmappedFullName(): string {
        return this.classIn.getUnmappedFullName() + ClassMethodSeperator + this.getUnmappedMethodName();
    }

    fullName(mappings: MappingStrategy): string {
        return mappings.mapMethod(this).getUnmappedFullName();
    }

    withEmptyDescriptor(): DescriptoredMethod {
        return new DescriptoredMethod(this, "")
    }

    withDescriptor(desc: string): DescriptoredMethod {
        return new DescriptoredMethod(this, desc)
    }

    withClass(classIn: JavaClass): JavaMethod {
        return new JavaMethod(classIn, this.getUnmappedMethodName())
    }


    remap(mappings: Mappings, reverse: boolean): DescriptoredMethod {
        return mappings.mapSimpleMethod(this, reverse);
    }

    equals(other: JavaMethod): boolean {
        return other.getUnmappedMethodName() === this.getUnmappedMethodName() && other.classIn.equals(this.classIn);
    }

    toString() {
        return this.getUnmappedFullName();
    }
}

export class DescriptoredMethod implements Mappable<DescriptoredMethod> {
    method: JavaMethod;
    descriptor: string;

    constructor(method: JavaMethod, descriptor: string) {
        this.method = method;
        this.descriptor = descriptor;
    }

    withClass(classIn: JavaClass): DescriptoredMethod {
        return new DescriptoredMethod(this.method.withClass(classIn), this.descriptor)
    }

    remap(mappings: Mappings, reverse: boolean): DescriptoredMethod {
        return mappings.mapDescriptoredMethod(this, reverse);
    }
}
