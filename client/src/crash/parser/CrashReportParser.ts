import {CrashReport, CrashReportSection, ExceptionDetails, StackTrace, StackTraceElement, StringMap} from "../model/CrashReport";
import "fudge-lib/dist/extensions/ExtensionsImpl"
import {HashSet} from "fudge-lib/dist/collections/hashmap/HashSet";
import {QuiltModsTitle, SystemDetailsTitle} from "./CrashReportEnricher";


export function parseCrashReport(rawReport: string): CrashReport {
    const usesSpacesInsteadOfTabs = rawReport.includes("  Minecraft Version:")
    // Sometimes dumb mods force spaces instead of tabs, and they even replace some tabs with 4 spaces, and some tabs with 2 spaces, IN THE SAME CRASH.
    const usedReport = usesSpacesInsteadOfTabs ? rawReport.replaceAll("    ", "\t").replaceAll("  ", "\t")
        : rawReport
    return parseCrashReportImpl(usedReport, true);
}

//TODO: i wanna rewrite this using tokenization.
function parseCrashReportImpl(rawReport: string, strict: boolean): CrashReport {
    let cursor = 0;

    const firstLine = peekLine()
    const isConcise = firstLine === "---- Crashed! ----"
    if (isConcise) {
        skipLine()
        return parseConciseLog()
    }
    skipBeforeEither(["//", "Time:"])

    let wittyComment = parseWittyComment();
    // Sometimes a comment line is added, in that case, only use the second comment line
    if (nextIsString("//")) wittyComment = parseWittyComment()

    skipEmptyLine()
    const time = parseTime();
    const description = parseDescription();

    // Skip empty line
    skipLine();

    const stacktrace = parseStackTrace();

    const sections = parseSections();

    return {
        sections,
        description,
        dateTime: time,
        wittyComment,
        stacktrace,
        rawText: rawReport
    };

    // Some unknown quilt mod is reducing crash logs to something very small
    function parseConciseLog(): CrashReport {
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

        const mods = readUntilString("|------:|")
        skipLine() // Skip last line of table

        return {
            rawText: rawReport,
            dateTime: dateTime,
            sections: [
                {
                    title: SystemDetailsTitle,
                    additionalInfo: {},
                    stacktrace: undefined,
                    details: {[QuiltModsTitle]: mods}
                }
            ],
            stacktrace: stackTrace,
            description: undefined,
            wittyComment: undefined
        }

    }

    function parseWittyComment(): string | undefined {
        if (!nextIsString("//")) return undefined
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
        const message = parseExceptionMessage()
        let details: ExceptionDetails | undefined = undefined
        if (nextIsString("Exception Details:")) {
            skipLine();
            details = parseExceptionDetails();
        }
        const trace = parseStackTraceElements();

        let causedBy: StackTrace | undefined = undefined;
        skipTabs()
        if (nextIsString("Caused by: ")) {
            skipString("Caused by: ");
            causedBy = parseStackTrace();
        }
        if (nextIsString("Suppressed: ")) {
            skipString("Suppressed: ");
            causedBy = parseStackTrace();
        }
        return {details, causedBy, message, trace};
    }

    function parseExceptionMessage(): string {
        return readBeforeEither(["at ", "Exception Details:", "\n\n"])!.trim()
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
        skipTabs()
        // Keep going while it's still a stack trace
        while (nextIsEither(["at ", "... "]) && !isEof()) {
            trace.push(parseStackTraceElement())
            skipTabs()
        }
        return trace;
    }

    function parseStackTraceElement(): StackTraceElement {
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
            if (nextIsNewline()) {
                skipLine()
                continue;
            }
            sections.push(parseSection());
        }
        return sections;
    }

    function parseSection(): CrashReportSection {
        skipUntilString("-- ")

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
        const nextIsDetails = nextIsString("Details:")
        const nextLine = peekLine()
        // Some dumb mods get rid of the "Details:" thing
        const nextLineIsKeyValue = nextLine.startsWith("\t") && nextLine.includes(":")
        if (nextIsDetails || nextLineIsKeyValue) {
            // Skip 'Details:'
            if (nextIsDetails) skipLine();
            details = {};
            // If a new line exists, or we've reached "Stacktrace:" or "-- ", it means the details have ended
            while (!isEof() && !nextIsNewline() && !nextIsEither(["Stacktrace:", "-- "])) {
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
        while (current() !== "-" && !isWhitespace(current()) && !isEof()) {
            const additionalInfoKey = readUntilChar(":")
            skipEmptyLine()
            let nextLine = readLine()
            let info = nextLine
            while (nextLine !== "") {
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
        const name = parseSectionName();

        let detail = readLine()

        while (!isEof()) {
            skipTabs()
            const nextLine = peekLine();
            if (nextLine === "") {
                // Empty line - end of element/section
                skipLine()
                break;
            } else if (isNewElement(nextLine)) {
                break
            } else {
                // Multiline element
                detail += nextLine + ("\n")
                skipLine()
            }
        }

        return {name, detail: detail.trim()}
    }

    function isNewElement(line: string): boolean {
        // Handle a special case where forge mod elements have a |Manifest: part that trips up the ":" check
        if (line.includes("|Manifest")) return false
        if (isUpperCase(line[0]) && line.includes(":")) return true
        return line === "Stacktrace: " || line.startsWith("-- ")
    }


    function isUpperCase(char: string): boolean {
        return upperCaseLetters.contains(char)
    }

    function parseSectionName() {
        // Skip leading tab
        skipTabs()
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

    function skipTabs() {
        // Skip leading tabs
        while (current() === "\t") skip()
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
        const value = readUntilEitherChars(["\r", "\n"]);
        skipLine();
        return value;
    }

    /**
     * Doesn't include newlines
     */
    function peekLine(): string {
        return peekUntilEitherChars(["\r", "\n"])
    }

    function skip() {
        cursor++;
    }

    function skipLine() {
        skipUntilAfterChar("\n");
    }

    function skipEmptyLine() {
        if (nextIsNewline() || currentAndNext() === " \n") skipLine();
    }

    function nextIsNewline() {
        return nextIsEither(["\n", "\r", " \n"])
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

    /**
     * Returns whether or not the following text is either of the `string`
     */
    function nextIsEither(strings: string[]) {
        return nextOutOf(strings) !== undefined
    }

    /**
     * Returns which of the `strings` is the following text, undefined if none of them
     */
    function nextOutOf(strings: string[]): string | undefined {
        return strings.find(string => nextIsString(string))
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
     * Reads until `string` is encountered, including the string
     * Does not include the string itself, but skips it
     */
    function readUntilString(string: string): string {
        const startIndex = cursor
        skipUntilString(string)
        // Get rid of the string that we are searching for in the result
        return rawReport.slice(startIndex, cursor - string.length);
    }

    /**
     * Skips until `string` is encountered, including the string itself
     */
    function skipUntilString(string: string) {
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
        }
    }

    /**
     * Skips until one of the `strings` is encountered, but does not skip the string itself
     * Returns which of the `strings` it encountered
     */
    function skipBeforeEither(strings: string[]): string | undefined {
        // eslint-disable-next-line no-constant-condition
        while (true) {
            if (isEof()) return undefined
            const next = nextOutOf(strings)
            if (next !== undefined) {
                return next
            }
            skip()
        }
    }

    function readBeforeEither(strings: string[]): string | undefined {
        const startIndex = cursor
        const reachedString = skipBeforeEither(strings)
        if (reachedString === undefined) return undefined
        // Get rid of the string that we are searching for in the result
        return rawReport.slice(startIndex, cursor);
    }

    // /**
    //  * Reads until `string` is encountered
    //  * Does not include the string itself, and does not skip it, to leave it for later processing
    //  */
    // function readBeforeString(string: string): string {
    //     const read = readUntilString(string)
    //     cursor -= string.length
    //     return read
    // }

    function readUntilEitherChars(chars: string[]): string {
        const startIndex = cursor
        while (!isEof() && !(chars.includes(readCurrent()))) {
            // Read until reaching char
        }
        if (!isEof()) cursor--
        return rawReport.slice(startIndex, cursor)
    }

    function peekUntilEitherChars(chars: string[]): string {
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
