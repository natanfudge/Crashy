import {
    CrashReport,
    CrashReportSection,
    ExceptionDetails,
    StackTrace,
    StackTraceElement,
    StringMap
} from "../model/CrashReport";
import {
    CrashContext,
    ExceptionBytecode,
    ExceptionFrame,
    ExceptionLocation,
    ExceptionStackmapTable,
    ForgeTraceMetadata,
    JavaClass,
    JavaMethod,
    Loader,
    LoaderType,
    Mod,
    OperatingSystem,
    OperatingSystemType,
    RichCrashReport,
    RichCrashReportSection,
    RichExceptionDetails,
    RichStackTrace,
    RichStackTraceElement,
    StackTraceMessage,
    TraceLine
} from "../model/RichCrashReport";
import {parseCrashReport} from "./CrashReportParser";
import {typedKeys} from "../util/Utils";
import "../util/Extensions"

export function parseCrashReportRich(rawReport: string): RichCrashReport {
    return enrichCrashReport(parseCrashReport(rawReport));
}

export function enrichCrashReport(report: CrashReport): RichCrashReport {
    const mods = getMods(report);
    return {
        wittyComment: report.wittyComment,
        title: report.description,
        mods,
        stackTrace: enrichStackTrace(report.stacktrace),
        sections: report.sections.map((section) => enrichCrashReportSection(section)),
        context: getCrashContext(report, mods),
        rawText: report.rawText
    };
}

const JavaVersionTitle = "Java Version";
const MinecraftVersionTitle = "Minecraft Version";
const ForgeLoaderTitle = "Forge";
const FabricLoaderId = "fabricloader";
const OperatingSystemTitle = "Operating System";
const IsModdedTitle = "Is Modded"

function getCrashContext(report: CrashReport, mods?: Mod[]): CrashContext {
    const systemDetails = getSystemDetails(report).details!;
    //16.0.2, Oracle Corporation
    // Brand ignored
    const [javaVersion] = systemDetails[JavaVersionTitle].split(",");


    return {
        time: parseCrashDate(report.time),
        javaVersion: javaVersion,
        minecraftVersion: systemDetails[MinecraftVersionTitle],
        loader: getLoader(report, systemDetails, mods),
        operatingSystem: parseOperatingSystem(systemDetails[OperatingSystemTitle])
    };
}

function parseOperatingSystem(osString: string): OperatingSystem {
    if (osString.startsWith("Windows ")) {
        //Windows 7 (x86) version 6.1
        const [majorVersion, architectureAndMinor] = osString.split("(");
        // Minor version ignored.
        const [architecture] = architectureAndMinor.split(") version ");
        const bits = architecture === "x86" ? "32" : "64";
        return {
            name: `${majorVersion}(${bits} bit)`,
            type: OperatingSystemType.Windows
        };
    } else if (osString.startsWith("Linux ")) {
        //TODO: better parsing once we can get of more linux examples
        return {
            name: osString,
            type: OperatingSystemType.Linux
        };
    } else {
        //TODO: better parsing once we can get of more macOS examples
        return {
            name: osString,
            type: OperatingSystemType.Macos
        };
    }
}

function getLoader(report: CrashReport, systemDetails: StringMap, mods?: Mod[]): Loader {
    const forgeEntry = systemDetails[ForgeLoaderTitle];
    if (forgeEntry !== undefined) {
        // Forge
        const [, version] = forgeEntry.split(":");
        return {
            type: LoaderType.Forge,
            version: version
        };
    } else {
        if (mods !== undefined) {
            // If mods exists, and not forge, then it's definitely Fabric and we have the version available
            const fabricLoaderMod = mods.find((mod) => mod.id === FabricLoaderId)!;
            return {
                type: LoaderType.Fabric,
                version: fabricLoaderMod.version
            };
        } else {
            const isModded = systemDetails[IsModdedTitle];
            if (isModded.startsWith("Definitely")) {
                // Minecraft says it's modded, so it's gotta be fabric.
                //TODO: for loaders other than forge/fabric, we need to check the brand that this detail gives.
                return {
                    type: LoaderType.Fabric,
                    // No way to know what Fabric Loader version this is
                    version: undefined
                }
            } else {
                return {
                    type: LoaderType.Vanilla,
                    version: undefined
                }
            }
        }

    }
}

