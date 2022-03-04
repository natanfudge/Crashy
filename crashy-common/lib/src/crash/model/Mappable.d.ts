import { Mappings } from "../../util/mappings/Mappings";
import { MappingStrategy } from "./MappingStrategy";
export declare type AnyMappable = Mappable<any>;
export declare type BasicMappable = JavaClass | JavaMethod;
export interface Mappable<To extends AnyMappable> {
    remap(mappings: Mappings, reverse: boolean): To;
}
export declare type JavaClassJsObject = {
    packageName: string;
    simpleName: string;
};
export declare class JavaClass implements Mappable<JavaClass> {
    private readonly _fullUnmappedName;
    private _packageName?;
    private _simpleName?;
    constructor(fullName: string, slashSeperated: boolean);
    static dotSeperated(fullName: string): JavaClass;
    static slashSeperated(fullName: string): JavaClass;
    static dotSeperatedObject(obj: JavaClassJsObject): JavaClass;
    getUnmappedFullName(): string;
    fullName(mappings: MappingStrategy): string;
    getUnmappedPackageName(): string;
    getUnmappedSimpleName(): string;
    simpleName(mappings: MappingStrategy): string;
    withMethod(methodName: string): JavaMethod;
    withDescMethod(methodName: string, descriptor: string): DescriptoredMethod;
    private populatePackageSplit;
    remap(mappings: Mappings, reverse: boolean): JavaClass;
    equals(other: JavaClass): boolean;
    hashCode(): number;
    toString(): string;
}
/**
 * Full Name: package.class#method
 * Simple Name: class#method
 * Method Name: method
 */
export declare class JavaMethod implements Mappable<DescriptoredMethod> {
    readonly classIn: JavaClass;
    private readonly _name;
    constructor(classIn: JavaClass, name: string);
    static dotSeperated(classIn: string, name: string): JavaMethod;
    static dotSeperatedObject(obj: {
        name: string;
        classIn: JavaClassJsObject;
    }): JavaMethod;
    static parse(methodDotSeperated: string): JavaMethod;
    getUnmappedMethodName(): string;
    simpleName(mappings: MappingStrategy): string;
    getUnmappedFullName(): string;
    fullName(mappings: MappingStrategy): string;
    withEmptyDescriptor(): DescriptoredMethod;
    withDescriptor(desc: string): DescriptoredMethod;
    withClass(classIn: JavaClass): JavaMethod;
    remap(mappings: Mappings, reverse: boolean): DescriptoredMethod;
    equals(other: JavaMethod): boolean;
    toString(): string;
}
export declare class DescriptoredMethod implements Mappable<DescriptoredMethod> {
    method: JavaMethod;
    descriptor: string;
    constructor(method: JavaMethod, descriptor: string);
    static parse(dotQualifiedMethod: string): DescriptoredMethod;
    getUnmappedFullName(): string;
    toString(): string;
    withClass(classIn: JavaClass): DescriptoredMethod;
    remap(mappings: Mappings, reverse: boolean): DescriptoredMethod;
}
