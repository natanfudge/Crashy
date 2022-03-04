import { StringMap } from "./CrashReport";
import { JavaClass, JavaMethod } from "./Mappable";
export interface RichCrashReport {
    rawText: string;
    title: string;
    wittyComment: string;
    context: CrashContext;
    stackTrace: RichStackTrace;
    deobfuscated: boolean;
    mods?: Mod[];
    sections: RichCrashReportSection[];
}
export interface RichCrashReportSection {
    name: string;
    details?: StringMap;
    stackTrace?: RichStackTraceElement[];
}
export interface Mod {
    id: string;
    name: string;
    version: string;
    isSuspected: boolean;
    forgeMetadata?: ForgeModMetadata;
}
export interface ForgeModMetadata {
    file: string;
    completeness: string;
    signature: string | "NOSIGNATURE";
}
export interface RichStackTrace {
    causedBy?: RichStackTrace;
    title: StackTraceMessage;
    elements: RichStackTraceElement[];
    details?: RichExceptionDetails;
}
export interface RichExceptionDetails {
    rawText: string;
    location: ExceptionLocation;
    reason: string;
    currentFrame: ExceptionFrame;
    bytecode: ExceptionBytecode;
    stackmapTable: ExceptionStackmapTable;
}
export declare type ExceptionBytecode = Record<string, string>;
export declare type ExceptionStackmapTable = Record<string, ExceptionStackmap>;
export interface ExceptionLocation {
    methodSignature: string;
    line: number;
    instruction: string;
}
export interface ExceptionFrame {
    /**
     * A single line, even a single Java statement, may translate to several bytecode instructions.
     * The byte code index tells you which bytecode instruction was executed.
     */
    byteCodeIndex: number;
    flags: string[];
    locals: string[];
    stack: string[];
}
export interface ExceptionStackmap {
    line: number;
    objects: string[][];
}
/**
 * Converts the recursive structure of the 'causedBy' of RichStackTraces into a list that is easily accessible by index.
 */
export declare function unfoldRichStackTrace(trace: RichStackTrace): RichStackTrace[];
export interface StackTraceMessage {
    class: JavaClass;
    message?: string;
}
export declare type RichStackTraceElement = number | FullRichStackTraceElement;
export declare type FullRichStackTraceElement = {
    method: JavaMethod;
    line: TraceLine;
    forgeMetadata?: ForgeTraceMetadata;
};
export interface ForgeTraceMetadata {
    jarFile?: string;
    version?: string;
    classloadingReasons: string[];
    pluginTransformerReasons: string[];
    additionalTransformerData: string[];
}
export interface TraceLine {
    file: string;
    number?: number;
}
export interface CrashContext {
    javaVersion: string;
    minecraftVersion: string;
    loader: Loader;
    time: Date;
    operatingSystem: OperatingSystem;
}
export declare enum OperatingSystemType {
    Windows = 0,
    Macos = 1,
    Linux = 2,
    Unknown = 3
}
export interface OperatingSystem {
    type: OperatingSystemType;
    name: string;
}
export declare enum LoaderType {
    Fabric = 0,
    Forge = 1,
    Vanilla = 2
}
export interface Loader {
    type: LoaderType;
    version?: string;
}