function parseCrashDate(dateStr: string): Date {
    // Fabric format: 20/08/2021, 7:41 OR 20/08/2021, 7:41 PM
    // Forge format: 15.08.21 17:36
    const isFabricFormat = dateStr.includes(",");
    const [date, hourStr] = dateStr.split(isFabricFormat ? ", " : " ");
    const {day, month, year} = parseDayMonthYear(date);
    const [fullHourStr, minutesStr] = hourStr.removeSuffix(" a.m.").split(":");
    // Convert PM format to 24 hour format
    const fullHour = parseInt(fullHourStr) + (minutesStr.endsWith(" PM") ? 12 : 0);

    const yearNumber = parseInt(year);
    // Add the 2000s when the 20 at the start is omitted, e.g. "08/20/21"
    const actualYear = yearNumber < 1920 ? yearNumber + 2000 : yearNumber;
    return new Date(
        actualYear,
        parseInt(month),
        parseInt(day),
        fullHour,
        parseInt(removeSuffix(minutesStr, " PM")) // minutes
    );
}

function parseDayMonthYear(rawDate: string): { day: string, month: string, year: string } {
    // Sometimes the date is in year-month-day format
    if (rawDate.includes("-")) {
        const [year, month, day] = rawDate.split("-");
        return {day, month, year};
    }
    const [left, right, year] = rawDate.split(rawDate.includes("/") ? "/" : ".");

    const [day, month] = isDayMonthYear(left, right,rawDate) ? [left, right] : [right, left];
    return {day, month, year};
}

// We pretty much needs to guess here if it's day/month/year or month/day/year. Obviously month can't be >12.
function isDayMonthYear(left: string, right: string, rawDate: string): boolean {
    const leftNum = parseInt(left);
    const rightNum = parseInt(right);
    // Left is day
    if (leftNum > 12) return true;
    // Right is day
    if (rightNum > 12) return false;
    // Forge: When seperated with dots, is day/month/year. When seperated with slashes, is month/day/year.
    return rawDate.includes(".")
}

function enrichCrashReportSection(section: CrashReportSection): RichCrashReportSection {
    const enrichedDetails: StringMap = section.thread !== undefined ? {Thread: section.thread} : {};
    // eslint-disable-next-line guard-for-in
    for (const prop in section.details) {
        enrichedDetails[prop] = section.details[prop];
    }
    return {
        name: section.title,
        details: enrichedDetails,
        stackTrace: section.stacktrace !== undefined ? enrichStackTraceElements(section.stacktrace) : undefined
    };
}

function enrichStackTrace(trace: StackTrace): RichStackTrace {
    return {
        details: trace.details !== undefined ? enrichExceptionDetails(trace.details) : undefined,
        causedBy: trace.causedBy !== undefined ? enrichStackTrace(trace.causedBy) : undefined,
        title: enrichStackTraceMessage(trace.message),
        elements: enrichStackTraceElements(trace.trace)
    };
}

const expectedExceptionDetailFields = ["Location", "Reason", "Current Frame", "Bytecode", "Stackmap Table"]

function enrichExceptionDetails(detailsWithRaw: ExceptionDetails): RichExceptionDetails {
    const details = detailsWithRaw.details;
    const keys = typedKeys(details);
    expectOnlyCertainFieldsToBePresent(keys);
    return {
        rawText: detailsWithRaw.rawText,
        location: enrichExceptionLocation(details["Location"]),
        reason: enrichExceptionReason(details["Reason"]),
        currentFrame: enrichExceptionFrame(details["Current Frame"]),
        bytecode: enrichExceptionBytecode(details["Bytecode"]),
        stackmapTable: enrichExceptionStackmapTable(details["Stackmap Table"])
    }
}

function expectOnlyCertainFieldsToBePresent(keys: string[]) {
    const unexpectedKey = keys.find(key => !expectedExceptionDetailFields.includes(key));
    if (unexpectedKey !== undefined) {
        throw new Error("Unexpected exception details field: " + unexpectedKey);
    }
}

function enrichExceptionLocation(rawLocation: string[]): ExceptionLocation {
    if (rawLocation.length !== 1) {
        throw new Error("Expected exactly one element as exception location");
    }
    const [methodSignature, line, instruction] = rawLocation[0].split(" ");
    return {
        // Remove leading '@' and trailing ':'
        line: parseInt(line.slice(1, -1)),
        methodSignature,
        instruction
    }
}

function enrichExceptionReason(rawReason: string[]): string {
    if (rawReason.length !== 1) {
        throw new Error("Expected exactly one element as exception reason");
    }
    return rawReason[0];
}


function enrichExceptionFrame(rawFrame: string[]): ExceptionFrame {
    if (rawFrame.length !== 4) {
        throw new Error("Unexpected exception frame format: " + rawFrame.join(", "))
    }
    const [byteCodeIndex, flags, locals, stack] = rawFrame;
    return {
        // Remove leading 'bci: @'
        byteCodeIndex: parseInt(byteCodeIndex.slice("bci: @".length)),
        flags: parseExceptionFrameField("flags", flags),
        locals: parseExceptionFrameField("locals", locals),
        stack: parseExceptionFrameField("stack", stack)
    }
}

