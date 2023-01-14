import {StringMap} from "./CrashReport";
import {JavaClass, JavaMethod} from "./Mappable";

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
