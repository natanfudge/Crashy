export function Foo() {
}

export interface CrashReport {
    description: String
    wittyComment: String
    time: String,
    sections: CrashReportSection[]
    stacktrace: StackTrace
    systemDetails: SystemDetails
}

export interface SystemDetails {
    //TODO: pull out the modlist, make it handle multiline a bit better
    sections: { [key: string]: string };
}

export type StackTraceElement = String

export interface StackTrace {
    message: String
    children: StackTrace[]
    trace: StackTraceElement[]
}

export interface CrashReportSection {
    title: String
    elements: CrashReportSectionElement[]
    stacktrace?: StackTraceElement[]
}

export interface CrashReportSectionElement {
    name: String
    detail: String
}