function parseExceptionFrameField(fieldName: string, rawField: string): string[] {
    return rawField.removeExpectedPrefix(fieldName + ": { ").removeExpectedSuffix(" }")
        .split(", ")
}


function enrichExceptionBytecode(rawBytecode: string[]): ExceptionBytecode {
    const bytecodes: ExceptionBytecode = {}
    for (const bytecode of rawBytecode) {
        const [address, value] = bytecode.split(": ")
        bytecodes[address] = value.replace(/ /g, "")
    }
    return bytecodes
}

function enrichExceptionStackmapTable(rawTable: string[]): ExceptionStackmapTable {
    const stackmapTable: ExceptionStackmapTable = {}
    for (const stackmap of rawTable) {
        //    full_frame(@24,{UninitializedThis,Object[#108],Object[#110],Object[#112]},{UninitializedThis,Object[#108],Object[#114]})
        const [name, valueWithClosingBracket] = stackmap.splitToTwo("(")
        // Remove trailing ')'
        const [rawLineNumber, rawObjects] = valueWithClosingBracket.removeExpectedSuffix(")").splitToTwo(",");
        if (rawLineNumber === undefined) throw new Error("Expected exception stack map to at least contain line number. Instead got: " + stackmap);
        // Remove leading '@"
        const line = parseInt(rawLineNumber.slice(1));
        const objects = splitStackmapObjects(rawObjects).map(rawObject => parseStackmapObject(rawObject));
        stackmapTable[name] = {objects, line}
    }
    return stackmapTable;
}

function splitStackmapObjects(rawObjects: string): string[] {
    return rawObjects.removeExpectedPrefix("{").removeExpectedSuffix("}").split("},{")
}

//{UninitializedThis,Object[#108],Object[#110],Object[#112]}
function parseStackmapObject(rawObject: string): string[] {
    return rawObject.split(",");
}

function enrichStackTraceMessage(rawMessage: string): StackTraceMessage {
    //Example: java.lang.NullPointerException: Unexpected error
    const [exception, message] = rawMessage.split(": ");
    return {
        message,
        class: parseJavaClass(exception)
    };
}

function enrichStackTraceElements(elements: StackTraceElement[]): RichStackTraceElement[] {
    //at net.minecraft.client.renderer.GameRenderer.func_78473_a(GameRenderer.java:344) ~[?:?] {re:mixin,pl:accesstransformer:B,re:classloading,pl:accesstransformer:B,xf:OptiFine:default,pl:mixin:APP:cameraoverhaul.mixins.json:modern.GameRendererMixin,pl:mixin:A}
    return elements.map((element) => {
        // Ignore NEC's silly "Not Enough Crashes deobfuscated stack trace" thing
        if (element.startsWith("Not Enough")) return undefined;
        // Some elements are just 'X more...'. In that case the relevant information is the number.
        if (element.endsWith(" more")) return parseInt(removeSuffix(element, " more"));

        const hasForgeMetadata = element.includes("[");
        const [call, metadata] = hasForgeMetadata ? splitForgeMetadata(element) : [element, undefined];
        const {line, method} = parseTraceCall(call);
        return {
            line,
            method,
            forgeMetadata: metadata !== undefined ? parseForgeTraceMetadata(metadata) : undefined
        };
    }).filter((element) => element !== undefined).map((element) => element!);
}

function parseForgeTraceMetadata(metadata: string): ForgeTraceMetadata {
//    ?:?] {re:mixin,pl:accesstransformer:B,re:classloading,pl:accesstransformer:B,xf:OptiFine:default,pl:mixin:APP:cameraoverhaul.mixins.json:modern.GameRendererMixin,pl:mixin:A}

    const [jarFileAndVersion, transformerData] = metadata.split("] {");
    const [jarFile, version] = jarFileAndVersion.split(":");

    // Remove trailing '}'
    const transformerDataList = removeLastChar(transformerData).split(",");
    // When using split on an empty string it returns [""] instead of [].
    const actualTransformerDataList = transformerDataList[0] === "" ? [] : transformerDataList;
    const additionalTransformerData = [];
    const classloadingReasons = [];
    const pluginTransformerReasons = [];
    for (const transformerDataItem of actualTransformerDataList) {
        const suffix = transformerDataItem.substring(0, 2);
        // Indices 0,1,2 are used by the 're:' / 'pl:' / 'xf:'
        const data = transformerDataItem.substring(3);
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
        additionalTransformerData,
        classloadingReasons,
        pluginTransformerReasons
    };
}

function parseTraceCall(call: string): { line: TraceLine, method: JavaMethod } {
//    net.minecraft.client.renderer.GameRenderer.func_78473_a(GameRenderer.java:344)
    const [method, line] = call.split("(");
    return {
        method: parseJavaMethod(method),
        line: parseTraceLine(line)
    };
}

