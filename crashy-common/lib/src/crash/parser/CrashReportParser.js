"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseCrashReportImpl = exports.parseCrashReport = void 0;
require("../../util/ExtensionsImpl");
var StringBuilder = /** @class */ (function () {
    function StringBuilder(str) {
        this.str = str;
    }
    StringBuilder.prototype.append = function (str) {
        this.str += str;
    };
    return StringBuilder;
}());
function parseCrashReport(rawReport) {
    return parseCrashReportImpl(rawReport, false);
}
exports.parseCrashReport = parseCrashReport;
function parseCrashReportImpl(rawReport, strict) {
    var cursor = 0;
    // Skip '---- Minecraft Crash Report ----'
    skipLine();
    var wittyComment = parseWittyComment();
    // Skip empty line
    skipLine();
    var time = parseTime();
    var description = parseDescription();
    // Skip empty line
    skipLine();
    var stacktrace = parseStackTrace();
    // Skip two blank lines before 'A detailed walkthrough...'
    skipLine();
    skipLine();
    // Skip 'A detailed walkthrough of the error, its code path and all known details is as follows'.
    skipLine();
    // Skip '---------------------------------------------------------------------------------------'
    skipLine();
    // Skip blank line afterwards
    skipLine();
    var sections = parseSections();
    return {
        // systemDetails,
        sections: sections,
        description: description,
        time: time,
        wittyComment: wittyComment,
        stacktrace: stacktrace,
        rawText: rawReport
    };
    function parseWittyComment() {
        skipChars(["/", " "]);
        return readLine();
    }
    function parseTime() {
        skipString("Time: ");
        return readLine();
    }
    function parseDescription() {
        skipString("Description: ");
        return readLine();
    }
    function parseStackTrace() {
        var message = readLine();
        var details = undefined;
        if (nextIsString("Exception Details:")) {
            skipLine();
            details = parseExceptionDetails();
        }
        var trace = parseStackTraceElements();
        var causedBy = undefined;
        if (nextIsString("Caused by: ")) {
            skipString("Caused by: ");
            causedBy = parseStackTrace();
        }
        return { details: details, causedBy: causedBy, message: message, trace: trace };
    }
    function parseExceptionDetails() {
        var details = {};
        var startIndex = cursor;
        while (nextIsString("  ")) {
            skipString("  ");
            var detailNameWithColon = readLine();
            var detailName = detailNameWithColon.slice(0, -1);
            details[detailName] = parseExceptionDetailValue();
        }
        var endIndex = cursor;
        // Ignore empty line after exception details
        skipLine();
        return {
            rawText: rawReport.slice(startIndex, endIndex),
            details: details
        };
    }
    function parseExceptionDetailValue() {
        var lines = [];
        while (nextIsString("    ")) {
            skipString("    ");
            lines.push(readLine());
        }
        return lines;
    }
    function parseStackTraceElements() {
        var trace = [];
        while (current() === "\t" && !isEof()) {
            trace.push(parseStackTraceElement());
        }
        return trace;
    }
    function parseStackTraceElement() {
        // Skip leading tab
        skip();
        // Most trace lines start with 'at ', but sometimes the last line says '... X more'. In that case we save the 'X more'.
        if (nextIsString("at ")) {
            skipString("at ");
        }
        else {
            skipString("... ");
        }
        return readLine();
    }
    function parseSections() {
        var sections = [];
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
    function parseSection() {
        skipString("-- ");
        // skipChars(["-", " "]);
        var title = readUntilNextChar("-");
        // Skip ' --'
        skipLine();
        var thread = parseSectionThread();
        var details = parseSectionDetails();
        var stacktrace = parseSectionStacktrace();
        // Skip empty line
        skipEmptyLine();
        return { thread: thread, title: title, details: details, stacktrace: stacktrace };
    }
    function parseSectionThread() {
        var thread = undefined;
        if (nextIsString("Thread: ")) {
            skipString("Thread: ");
            thread = readLine();
        }
        return thread;
    }
    function parseSectionDetails() {
        var details;
        if (nextIsString("Details:")) {
            // Skip 'Details:'
            skipLine();
            details = {};
            while (!isEof() && current() === "\t") {
                var _a = parseSectionElement(), name_1 = _a.name, detail = _a.detail;
                details[name_1] = detail;
            }
        }
        return details;
    }
    function parseSectionStacktrace() {
        var stacktrace;
        if (nextIsString("Stacktrace:")) {
            // Skip 'Stacktrace:'
            skipLine();
            stacktrace = parseStackTraceElements();
        }
        return stacktrace;
    }
    function parseSectionElement() {
        // Skip leading tab
        skip();
        var name = readUntilChar(":");
        skipString(": ");
        var detail = readLine();
        // Read multiline details
        while (!isEof() && currentAndNext() === "\t\t") {
            // Skip first leading tab, skip other leading tabs because they have semantic value
            skip();
            detail += ("\n" + readLine());
        }
        return { detail: detail, name: name };
    }
    function skipChars(chars) {
        while (chars.includes(current()) && !isEof()) {
            skip();
        }
    }
    function current() {
        return rawReport[cursor];
    }
    function readLine() {
        var value = readUntilEither(["\r", "\n"]);
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
        if (current() === "\n" || current() === "\r")
            skipLine();
    }
    function skipString(string) {
        if (strict) {
            if (!nextIsString(string)) {
                throw new Error("Expected '".concat(string, "' but got '").concat(current(), "'"));
            }
        }
        skipNumber(string.length);
    }
    function skipNumber(number) {
        cursor += number;
    }
    function nextIsString(string) {
        for (var i = 0; i < string.length; i++) {
            if (rawReport[cursor + i] !== string[i])
                return false;
        }
        return true;
    }
    function readUntilNextChar(char) {
        return buildString(function (str) {
            while (next() !== char && !isEof()) {
                str.append(readCurrent());
            }
        });
    }
    function buildString(builder) {
        var str = new StringBuilder("");
        builder(str);
        return str.str;
    }
    function next() {
        return rawReport[cursor + 1];
    }
    function isEof() {
        return cursor >= rawReport.length;
    }
    function readCurrent() {
        var value = current();
        skip();
        return value;
    }
    function currentAndNext() {
        return current() + next();
    }
    function skipUntilAfterChar(char) {
        while (current() !== char && !isEof()) {
            skip();
        }
        // Skip the char itself
        skip();
    }
    function readUntilChar(char) {
        return buildString(function (str) {
            while (current() !== char && !isEof()) {
                str.append(readCurrent());
            }
        });
    }
    function readUntilEither(chars) {
        return buildString(function (str) {
            while (!(chars.includes(current())) && !isEof()) {
                str.append(readCurrent());
            }
        });
    }
}
exports.parseCrashReportImpl = parseCrashReportImpl;
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
