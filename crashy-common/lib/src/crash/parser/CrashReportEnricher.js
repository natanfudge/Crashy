"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enrichCrashReport = exports.parseCrashReportRich = void 0;
var RichCrashReport_1 = require("../model/RichCrashReport");
var CrashReportParser_1 = require("./CrashReportParser");
require("../../util/Extensions");
var Mappable_1 = require("../model/Mappable");
var HelperMethods_1 = require("../../util/HelperMethods");
function parseCrashReportRich(rawReport) {
    return enrichCrashReport((0, CrashReportParser_1.parseCrashReport)(rawReport));
}
exports.parseCrashReportRich = parseCrashReportRich;
function enrichCrashReport(report) {
    var mods = getMods(report);
    return {
        wittyComment: report.wittyComment,
        title: report.description,
        mods: mods,
        stackTrace: enrichStackTrace(report.stacktrace),
        sections: report.sections.map(function (section) { return enrichCrashReportSection(section); }),
        context: getCrashContext(report, mods),
        rawText: report.rawText,
        deobfuscated: isNecDeobfuscated(report)
    };
}
exports.enrichCrashReport = enrichCrashReport;
function isNecDeobfuscated(report) {
    return report.stacktrace.trace[0].startsWith("Not Enough Crashes deobfuscated stack trace.(");
}
var JavaVersionTitle = "Java Version";
var MinecraftVersionTitle = "Minecraft Version";
var ForgeLoaderTitle = "Forge";
var FabricLoaderId = "fabricloader";
var OperatingSystemTitle = "Operating System";
var IsModdedTitle = "Is Modded";
function getCrashContext(report, mods) {
    var systemDetails = getSystemDetails(report).details;
    //16.0.2, Oracle Corporation
    // Brand ignored
    var javaVersion = systemDetails[JavaVersionTitle].split(",")[0];
    return {
        time: parseCrashDate(report.time),
        javaVersion: javaVersion,
        minecraftVersion: systemDetails[MinecraftVersionTitle],
        loader: getLoader(report, systemDetails, mods),
        operatingSystem: parseOperatingSystem(systemDetails[OperatingSystemTitle])
    };
}
function parseOperatingSystem(osString) {
    if (osString.startsWith("Windows ")) {
        //Windows 7 (x86) version 6.1
        var _a = osString.split("("), majorVersion = _a[0], architectureAndMinor = _a[1];
        // Minor version ignored.
        var architecture = architectureAndMinor.split(") version ")[0];
        var bits = architecture === "x86" ? "32" : "64";
        return {
            name: "".concat(majorVersion, "(").concat(bits, " bit)"),
            type: RichCrashReport_1.OperatingSystemType.Windows
        };
    }
    else if (osString.startsWith("Linux ")) {
        //TODO: better parsing once we can get of more linux examples
        return {
            name: osString,
            type: RichCrashReport_1.OperatingSystemType.Linux
        };
    }
    else {
        //TODO: better parsing once we can get of more macOS examples
        return {
            name: osString,
            type: RichCrashReport_1.OperatingSystemType.Macos
        };
    }
}
function getLoader(report, systemDetails, mods) {
    var forgeEntry = systemDetails[ForgeLoaderTitle];
    if (forgeEntry !== undefined) {
        // Forge
        var _a = forgeEntry.split(":"), version = _a[1];
        return {
            type: RichCrashReport_1.LoaderType.Forge,
            version: version
        };
    }
    else {
        if (mods !== undefined) {
            // If mods exists, and not forge, then it's definitely Fabric and we have the version available
            var fabricLoaderMod = mods.find(function (mod) { return mod.id === FabricLoaderId; });
            return {
                type: RichCrashReport_1.LoaderType.Fabric,
                version: fabricLoaderMod.version
            };
        }
        else {
            var isModded = systemDetails[IsModdedTitle];
            if (isModded.startsWith("Definitely")) {
                // Minecraft says it's modded, so it's gotta be fabric.
                //TODO: for loaders other than forge/fabric, we need to check the brand that this detail gives.
                return {
                    type: RichCrashReport_1.LoaderType.Fabric,
                    // No way to know what Fabric Loader version this is
                    version: undefined
                };
            }
            else {
                return {
                    type: RichCrashReport_1.LoaderType.Vanilla,
                    version: undefined
                };
            }
        }
    }
}
function parseCrashDate(dateStr) {
    // Fabric format: 20/08/2021, 7:41 OR 20/08/2021, 7:41 PM
    // Forge format: 15.08.21 17:36
    var isFabricFormat = dateStr.includes(",");
    var _a = dateStr.split(isFabricFormat ? ", " : " "), date = _a[0], hourStr = _a[1];
    var _b = parseDayMonthYear(date), day = _b.day, month = _b.month, year = _b.year;
    var _c = hourStr.removeSuffix(" a.m.").split(":"), fullHourStr = _c[0], minutesStr = _c[1];
    // Convert PM format to 24 hour format
    var fullHour = parseInt(fullHourStr) + (minutesStr.endsWith(" PM") ? 12 : 0);
    var yearNumber = parseInt(year);
    // Add the 2000s when the 20 at the start is omitted, e.g. "08/20/21"
    var actualYear = yearNumber < 1920 ? yearNumber + 2000 : yearNumber;
    return new Date(actualYear, parseInt(month), parseInt(day), fullHour, parseInt(removeSuffix(minutesStr, " PM")) // minutes
    );
}
function parseDayMonthYear(rawDate) {
    // Sometimes the date is in year-month-day format
    if (rawDate.includes("-")) {
        var _a = rawDate.split("-"), year_1 = _a[0], month_1 = _a[1], day_1 = _a[2];
        return { day: day_1, month: month_1, year: year_1 };
    }
    var _b = rawDate.split(rawDate.includes("/") ? "/" : "."), left = _b[0], right = _b[1], year = _b[2];
    var _c = isDayMonthYear(left, right, rawDate) ? [left, right] : [right, left], day = _c[0], month = _c[1];
    return { day: day, month: month, year: year };
}
// We pretty much needs to guess here if it's day/month/year or month/day/year. Obviously month can't be >12.
function isDayMonthYear(left, right, rawDate) {
    var leftNum = parseInt(left);
    var rightNum = parseInt(right);
    // Left is day
    if (leftNum > 12)
        return true;
    // Right is day
    if (rightNum > 12)
        return false;
    // Forge: When seperated with dots, is day/month/year. When seperated with slashes, is month/day/year.
    return rawDate.includes(".");
}
function enrichCrashReportSection(section) {
    var enrichedDetails = section.thread !== undefined ? { Thread: section.thread } : {};
    // eslint-disable-next-line guard-for-in
    for (var prop in section.details) {
        enrichedDetails[prop] = section.details[prop];
    }
    return {
        name: section.title,
        details: enrichedDetails,
        stackTrace: section.stacktrace !== undefined ? enrichStackTraceElements(section.stacktrace) : undefined
    };
}
function enrichStackTrace(trace) {
    return {
        details: trace.details !== undefined ? enrichExceptionDetails(trace.details) : undefined,
        causedBy: trace.causedBy !== undefined ? enrichStackTrace(trace.causedBy) : undefined,
        title: enrichStackTraceMessage(trace.message),
        elements: enrichStackTraceElements(trace.trace)
    };
}
var expectedExceptionDetailFields = ["Location", "Reason", "Current Frame", "Bytecode", "Stackmap Table"];
function enrichExceptionDetails(detailsWithRaw) {
    var details = detailsWithRaw.details;
    var keys = (0, HelperMethods_1.typedKeys)(details);
    expectOnlyCertainFieldsToBePresent(keys);
    return {
        rawText: detailsWithRaw.rawText,
        location: enrichExceptionLocation(details["Location"]),
        reason: enrichExceptionReason(details["Reason"]),
        currentFrame: enrichExceptionFrame(details["Current Frame"]),
        bytecode: enrichExceptionBytecode(details["Bytecode"]),
        stackmapTable: enrichExceptionStackmapTable(details["Stackmap Table"])
    };
}
function expectOnlyCertainFieldsToBePresent(keys) {
    var unexpectedKey = keys.find(function (key) { return !expectedExceptionDetailFields.includes(key); });
    if (unexpectedKey !== undefined) {
        throw new Error("Unexpected exception details field: " + unexpectedKey);
    }
}
function enrichExceptionLocation(rawLocation) {
    if (rawLocation.length !== 1) {
        throw new Error("Expected exactly one element as exception location");
    }
    var _a = rawLocation[0].split(" "), methodSignature = _a[0], line = _a[1], instruction = _a[2];
    return {
        // Remove leading '@' and trailing ':'
        line: parseInt(line.slice(1, -1)),
        methodSignature: methodSignature,
        instruction: instruction
    };
}
function enrichExceptionReason(rawReason) {
    if (rawReason.length !== 1) {
        throw new Error("Expected exactly one element as exception reason");
    }
    return rawReason[0];
}
function enrichExceptionFrame(rawFrame) {
    if (rawFrame.length !== 4) {
        throw new Error("Unexpected exception frame format: " + rawFrame.join(", "));
    }
    var byteCodeIndex = rawFrame[0], flags = rawFrame[1], locals = rawFrame[2], stack = rawFrame[3];
    return {
        // Remove leading 'bci: @'
        byteCodeIndex: parseInt(byteCodeIndex.slice("bci: @".length)),
        flags: parseExceptionFrameField("flags", flags),
        locals: parseExceptionFrameField("locals", locals),
        stack: parseExceptionFrameField("stack", stack)
    };
}
function parseExceptionFrameField(fieldName, rawField) {
    return rawField.removeExpectedPrefix(fieldName + ": { ").removeExpectedSuffix(" }")
        .split(", ");
}
function enrichExceptionBytecode(rawBytecode) {
    var bytecodes = {};
    for (var _i = 0, rawBytecode_1 = rawBytecode; _i < rawBytecode_1.length; _i++) {
        var bytecode = rawBytecode_1[_i];
        var _a = bytecode.split(": "), address = _a[0], value = _a[1];
        bytecodes[address] = value.replace(/ /g, "");
    }
    return bytecodes;
}
function enrichExceptionStackmapTable(rawTable) {
    var stackmapTable = {};
    for (var _i = 0, rawTable_1 = rawTable; _i < rawTable_1.length; _i++) {
        var stackmap = rawTable_1[_i];
        //    full_frame(@24,{UninitializedThis,Object[#108],Object[#110],Object[#112]},{UninitializedThis,Object[#108],Object[#114]})
        var _a = stackmap.splitToTwo("("), name_1 = _a[0], valueWithClosingBracket = _a[1];
        // Remove trailing ')'
        var _b = valueWithClosingBracket.removeExpectedSuffix(")").splitToTwo(","), rawLineNumber = _b[0], rawObjects = _b[1];
        if (rawLineNumber === undefined)
            throw new Error("Expected exception stack map to at least contain line number. Instead got: " + stackmap);
        // Remove leading '@"
        var line = parseInt(rawLineNumber.slice(1));
        var objects = splitStackmapObjects(rawObjects).map(function (rawObject) { return parseStackmapObject(rawObject); });
        stackmapTable[name_1] = { objects: objects, line: line };
    }
    return stackmapTable;
}
function splitStackmapObjects(rawObjects) {
    return rawObjects.removeExpectedPrefix("{").removeExpectedSuffix("}").split("},{");
}
//{UninitializedThis,Object[#108],Object[#110],Object[#112]}
function parseStackmapObject(rawObject) {
    return rawObject.split(",");
}
function enrichStackTraceMessage(rawMessage) {
    //Example: java.lang.NullPointerException: Unexpected error
    var _a = rawMessage.split(": "), exception = _a[0], message = _a[1];
    return {
        message: message,
        class: parseJavaClass(exception)
    };
}
function enrichStackTraceElements(elements) {
    //at net.minecraft.client.renderer.GameRenderer.func_78473_a(GameRenderer.java:344) ~[?:?] {re:mixin,pl:accesstransformer:B,re:classloading,pl:accesstransformer:B,xf:OptiFine:default,pl:mixin:APP:cameraoverhaul.mixins.json:modern.GameRendererMixin,pl:mixin:A}
    return elements.map(function (element) {
        // Ignore NEC's silly "Not Enough Crashes deobfuscated stack trace" thing
        if (element.startsWith("Not Enough"))
            return undefined;
        // Some elements are just 'X more...'. In that case the relevant information is the number.
        if (element.endsWith(" more"))
            return parseInt(removeSuffix(element, " more"));
        var hasForgeMetadata = element.includes("[");
        var _a = hasForgeMetadata ? splitForgeMetadata(element) : [element, undefined], call = _a[0], metadata = _a[1];
        var _b = parseTraceCall(call), line = _b.line, method = _b.method;
        return {
            line: line,
            method: method,
            forgeMetadata: metadata !== undefined ? parseForgeTraceMetadata(metadata) : undefined
        };
    }).filter(function (element) { return element !== undefined; }).map(function (element) { return element; });
}
function parseForgeTraceMetadata(metadata) {
    //    ?:?] {re:mixin,pl:accesstransformer:B,re:classloading,pl:accesstransformer:B,xf:OptiFine:default,pl:mixin:APP:cameraoverhaul.mixins.json:modern.GameRendererMixin,pl:mixin:A}
    var _a = metadata.split("] {"), jarFileAndVersion = _a[0], transformerData = _a[1];
    var _b = jarFileAndVersion.split(":"), jarFile = _b[0], version = _b[1];
    // Remove trailing '}'
    var transformerDataList = removeLastChar(transformerData).split(",");
    // When using split on an empty string it returns [""] instead of [].
    var actualTransformerDataList = transformerDataList[0] === "" ? [] : transformerDataList;
    var additionalTransformerData = [];
    var classloadingReasons = [];
    var pluginTransformerReasons = [];
    for (var _i = 0, actualTransformerDataList_1 = actualTransformerDataList; _i < actualTransformerDataList_1.length; _i++) {
        var transformerDataItem = actualTransformerDataList_1[_i];
        var suffix = transformerDataItem.substring(0, 2);
        // Indices 0,1,2 are used by the 're:' / 'pl:' / 'xf:'
        var data = transformerDataItem.substring(3);
        switch (suffix) {
            case "re":
                classloadingReasons.push(data);
                break;
            case "pl":
                pluginTransformerReasons.push(data);
                break;
            case "xf":
                additionalTransformerData.push(data);
                break;
            default:
                throw new Error("Unexpected metadata suffix: " + suffix);
        }
    }
    return {
        jarFile: jarFile === "?" ? undefined : jarFile,
        version: version === "?" ? undefined : version,
        additionalTransformerData: additionalTransformerData,
        classloadingReasons: classloadingReasons,
        pluginTransformerReasons: pluginTransformerReasons
    };
}
function parseTraceCall(call) {
    //    net.minecraft.client.renderer.GameRenderer.func_78473_a(GameRenderer.java:344)
    var _a = call.split("("), method = _a[0], line = _a[1];
    return {
        method: parseJavaMethod(method),
        line: parseTraceLine(line)
    };
}
function parseTraceLine(line) {
    var _a = line.split(":"), file = _a[0], lineNumber = _a[1];
    return {
        // If there is no line number the file will have a trailing ')' that we need to remove
        file: lineNumber !== undefined ? file : removeLastChar(file),
        number: lineNumber !== undefined ? parseInt(removeLastChar(lineNumber)) : undefined
    };
}
function splitForgeMetadata(traceElement) {
    var _a = traceElement.split("["), call = _a[0], metadata = _a[1];
    return [
        removeSuffix(call, "~").trimEnd(),
        metadata
    ];
}
function removeSuffix(str, suffix) {
    return str.endsWith(suffix) ? str.substring(0, str.length - suffix.length) : str;
}
function parseJavaMethod(methodString) {
    var parts = methodString.split(".");
    var javaClass = withoutLast(parts).join(".");
    var methodName = last(parts);
    return new Mappable_1.JavaMethod(parseJavaClass(javaClass), methodName);
}
function parseJavaClass(classString) {
    return Mappable_1.JavaClass.dotSeperated(classString);
}
var SystemDetailsTitle = "System Details";
var FabricModsTitle = "Fabric Mods";
var ForgeModsTitle = "Mod List";
var SuspectedModsTitle = "Suspected Mods";
function getSystemDetails(report) {
    return report.sections.find(function (section) { return section.title === SystemDetailsTitle; });
}
function getMods(report) {
    var systemDetails = getSystemDetails(report);
    var details = systemDetails.details;
    // Fabric uses "Fabric Mods" and Forge uses "Mod List"
    var isFabric = FabricModsTitle in details;
    var isForge = ForgeModsTitle in details;
    // If no mods appear, it's either vanilla or Fabric with no mod that adds a mod list to the crash log.
    if (!isFabric && !isForge)
        return undefined;
    // Forge and fabric use a different format for the mod list.
    return isFabric ? parseFabricMods(details) : parseForgeMods(details);
}
function getSuspectedModIds(systemDetails) {
    if (!(SuspectedModsTitle in systemDetails))
        return [];
    var suspectedMods = systemDetails[SuspectedModsTitle];
    if (suspectedMods === "None" || suspectedMods === "Unknown")
        return [];
    // the format is defined like this:
    // mods.joinToString(", ") {mod -> "${mod.name} (${mod.id})"
    return suspectedMods.split(", ")
        .map(function (mod) { return mod.substring(mod.indexOf("(") + 1, mod.length - 1); });
}
function parseFabricMods(systemDetails) {
    var raw = systemDetails[FabricModsTitle];
    if (raw === undefined)
        return undefined;
    // Remove leading newline
    var noLeadingNewline = raw.substring(1);
    var suspectedMods = getSuspectedModIds(systemDetails);
    return noLeadingNewline.split("\n")
        .map(function (modLine) {
        // Remove leading tab
        var noLeadingTab = modLine.substring(1);
        //Example:    betterdroppeditems: Better Dropped Items 1.3.0-1.17
        // The first word is the id, the last word is the version and the words in-between are the name.
        var words = noLeadingTab.split(" ");
        // Remove trailing ':'
        var id = removeLastChar(words[0]);
        // Get words in-between and join them
        var name = words.slice(1, words.length - 1).join(" ");
        // Get last word - the version
        var version = last(words);
        return {
            id: id,
            name: name,
            version: version,
            forgeMetadata: undefined,
            isSuspected: suspectedMods.includes(id)
        };
    });
}
function removeLastChar(str) {
    return str.substring(0, str.length - 1);
}
function withoutLast(arr) {
    return arr.slice(0, arr.length - 1);
}
function last(arr) {
    return arr[arr.length - 1];
}
function parseForgeMods(systemDetails) {
    var raw = systemDetails[ForgeModsTitle];
    // Remove leading newline
    var noLeadingNewline = raw.substring(1);
    var suspectedMods = getSuspectedModIds(systemDetails);
    return noLeadingNewline.split("\n")
        .map(function (modLine) {
        // Remove leading tab
        var noLeadingTab = modLine.substring(1);
        var _a = noLeadingTab.split("|")
            .map(function (part) { return part.trimEnd(); }), file = _a[0], name = _a[1], id = _a[2], version = _a[3], completeness = _a[4], signature = _a[5];
        return {
            id: id,
            name: name,
            version: version,
            isSuspected: suspectedMods.includes(id),
            forgeMetadata: { file: file, completeness: completeness, signature: signature }
        };
    });
}
