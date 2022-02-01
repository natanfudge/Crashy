import {StringMap} from "./CrashReport";
import {MappingMethod} from "../../../src/mappings/MappingMethod";
import {ClassMethodSeperator} from "../../../src/mappings/providers/TinyMappings";
import {DescriptoredMethodName} from "../../../src/mappings/Mappings";
import {hashArray, hashString} from "../../../src/utils/hashmap/Hashing";

export interface RichCrashReport {
    rawText: string
    title: string
    wittyComment: string
    context: CrashContext
    stackTrace: RichStackTrace
    deobfuscated: boolean
    mods?: Mod[]
    sections: RichCrashReportSection[]
}

export interface RichCrashReportSection {
    name: string,
    details?: StringMap
    stackTrace?: RichStackTraceElement[]
}

export interface Mod {
    id: string
    name: string
    version: string
    isSuspected: boolean
    forgeMetadata?: ForgeModMetadata
}

export interface ForgeModMetadata {
    file: string
    completeness: string // IDK it just says DONE most of the time
    signature: string | "NOSIGNATURE"
}

export interface RichStackTrace {
    causedBy?: RichStackTrace
    title: StackTraceMessage
    elements: RichStackTraceElement[]
    details?: RichExceptionDetails
}

//TODO: see if there are other forms of 'exception details'
export interface RichExceptionDetails {
    rawText: string
    location: ExceptionLocation
    //TODO: NOTE: may contain class names that should be remapped
    reason: string
    currentFrame: ExceptionFrame
    bytecode: ExceptionBytecode
    stackmapTable: ExceptionStackmapTable
}

export  type ExceptionBytecode = Record<string, string>
export  type ExceptionStackmapTable = Record<string, ExceptionStackmap>

export interface ExceptionLocation {
    //TODO: potentially parse as a MethodSignature type if needed
    methodSignature: string
    line: number
    instruction: string
}

export interface ExceptionFrame {
    /**
     * A single line, even a single Java statement, may translate to several bytecode instructions.
     * The byte code index tells you which bytecode instruction was executed.
     */
    byteCodeIndex: number
    flags: string[]
    //TODO: NOTE: may contain class names that should be remapped
    locals: string[]
    //TODO: NOTE: may contain class names that should be remapped
    stack: string[]
}

export interface ExceptionStackmap {
    line: number
    objects: string[][]
}

/**
 * Converts the recursive structure of the 'causedBy' of RichStackTraces into a list that is easily accessible by index.
 */
export function unfoldRichStackTrace(trace: RichStackTrace): RichStackTrace[] {
    const causeList = [];
    let currentCauser: RichStackTrace | undefined = trace;
    while (currentCauser !== undefined) {
        causeList.push(currentCauser);
        currentCauser = currentCauser.causedBy;
    }
    return causeList;
}

export interface StackTraceMessage {
    class: JavaClass
    message?: string
}

export type RichStackTraceElement = number | FullRichStackTraceElement

export type FullRichStackTraceElement = {
    method: JavaMethod
    line: TraceLine
    forgeMetadata?: ForgeTraceMetadata
}

export interface ForgeTraceMetadata {
    jarFile?: string
    version?: string
    classloadingReasons: string[]
    pluginTransformerReasons: string[]
    additionalTransformerData: string[]
}

export interface TraceLine {
    file: string
    // Can be null in native methods
    number?: number
}

export class JavaMethod {
    classIn: JavaClass
    name: string

    constructor(classIn: JavaClass, name: string) {
        this.classIn = classIn;
        this.name = name;
    }

    simpleName(mappings: MappingMethod): string {
        const mapped = mappings.mapMethod(this)
        return mapped.classIn.simpleName + ClassMethodSeperator + mapped.name
    }

    fullName(mappings: MappingMethod): string {
        return mappings.mapMethod(this).fullUnmappedName();
    }

    withEmptyDescriptor(): DescriptoredMethodName {
        return {
            method: this,
            descriptor: ""
        }
    }

    fullUnmappedName(): string {
        return this.classIn.fullUnmappedName + ClassMethodSeperator + this.name;
    }

    equals(other: JavaMethod): boolean {
        return other.name === this.name && other.classIn.equals(this.classIn);
    }

    // hashCode(): number {
    //     return hashArray()
    // }

}
//TODO: disable
const EnableAssertions = true

