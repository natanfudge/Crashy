import {
    CrashReport,
    CrashReportSection,
    ExceptionDetails,
    StackTrace,
    StackTraceElement,
    StringMap
} from "../model/CrashReport";
import "../../fudge-commons/extensions/ExtensionsImpl"

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
    return parseCrashReportImpl(rawReport, true);
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
        sections,
        description,
        time,
        wittyComment,
        stacktrace,
        rawText: rawReport
    };

    function parseWittyComment(): string {
        skipUntilAfterChar("/")
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
        const details: Record<string, string[]> = {};
        const startIndex = cursor;
        while (nextIsString("  ")) {
            skipString("  ")
            const detailNameWithColon = readLine()
            const detailName = detailNameWithColon.slice(0, -1)
            details[detailName] = parseExceptionDetailValue();
        }
        const endIndex = cursor;
        // Ignore empty line after exception details
        skipLine();
        return {
            rawText: rawReport.slice(startIndex, endIndex),
            details
        };
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
            //TODO: if it doesn't begin with '-- ' assume it's part of the previous entry
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

        let name: string;
        // Weird old Forge special case: it details the mods with a 'UCHIJAA' prefix
        if (nextIsString("UCHIJAA")) {
            name = "UCHIJAA"
            skipNumber(8)
        } else {
            name = readUntilChar(":");
            skipString(":");
            if(current() === " ") skip();
        }

        // Forge completely fucked up the indentation with this one so we just give up and put everything in this element
        if (name == "Loaded coremods (and transformers)") {
            return {
                detail: readToEnd(),
                name
            }
        }

        let detail = readLine();
        // Read multiline details
        let currentAndNextValue: string = currentAndNext()

        while (!isEof() && currentAndNextValue === "\t\t"
        //*** Old Forge special case: Forge (in 1.12.2 at least) has this weird table in system details that fucks up
        // the system details section, so we include the table as a part of 'States' by checking for '\t|' / '\n\t|'
        || currentAndNextValue === "\t|" || nextIsString("\n\t|")) {
            // Skip first leading tab, don't skip other leading tabs because they have semantic value
            skip();
            detail += ("\n" + readLine());
            currentAndNextValue = currentAndNext();
        }
        // The stupid forge table leaves a trailing new line
        if (current() === "\n") skip()
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

    // function peekCharAhead(distance: number): string {
    //     return rawReport[cursor + distance]
    // }
    //
    // function peekSubstringAhead(distance: number): string {
    //     return rawReport.substring(cursor, cursor + distance)
    // }

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

    function readToEnd(): string {
        return buildString((str) => {
            while (!isEof()) {
                str.append(readCurrent());
            }
        });
    }
}

