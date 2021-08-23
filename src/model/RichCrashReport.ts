import {StringMap} from "./CrashReport";

export interface RichCrashReport {
    title: string
    wittyComment: string
    context: CrashContext
    stackTrace: RichStackTrace
    mods: Mod[]
    suspectedMods: Mod[]
    sections: RichCrashReportSection[]
}

export interface RichCrashReportSection {
    name: string,
    details: StringMap
    stackTrace: RichStackTraceElement[]
    thread: string
}

export interface Mod {
    id: string
    name: string
    version: string
    forgeMetadata?: ForgeModMetadata
}

export interface ForgeModMetadata {
    file: string
    completeness: string // IDK it just says DONE most of the time
    signature: string | "NOSIGNATURE"
}

export interface RichStackTrace {
    causedBy?: RichStackTrace
    message: StackTraceMessage
    elements: RichStackTraceElement[]
}

export interface StackTraceMessage {
    class: JavaClass
    message: string
}

export interface RichStackTraceElement {
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
    number: number
}

export interface JavaMethod {
    class: JavaClass
    name: string
}

export interface JavaClass {
    packageName: string
    simpleName: string
}

export function javaClassFullName(javaClass: JavaClass) {
    return javaClass.packageName + "." + javaClass.simpleName;
}

export function javaMethodSimpleName(javaMethod: JavaMethod) {
    return javaMethod.class.simpleName + "." + javaMethod.name;
}

export function javaMethodFullNameName(javaMethod: JavaMethod) {
    return javaClassFullName(javaMethod.class) + "." + javaMethod.name;
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
    Fabric, Forge
}

export interface Loader {
    type: LoaderType
    version: string
}
