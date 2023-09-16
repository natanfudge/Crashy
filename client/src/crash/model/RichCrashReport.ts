import {StringMap} from "./CrashReport";
import {JavaClass, SimpleMethod} from "./Mappable";
import FabricLogo from "../../media/fabric_logo.svg";
import ForgeLogo from "../../media/forge_logo.svg";
import MinecraftLogo from "../../media/minecraft_cube.svg";
import QuiltLogo from "../../media/quilt_logo.svg";

export interface RichCrashReport {
    rawText: string
    title?: string
    wittyComment?: string
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
    method: SimpleMethod
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
    javaVersion: string | undefined
    minecraftVersion: string | undefined
    loader: Loader
    time: Date
    operatingSystem: OperatingSystem | undefined
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
    Fabric, Forge, Vanilla, Quilt
}

export interface Loader {
    type: LoaderType
    version?: string
}

export function getLoaderName(type: LoaderType): string {
    switch (type){
        case LoaderType.Fabric:
            return "Fabric"
        case LoaderType.Forge:
            return "Forge"
        case LoaderType.Vanilla:
            return "Vanilla"
        case LoaderType.Quilt:
            return "Quilt"

    }
}

export function getLoaderLogo(type: LoaderType): string {
    switch (type) {
        case LoaderType.Fabric:
            return FabricLogo
        case LoaderType.Forge:
            return ForgeLogo;
        case LoaderType.Vanilla:
            return MinecraftLogo;
        case LoaderType.Quilt:
            return QuiltLogo
    }
}