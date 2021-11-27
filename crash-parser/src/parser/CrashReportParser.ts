import {
    CrashReport,
    CrashReportSection,
    ExceptionDetails,
    StackTrace,
    StackTraceElement,
    StringMap
} from "../model/CrashReport";
import "../util/ExtensionsImpl"

class StringBuilder {
    str: string

    constructor(str: string) {
        this.str = str;
    }

    append(str: string) {
        this.str += str;
    }
}

export function parseCrashReport(rawReport: string): CrashReport {
    return parseCrashReportImpl(rawReport, false);
}
export function parseCrashReportImpl(rawReport: string, strict: boolean): CrashReport {
    let cursor = 0;

    // Skip '---- Minecraft Crash Report ----'
    skipLine();

    const wittyComment = parseWittyComment();

    // Skip empty line
    skipLine();

    const time = parseTime();
    const description = parseDescription();

    // Skip empty line
    skipLine();

    const stacktrace = parseStackTrace();

    // Skip two blank lines before 'A detailed walkthrough...'
    skipLine();
    skipLine();
    // Skip 'A detailed walkthrough of the error, its code path and all known details is as follows'.
    skipLine();
    // Skip '---------------------------------------------------------------------------------------'
    skipLine();
    // Skip blank line afterwards
    skipLine();

    const sections = parseSections();

    return {
        // systemDetails,
        sections,
        description,
        time,
        wittyComment,
        stacktrace
    };

    function parseWittyComment(): string {
        skipChars(["/", " "]);
        return readLine();
    }

    function parseTime(): string {
        skipString("Time: ");
        return readLine();
    }

    function parseDescription(): string {
        skipString("Description: ");
        return readLine();
    }

    function parseStackTrace(): StackTrace {
        const message = readLine();
        let details: ExceptionDetails | undefined = undefined
        if (nextIsString("Exception Details:")) {
            skipLine();
            details = parseExceptionDetails();
        }
        const trace = parseStackTraceElements();

        let causedBy: StackTrace | undefined = undefined;
        if (nextIsString("Caused by: ")) {
            skipString("Caused by: ");
            causedBy = parseStackTrace();
        }
        return {details, causedBy, message, trace};
    }

    function parseExceptionDetails(): ExceptionDetails {
        const details: ExceptionDetails = {};
        while (nextIsString("  ")) {
            skipString("  ")
            const detailNameWithColon = readLine()
            const detailName = detailNameWithColon.slice(0, -1)
            details[detailName] = parseExceptionDetailValue();
        }
        // Ignore empty line after exception details
        skipLine();
        return details;
    }

    function parseExceptionDetailValue(): string[] {
        const lines = [];
        while (nextIsString("    ")) {
            skipString("    ")
            lines.push(readLine())
        }
        return lines;
    }

    function parseStackTraceElements(): StackTraceElement[] {
        const trace = [];
        while (current() === "\t" && !isEof()) {
            trace.push(parseStackTraceElement());
        }
        return trace;
    }

    function parseStackTraceElement(): StackTraceElement {
        // Skip leading tab
        skip();

        // Most trace lines start with 'at ', but sometimes the last line says '... X more'. In that case we save the 'X more'.
        if (nextIsString("at ")) {
            skipString("at ");
        } else {
            skipString("... ");
        }
        return readLine();
    }


    function parseSections(): CrashReportSection[] {
        const sections = [];
        while (!isEof()) {
            // Ignore empty lines
            if (current() === "\n" || current() === "\r") {
                skip();
                continue;
            }
            sections.push(parseSection());
        }
        return sections;
    }

    function parseSection(): CrashReportSection {
        skipString("-- ")
        // skipChars(["-", " "]);
        const title = readUntilNextChar("-");
        // Skip ' --'
        skipLine();

        const thread = parseSectionThread();
        const details = parseSectionDetails();
        const stacktrace = parseSectionStacktrace();

        // Skip empty line
        skipEmptyLine();

        return {thread, title, details, stacktrace};
    }

    function parseSectionThread() {
        let thread: string | undefined = undefined;
        if (nextIsString("Thread: ")) {
            skipString("Thread: ");
            thread = readLine();
        }
        return thread;
    }

    function parseSectionDetails() {
        let details: StringMap | undefined;
        if (nextIsString("Details:")) {
            // Skip 'Details:'
            skipLine();
            details = {};
            while (!isEof() && current() === "\t") {
                const {name, detail} = parseSectionElement();
                details[name] = detail;
            }
        }
        return details;
    }

    function parseSectionStacktrace() {
        let stacktrace: StackTraceElement[] | undefined;
        if (nextIsString("Stacktrace:")) {
            // Skip 'Stacktrace:'
            skipLine();
            stacktrace = parseStackTraceElements();
        }
        return stacktrace;
    }

    function parseSectionElement(): { detail: string, name: string } {
        // Skip leading tab
        skip();
        const name = readUntilChar(":");
        skipString(": ");
        let detail = readLine();
        // Read multiline details
        while (!isEof() && currentAndNext() === "\t\t") {
            // Skip first leading tab, skip other leading tabs because they have semantic value
            skip();
            detail += ("\n" + readLine());
        }
        return {detail, name};
    }


    function skipChars(chars: string[]) {
        while (chars.includes(current()) && !isEof()) {
            skip();
        }
    }

    function current(): string {
        return rawReport[cursor];
    }

    function readLine(): string {
        const value = readUntilEither(["\r", "\n"]);
        skipLine();
        return value;
    }

    function skip() {
        cursor++;
    }

    function skipLine() {
        skipUntilAfterChar("\n");
    }

    function skipEmptyLine() {
        if (current() === "\n" || current() === "\r") skipLine();
    }

    function skipString(string: string) {
        if (strict) {
            if (!nextIsString(string)) {
                throw new Error(`Expected '${string}' but got '${current()}'`);
            }
        }
        skipNumber(string.length);
    }


    function skipNumber(number: number) {
        cursor += number;
    }

    function nextIsString(string: string): boolean {
        for (let i = 0; i < string.length; i++) {
            if (rawReport[cursor + i] !== string[i]) return false;
        }
        return true;
    }

    function readUntilNextChar(char: string): string {
        return buildString((str) => {
            while (next() !== char && !isEof()) {
                str.append(readCurrent());
            }
        });
    }

    function buildString(builder: (str: StringBuilder) => void): string {
        const str = new StringBuilder("");
        builder(str);
        return str.str;
    }

    function next(): string {
        return rawReport[cursor + 1];
    }

    function isEof(): boolean {
        return cursor >= rawReport.length;
    }

    function readCurrent(): string {
        const value = current();
        skip();
        return value;
    }

    function currentAndNext(): string {
        return current() + next();
    }

    function skipUntilAfterChar(char: string) {
        while (current() !== char && !isEof()) {
            skip();
        }
        // Skip the char itself
        skip();
    }

    function readUntilChar(char: string): string {
        return buildString((str) => {
            while (current() !== char && !isEof()) {
                str.append(readCurrent());
            }
        });
    }

    function readUntilEither(chars: string[]): string {
        return buildString((str) => {
            while (!(chars.includes(current())) && !isEof()) {
                str.append(readCurrent());
            }
        });
    }

}

//
// function pullSystemDetailsFrom(sections: CrashReportSection[]) {
//     // The system details is parsed as a section, but the data structure we want treats system details in a special way,
//     // so we pull it out and put it in its own object.
//     const systemDetailsSectionAsNormalSection = sections.find((section) => section.title === "System Details")!
//     // Remove system details from the sections list
//     sections.splice(sections.indexOf(systemDetailsSectionAsNormalSection), 1)
//     const systemDetailsSections: StringMap = {}
//     for (const element of systemDetailsSectionAsNormalSection.details!) {
//         systemDetailsSections[element.name] = element.detail
//     }
//     const systemDetails: SystemDetails = {
//         sections: systemDetailsSections
//     }
//     return systemDetails;
// }
