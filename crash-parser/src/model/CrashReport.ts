
export interface CrashReport {
    raw: string
    description: string
    wittyComment: string
    time: string,
    sections: CrashReportSection[]
    stacktrace: StackTrace
}

export type StringMap = Record<string, string>

export type StackTraceElement = string
export type ExceptionDetails = Record<string,string[]>
export interface StackTrace {
    message: string
    causedBy?: StackTrace
    trace: StackTraceElement[]
    details?: ExceptionDetails
}

export interface CrashReportSection {
    title: string
    details?: StringMap
    stacktrace?: StackTraceElement[]
    thread?: string
}

