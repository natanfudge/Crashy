export function Foo() {
}

export interface CrashReport {
    description: string
    wittyComment: string
    time: string,
    sections: CrashReportSection[]
    stacktrace: StackTrace
    systemDetails: SystemDetails
}

export type StringMap = { [key: string]: string }
export interface SystemDetails {
    //TODO: pull out the modlist, make it handle multiline a bit better
    sections: StringMap;
}

export type StackTraceElement = string

export interface StackTrace {
    message: string
    causedBy?: StackTrace
    trace: StackTraceElement[]
}

export interface CrashReportSection {
    title: string
    details?: CrashReportSectionElement[]
    stacktrace?: StackTraceElement[]
    thread?: string
}

export interface CrashReportSectionElement {
    name: string
    detail: string
}