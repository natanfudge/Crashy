
export interface CrashReport {
    description: string
    wittyComment: string
    time: string,
    sections: CrashReportSection[]
    stacktrace: StackTrace
}

export type StringMap = Record<string, string>

export type StackTraceElement = string

export interface StackTrace {
    message: string
    causedBy?: StackTrace
    trace: StackTraceElement[]
    details: Record<string, string[]>
}

export interface CrashReportSection {
    title: string
    details?: StringMap
    stacktrace?: StackTraceElement[]
    thread?: string
}

