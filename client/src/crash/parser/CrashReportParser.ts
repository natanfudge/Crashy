import {
    CrashReport,
    CrashReportSection,
    ExceptionDetails,
    StackTrace,
    StackTraceElement,
    StringMap
} from "../model/CrashReport";
import "fudge-lib/dist/extensions/ExtensionsImpl"
import {HashSet} from "fudge-lib/dist/collections/hashmap/HashSet";
import {SystemDetailsTitle} from "./CrashReportEnricher";


export function parseCrashReport(rawReport: string): CrashReport {
    return parseCrashReportImpl(rawReport, true);
}


export function parseCrashReportImpl(rawReport: string, strict: boolean): CrashReport {
    let cursor = 0;

    const firstLine = readLine()
    const isQuilt = firstLine === "---- Crashed! ----"
    if (isQuilt) return parseQuilt()

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
        dateTime: time,
        wittyComment,
        stacktrace,
        rawText: rawReport
    };

    function parseQuilt(): CrashReport {
        skipString("Date/Time: ")
        const dateTime = readLine()
        // Skip \n -- Crash -- \n
        skipLine()
        skipLine()
        skipLine()
        const stackTrace = parseStackTrace()
        skipLine()
        skipLine()
        skipLine()
        skipLine() // Skip \n\n -- Mods \n
        skipLine() // Skip | Index | ...
        skipLine() // Skip | ----: |

        const mods = readBeforeString("|------:|")
        skipLine() // Skip last line of table

        return {
            rawText: rawReport,
            dateTime: dateTime,
            sections: [
                {
                    title: SystemDetailsTitle,
                    additionalInfo: {},
                    stacktrace: undefined,
                    details: {QuiltModsTitle: mods}
                }
            ],
            stacktrace: stackTrace,
            description: undefined,
            wittyComment: undefined
        }

    }

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
            sections.push(parseSection());
        }
        return sections;
    }

    function parseSection(): CrashReportSection {
        skipEmptyLine()
        skipEmptyLine()
        skipString("-- ")

        const title = readUntilNextChar("-");
        // Skip ' --'
        skipLine();

        const thread = parseSectionThread();
        const details = parseSectionDetails();
        const stacktrace = parseSectionStacktrace();
        const additionalInfo = parseSectionAdditionalInfo()

        // Skip empty line
        skipEmptyLine();

        return {thread, title, details, stacktrace, additionalInfo};
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

    // Parses more things of the form KEY: VALUE
    //                                     VALUE
    function parseSectionAdditionalInfo(): StringMap {
        const additionalInfoKeys: StringMap = {}
        // '-' Marks the start of a new section
        while (current() != "-" && !isWhitespace(current()) && !isEof()) {
            const additionalInfoKey = readUntilChar(":")
            skipEmptyLine()
            let nextLine = readLine()
            let info = nextLine
            while (nextLine != "") {
                nextLine = readLine()
                info += nextLine
            }
            additionalInfoKeys[additionalInfoKey] = info
        }
        return additionalInfoKeys
    }

    function isWhitespace(char: string): boolean {
        switch (char) {
            case "\n":
            case "\r":
            case " ":
            case "\t":
                return true
            default:
                return false
        }
    }


    function parseSectionElement(): { detail: string, name: string } {
        let name = parseSectionName();

        let detail = readLine()

        while (!isEof()) {
            const nextLine = peekLine();
            if (nextLine === "" || nextLine === "\t") {
                // Empty line - end of element/section
                skipLine()
                break;
            } else if (
                // Start of new element
                (nextLine[0] === "\t" && isUpperCase(nextLine[1]) && (nextLine.includes(": ") || nextLine.endsWith(":"))) ||
                // Start of Stack Trace
                nextLine === "Stacktrace:" ||
                // Start of new section
                nextLine.startsWith("-- ")
            ) {
                break
            } else {
                // Multiline element
                // Skip first leading tab, don't skip other leading tabs because they have semantic value
                detail += ("\n") + nextLine.removePrefix("\t")
                skipLine()
            }
        }

        return {name, detail}


        // return name


        //
        // // Forge completely fucked up the indentation with this one so we just give up and put everything in this element
        // if (name == "Loaded coremods (and transformers)") {
        //     return {
        //         detail: readToEnd(),
        //         name
        //     }
        // }
        //
        // let detail = readLine();
        // // Read multiline details
        // let currentAndNextValue: string = currentAndNext()
        //
        // while (!isEof() && currentAndNextValue === "\t\t"
        // //*** Old Forge special case: Forge (in 1.12.2 at least) has this weird table in system details that fucks up
        // // the system details section, so we include the table as a part of 'States' by checking for '\t|' / '\n\t|'
        // || currentAndNextValue === "\t|" || nextIsString("\n\t|")) {
        //     // Skip first leading tab, don't skip other leading tabs because they have semantic value
        //     skip();
        //     detail += ("\n" + readLine());
        //     currentAndNextValue = currentAndNext();
        // }
        // // The stupid forge table leaves a trailing new line
        // if (current() === "\n") skip()
        // return {detail, name};
    }


    function isUpperCase(char: string): boolean {
        return upperCaseLetters.contains(char)
    }

    function parseSectionName() {
        // Skip leading tab
        skip();
        let name: string;
        // Weird old Forge special case: it details the mods with a 'UCHIJAA' prefix
        if (nextIsString("UCHIJAA")) {
            name = "UCHIJAA"
            skipNumber(8)
        } else {
            name = readUntilChar(":");
            if (current() === " ") skip();
        }
        return name;
    }

    // function


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

    /**
     * Doesn't include newlines
     */
    function peekLine(): string {
        return peekUntilEither(["\r", "\n"])
    }

    function skip() {
        cursor++;
    }

    function skipLine() {
        skipUntilAfterChar("\n");
    }

    function skipEmptyLine() {
        if (current() === "\n" || current() === "\r" || currentAndNext() === " \n") skipLine();
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
        const startIndex = cursor
        while (!isEof() && readCurrent() !== char) {
            // Read until reaching char
        }
        return rawReport.slice(startIndex, cursor - 2)
    }

    function next(): string {
        return rawReport[cursor + 1];
    }

    function isEof(): boolean {
        return cursor >= rawReport.length;
    }

    function isEofAtDistance(distance: number): boolean {
        return cursor + distance >= rawReport.length;
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

    /**
     * Does not include the char itself, but skips it
     */
    function readUntilChar(char: string): string {
        const startIndex = cursor
        while (!isEof() && readCurrent() !== char) {
            // Read until reaching char
        }
        return rawReport.slice(startIndex, cursor - 1)
    }

    /**
     * Does not include the char itself, but skips it
     */
    function readBeforeString(string: string): string {
        const startIndex = cursor
        // const result = buildString((str) => {
        let amountEqualToString = 0
        while (!isEof()) {
            const char = readCurrent()
            if (string[amountEqualToString] === char) {
                // We progressed being able to the string
                if (amountEqualToString === string.length - 1) break
                else amountEqualToString++
            } else {
                // Something's not equal, start again.
                amountEqualToString = 0
            }
            // cursor: 6180
        }
        // });
        // skip()
        // Get rid of the string that we are searching for in the result
        return rawReport.slice(startIndex, cursor - string.length);
    }

    function readUntilEither(chars: string[]): string {
        const startIndex = cursor
        while (!isEof() && !(chars.includes(readCurrent()))) {
            // Read until reaching char
        }
        if (!isEof()) cursor--
        return rawReport.slice(startIndex, cursor)
    }

    function peekUntilEither(chars: string[]): string {
        let distance = 0;
        while (!(chars.includes(peek(distance))) && !isEofAtDistance(distance)) {
            distance++
        }
        return rawReport.slice(cursor, cursor + distance)
    }

    function peek(distance: number): string {
        return rawReport[cursor + distance]
    }
}

const upperCaseLetters = HashSet.of("A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K",
    "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z")
