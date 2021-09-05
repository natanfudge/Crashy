
export interface CrashReport {
    description: string
    wittyComment: string
    time: string,
    sections: CrashReportSection[]
    stacktrace: StackTrace
    // systemDetails: SystemDetails
}

export type StringMap = { [key: string]: string }

export interface SystemDetails {
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
    details?: StringMap
    stacktrace?: StackTraceElement[]
    thread?: string
}

// export interface CrashReportSectionElement {
//     name: string
//     detail: string
// }

