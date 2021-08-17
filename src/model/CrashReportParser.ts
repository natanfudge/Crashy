import {
    CrashReport,
    CrashReportSection,
    CrashReportSectionElement,
    StackTrace,
    StackTraceElement, StringMap,
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

export function parseCrashReport(rawReport: string): CrashReport {
    let cursor = 0;

    function current(): string {
        return rawReport[cursor];
    }

    function currentAndNext(): string {
        return current() + next();
    }

    function readCurrent(): string {
        const value = current();
        skip();
        return value;
    }

    function skip() {
        cursor++;
    }

    function skipNumber(number: number) {
        cursor += number;
    }

    //TODO: see if this can be optimized by calculating length AOT
    function skipString(string: string) {
        skipNumber(string.length);
    }

    function nextIsString(string: string): boolean {
        for (let i = 0; i < string.length; i++) {
            if (rawReport[cursor + i] !== string[i]) return false;
        }
        return true;
    }

    function isEof(): boolean {
        return cursor >= rawReport.length;
    }

    function next(): string {
        return rawReport[cursor + 1];
    }

    function skipChars(chars: string[]) {
        while (chars.includes(current()) && !isEof()) {
            skip();
        }
    }

    function buildString(builder: (str: StringBuilder) => void): string {
        let str = new StringBuilder('');
        builder(str);
        return str.str;
    }

    // function parseTitle(): string {
    //     return buildString(str => {
    //         while (next() !== '-') {
    //             str.append(parseCurrent());
    //         }
    //     })
    // }

    function readUntilChar(char: string): string {
        return buildString(str => {
            while (current() !== char && !isEof()) {
                str.append(readCurrent());
            }
        })
    }

    function readUntilNextChar(char: string): string {
        return buildString(str => {
            while (next() !== char && !isEof()) {
                str.append(readCurrent());
            }
        })
    }

    function readLine(): string {
        const value = readUntilChar('\n');
        skip();
        return value;
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
        return {
            children: [
                //TODO: need better examples of this
            ],
            message: message,
            trace: trace
        }
    }

    function parseStackTraceElements(): StackTraceElement[] {
        const trace = [];
        while (current() !== '\n' && !isEof()) {
            trace.push(parseStackTraceElement());
        }
        return trace
    }

    function parseStackTraceElement(): StackTraceElement {
        // Skip leading tab
        skipString("\tat ");
        return readLine();
    }

    function parseSections(): CrashReportSection[] {
        const sections = [];
        while (!isEof()
            //TODO: implement stack trace parsing so we can get rid of this check. note that we treat the system details like a normal section here.
            // && sections.length === 0
            ) {
            sections.push(parseSection())
        }
        return sections;
    }

    function parseSection(): CrashReportSection {
        skipChars(['-', ' ']);
        const title = readUntilNextChar('-');
        skipString(" --\nDetails:\n")

        const elements = [];
        while (!isEof() && !nextIsString("Stacktrace:\n")) {
            elements.push(parseSectionElement());
        }

        skipString("Stacktrace:\n")
        const stackTrace = parseStackTraceElements()
        // Skip empty line
        skip();

        return {
            title,
            elements,
            stacktrace: stackTrace
        }
    }

    //	ModLauncher services:
    // 		/mixin-0.8.2.jar mixin PLUGINSERVICE
    // 		/eventbus-4.0.0.jar eventbus PLUGINSERVICE
    function parseSectionElement(): CrashReportSectionElement {
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

    const systemDetails = pullSystemDetailsFrom(sections);

    return {
        systemDetails,
        sections,
        description,
        time,
        wittyComment,
        stacktrace
    }
}

function pullSystemDetailsFrom(sections: CrashReportSection[]) {
    // The system details is parsed as the last section, but the data structure we want treats system details in a special way,
    // so we pull it out and put it in its own object.
    const systemDetailsSectionAsNormalSection = sections.pop()!;
    const systemDetailsSections: StringMap = {}
    for (const element of systemDetailsSectionAsNormalSection.elements) {
        systemDetailsSections[element.name] = element.detail
    }
    const systemDetails: SystemDetails = {
        sections: systemDetailsSections
    }
    return systemDetails;
}