export class JavaClass {
    // Stored in dot.qualified.names
    readonly fullUnmappedName: string
    private _packageName?: string
    private _simpleName?: string

    get packageName(): string {
        if (this._packageName === undefined) this.populatePackageSplit()
        return this._packageName!;
    }

    get simpleName(): string {
        if (this._simpleName === undefined) this.populatePackageSplit()
        return this._simpleName!;
    }

    private populatePackageSplit() {
        const [packageName, className] = this.fullUnmappedName.splitToTwoOnLast(".")
        this._packageName = packageName;
        this._simpleName = className;
    }

    constructor(fullName: string, slashSeperated: boolean) {
        if (EnableAssertions && fullName.includes("/") !== slashSeperated) {
            throw new Error("Unexpected slash/period when defined otherwise")
        }
        this.fullUnmappedName = slashSeperated ? fullName.replace(/\//g, ".") : fullName;
    }

    // constructor(packageName: string, simpleName: string) {
    //     this.packageName = packageName;
    //     this.simpleName = simpleName;
    // }


    fullName(mappings: MappingMethod) {
        return mappings.mapClass(this).fullUnmappedName;
    }

    // fullUnmappedName() {
    //     return this.packageName + "." + this.simpleName;
    // }

    equals(other: JavaClass) {
        return other.fullUnmappedName === this.fullUnmappedName;
    }

    // We have a lot of extra fields so we override hashCode()
    hashCode(): number {
        return hashString(this.fullUnmappedName)
    }
}


// export function javaClassFullName(javaClass: JavaClass, mappings: MappingMethod) {
//     return mappings.mapClass(javaClassFullUnmappedName(javaClass));
// }
//
// export function javaClassFullUnmappedName(javaClass: JavaClass) {
//     return javaClass.packageName + "." + javaClass.simpleName;
// }

// export function javaClassEquals(javaClassA: JavaClass)

// Mystery: net.minecraft.class_846$class_851$class_4578.method_22783 is not getting remapped
// SOLVED: method_22783 belongs to the superclass of class_4578 - class_4577.
// Temporary solution: remap class and method separately (problem: no simple method mappings)
// True solution: resolve that class_4577 is a superclass of class_4578 and that it should search there for a method_22783 method (add todo)

// Mystery: net.minecraft.class_6850#createRegion is not getting remapped.
// Obviously, createRegion is not an int name and therefore it wouldn't work.
// However, both a discord query and an intellij search show that method doesn't exist at all - yarn or otherwise.
// A solution would be to remap class separately, but I want to figure out what is going on.

// Add tests for both of these mysteries.

// TODO: Mappings are taking a lot of memory, which will increase once we have a map for simple method names as well.
// - Learn how to profile memory and find out if it truely takes a lot of memory.
//      - If we do need to optimize, consider only saving a small portion of mappings. After all, we are only remapping a few identifiers!
//      - Maybe do a scan of all Mappables in a crash report at the start? That wouldn't be too hard.
// - Find out other memory bottlenecks along the way.


//TODO: cache build getters for 1 day, cache mappings forever

// export function javaMethodSimpleName(javaMethod: JavaMethod, mappings: MappingMethod) {
//     return mappings.mapMethod(javaMethodFullUnmappedName(javaMethod)).removeBeforeLastExclusive(".")
// }
//
// export function javaMethodFullName(javaMethod: JavaMethod, mappings: MappingMethod) {
//     return mappings.mapMethod(javaMethodFullUnmappedName(javaMethod));
// }
//
// export function javaMethodFullUnmappedName(javaMethod: JavaMethod) {
//     return javaClassFullUnmappedName(javaMethod.classIn) + ClassMethodSeperator + javaMethod.name;
// }
// export function javaMethodEquals(javaMethodA: JavaMethod, javaMethodB: JavaMethod) {
//     return javacl
// }

export interface CrashContext {
    javaVersion: string
    minecraftVersion: string
    loader: Loader
    time: Date
    operatingSystem: OperatingSystem
}

export enum OperatingSystemType {
    Windows,
    Macos,
    Linux,
    Unknown
}

export interface OperatingSystem {
    type: OperatingSystemType
    name: string
}

export enum LoaderType {
    Fabric, Forge, Vanilla
}

export interface Loader {
    type: LoaderType
    version?: string
}