function parseTraceLine(line: string): TraceLine {
    const [file, lineNumber] = line.split(":");
    return {
        // If there is no line number the file will have a trailing ')' that we need to remove
        file: lineNumber !== undefined ? file : removeLastChar(file),
        number: lineNumber !== undefined ? parseInt(removeLastChar(lineNumber)) : undefined
    };
}

function splitForgeMetadata(traceElement: string): [string, string] {
    const [call, metadata] = traceElement.split("[");
    return [
        removeSuffix(call, "~").trimEnd(), //dknow what this squiggle means
        metadata
    ];
}

function removeSuffix(str: string, suffix: string): string {
    return str.endsWith(suffix) ? str.substring(0, str.length - suffix.length) : str;
}

function parseJavaMethod(methodString: string): JavaMethod {
    const parts = methodString.split(".");
    const javaClass = withoutLast(parts).join(".");
    const methodName = last(parts);
    return {
        name: methodName,
        class: parseJavaClass(javaClass)
    };
}

function parseJavaClass(classString: string): JavaClass {
    const parts = classString.split(".");
    const packageName = withoutLast(parts).join(".");
    const simpleName = last(parts);
    return {simpleName, packageName};
}

const SystemDetailsTitle = "System Details";
const FabricModsTitle = "Fabric Mods";
const ForgeModsTitle = "Mod List";
const SuspectedModsTitle = "Suspected Mods";

function getSystemDetails(report: CrashReport): CrashReportSection {
    return report.sections.find((section) => section.title === SystemDetailsTitle)!;
}

function getMods(report: CrashReport): Mod[] | undefined {
    const systemDetails = getSystemDetails(report);
    const details = systemDetails.details!;
    // Fabric uses "Fabric Mods" and Forge uses "Mod List"
    const isFabric = FabricModsTitle in details;
    const isForge = ForgeModsTitle in details;

    // If no mods appear, it's either vanilla or Fabric with no mod that adds a mod list to the crash log.
    if (!isFabric && !isForge) return undefined;

    // Forge and fabric use a different format for the mod list.
    return isFabric ? parseFabricMods(details) : parseForgeMods(details);
}

function getSuspectedModIds(systemDetails: StringMap): string[] {
    if (!(SuspectedModsTitle in systemDetails)) return [];
    const suspectedMods = systemDetails[SuspectedModsTitle];
    if (suspectedMods === "None" || suspectedMods === "Unknown") return [];

    // the format is defined like this:
    // mods.joinToString(", ") {mod -> "${mod.name} (${mod.id})"
    return suspectedMods.split(", ")
        .map((mod) => mod.substring(mod.indexOf("(") + 1, mod.length - 1));
}

function parseFabricMods(systemDetails: StringMap): Mod[] | undefined {
    const raw = systemDetails[FabricModsTitle];
    if (raw === undefined) return undefined;
    // Remove leading newline
    const noLeadingNewline = raw.substring(1);
    const suspectedMods = getSuspectedModIds(systemDetails);
    return noLeadingNewline.split("\n")
        .map((modLine) => {
            // Remove leading tab
            const noLeadingTab = modLine.substring(1);
            //Example:    betterdroppeditems: Better Dropped Items 1.3.0-1.17
            // The first word is the id, the last word is the version and the words in-between are the name.
            const words = noLeadingTab.split(" ");
            // Remove trailing ':'
            const id = removeLastChar(words[0]);
            // Get words in-between and join them
            const name = words.slice(1, words.length - 1).join(" ");
            // Get last word - the version
            const version = last(words);

            return {
                id, name, version,
                forgeMetadata: undefined,
                isSuspected: suspectedMods.includes(id)
            };
        });
}

function removeLastChar(str: string): string {
    return str.substring(0, str.length - 1);
}

function withoutLast<T>(arr: T[]): T[] {
    return arr.slice(0, arr.length - 1);
}

function last<T>(arr: T[]): T {
    return arr[arr.length - 1];
}

function parseForgeMods(systemDetails: StringMap): Mod[] {
    const raw = systemDetails[ForgeModsTitle];
    // Remove leading newline
    const noLeadingNewline = raw.substring(1);
    const suspectedMods = getSuspectedModIds(systemDetails);

    return noLeadingNewline.split("\n")
        .map((modLine) => {
            // Remove leading tab
            const noLeadingTab = modLine.substring(1);
            const [file, name, id, version, completeness, signature] = noLeadingTab.split("|")
                .map((part) => part.trimEnd());
            return {
                id, name, version,
                isSuspected: suspectedMods.includes(id),
                forgeMetadata: {file, completeness, signature}
            };
        });
}
