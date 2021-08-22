import {
    CrashReport,
    CrashReportSection,
    StackTrace,
    StackTraceElement,
    StringMap,
    SystemDetails
} from "./CrashReport";

class StringBuilder {
    str: string

    constructor(str: string) {
        this.str = str;
    }

    append(str: string) {
        this.str += str
    }
}

//TODO: since we support mappings in the site, we should shut down support for deobfuscating mappings in NEC itself.
export function parseCrashReport(rawReport: string): CrashReport {
    let cursor = 0;

    skipString("---- Minecraft Crash Report ----\n")

    const wittyComment = parseWittyComment();

    // Skip empty line
    skip();

    const time = parseTime();
    const description = parseDescription();

    // Skip empty line
    skip();

    const stacktrace = parseStackTrace();

    skipString("\n\nA detailed walkthrough of the error, its code path and all known details is as follows:\n---------------------------------------------------------------------------------------\n\n")

    const sections = parseSections();
    // const systemDetails = pullSystemDetailsFrom(sections);

    return {
        // systemDetails,
        sections,
        description,
        time,
        wittyComment,
        stacktrace
    }

    function parseWittyComment(): string {
        skipChars(['/', ' ']);
        return readLine();
    }

    function parseTime(): string {
        skipString("Time: ")
        return readLine();
    }

    function parseDescription(): string {
        skipString("Description: ")
        return readLine();
    }

    function parseStackTrace(): StackTrace {
        const message = readLine();
        const trace = parseStackTraceElements();

        let causedBy: StackTrace | undefined = undefined;
        if (nextIsString("Caused by: ")) {
            skipString("Caused by: ");
            causedBy = parseStackTrace()
        }
        return {
            causedBy: causedBy,
            message: message,
            trace: trace
        }
    }

    function parseStackTraceElements(): StackTraceElement[] {
        const trace = [];
        while (current() === '\t' && !isEof()) {
            trace.push(parseStackTraceElement());
        }
        return trace
    }

    function parseStackTraceElement(): StackTraceElement {
        // Skip leading tab
        skip();

        // Most trace lines start with 'at ', but sometimes the last line says '... X more'. In that case we save the 'X more'.
        if (nextIsString("at ")) {
            skipString("at ")
        } else {
            skipString("... ")
        }
        return readLine();
    }


    function parseSections(): CrashReportSection[] {
        const sections = [];
        while (!isEof()) {
            sections.push(parseSection())
        }
        return sections;
    }

    function parseSection(): CrashReportSection {
        skipChars(['-', ' ']);
        const title = readUntilNextChar('-');
        skipString(" --\n")

        let thread = parseSectionThread();
        let details = parseSectionDetails();
        let stacktrace = parseSectionStacktrace();

        // Skip empty line
        skip();

        return {thread, title, details, stacktrace}
    }

    function parseSectionThread() {
        let thread: string | undefined = undefined;
        if (nextIsString("Thread: ")) {
            skipString("Thread: ")
            thread = readLine();
        }
        return thread;
    }

    function parseSectionDetails() {
        let details: StringMap | undefined
        if (nextIsString("Details:")) {
            skipString("Details:\n")
            details = {};
            while (!isEof() && current() === "\t") {
                const {name, detail} = parseSectionElement();
                details[name] = detail;
            }
        }
        return details;
    }

    function parseSectionStacktrace() {
        let stacktrace: StackTraceElement[] | undefined
        if (nextIsString("Stacktrace:")) {
            skipString("Stacktrace:\n");
            stacktrace = parseStackTraceElements();
        }
        return stacktrace;
    }

    function parseSectionElement(): { detail: string, name: string } {
        // Skip leading tab
        skip();
        const name = readUntilChar(':');
        skipString(": ")
        let detail = readLine();
        // Read multiline details
        while (!isEof() && currentAndNext() === "\t\t") {
            // Skip first leading tab, skip other leading tabs because they have semantic value
            skip();
            detail += ("\n" + readLine());
        }
        return {detail, name}
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
        const value = readUntilChar('\n');
        skip();
        return value;
    }

    function skip() {
        cursor++;
    }

    //TODO: see if this can be optimized by calculating length AOT
    function skipString(string: string) {
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
        return buildString(str => {
            while (next() !== char && !isEof()) {
                str.append(readCurrent());
            }
        })
    }

    function buildString(builder: (str: StringBuilder) => void): string {
        let str = new StringBuilder('');
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

    function readUntilChar(char: string): string {
        return buildString(str => {
            while (current() !== char && !isEof()) {
                str.append(readCurrent());
            }
        })
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
