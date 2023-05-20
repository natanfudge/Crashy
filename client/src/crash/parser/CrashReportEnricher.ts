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
import "fudge-lib/dist/extensions/Extensions"
import {JavaClass, SimpleMethod} from "../model/Mappable";
import {typedKeys} from "fudge-lib/dist/methods/Typescript";

export function parseCrashReportRich(rawReport: string): RichCrashReport {
    return enrichCrashReport(parseCrashReport(rawReport));
}

export function enrichCrashReport(report: CrashReport): RichCrashReport {
    const mods = getMods(report);
    const context = getCrashContext(report, mods)
    return {
        wittyComment: report.wittyComment,
        title: report.description,
        mods,
        stackTrace: enrichStackTrace(report.stacktrace),
        sections: report.sections.map((section) => enrichCrashReportSection(section)),
        context,
        rawText: report.rawText,
        deobfuscated: isNecDeobfuscated(report)
    };
}

function isNecDeobfuscated(report: CrashReport): boolean {
    if (report.stacktrace.trace.isEmpty()) return false;
    return report.stacktrace.trace[0].startsWith("Not Enough Crashes deobfuscated stack trace.(")
}

const JavaVersionTitle = "Java Version";
const JavaModId = "java"
const MinecraftVersionTitle = "Minecraft Version";
const ForgeLoaderTitle = "Forge";
const FMLTitle = "FML";
const ModLauncherTitle = "ModLauncher";
const FabricLoaderId = "fabricloader";
const QuiltLoaderId = "quilt_loader"
const OperatingSystemTitle = "Operating System";
const IsModdedTitle = "Is Modded"
const MinecraftModId = "minecraft"

function getCrashContext(report: CrashReport, mods?: Mod[]): CrashContext {
    const systemDetails = getSystemDetails(report).details!;
    //16.0.2, Oracle Corporation
    // Brand ignored
    const javaVersionString = systemDetails[JavaVersionTitle] ?? mods?.find(mod => mod.id === JavaModId)?.version
    const [javaVersion] = javaVersionString.split(",");
    const loader = getLoader(report, systemDetails, mods)

    return {
        time: parseCrashDate(report.dateTime, report.description === undefined),
        javaVersion: javaVersion,
        minecraftVersion: systemDetails[MinecraftVersionTitle] ?? mods?.find(mod => mod.id === MinecraftModId)?.version,
        loader: loader,
        operatingSystem: parseOperatingSystem(systemDetails[OperatingSystemTitle])
    };
}

function parseOperatingSystem(osString: string | undefined): OperatingSystem | undefined {
    if (osString === undefined) return undefined
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
    }

    const modLauncherEntry = systemDetails[ModLauncherTitle]
    if (modLauncherEntry !== undefined) {
        // Sometimes forge doesn't show up and we have 'Mod Launcher' instead
        return {
            type: LoaderType.Forge,
            version: modLauncherEntry
        }
    }

    const fmlEntry = systemDetails[FMLTitle]
    if (fmlEntry !== undefined) {
        return {
            type: LoaderType.Forge,
            // Actually parsing the version is too much effort for such an old minecraft version
            version: "(FML)"
        }
    }

    if (mods !== undefined) {
        const quiltLoaderMod = mods.find((mod) => mod.id === QuiltLoaderId)
        // Quilt loader exists - it's quilt
        if (quiltLoaderMod !== undefined) {
            return {
                type: LoaderType.Quilt,
                version: quiltLoaderMod.version
            }
        } else {
            // If mods exists, and not forge or quilt, then it's definitely Fabric and we have the version available
            const fabricLoaderMod = mods.find((mod) => mod.id === FabricLoaderId)!;
            return {
                type: LoaderType.Fabric,
                version: fabricLoaderMod.version
            };
        }

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

function parseConciseDate(dateStr: string): Date {
    // Concise format: 2023/05/14 08:25:36.8724
    const [date, time] = dateStr.split(" ")
    const [year, month, day] = date.split("/")
    // A quiltSecond is 1/10_000th of a second. Fuck you random quilt mod.
    const [hourMinuteSecond, quiltSecond] = time.split(".")
    const [hour, minute, second] = hourMinuteSecond.split(":")
    return new Date( // Javascript Date month is 0-indexed
        parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hour), parseInt(minute), parseInt(second), parseInt(quiltSecond) / 10
    )
}

function parseNormalDate(dateStr: string) {
    // Fabric format: 20/08/2021, 7:41 OR 20/08/2021, 7:41 PM
    // Forge format: 15.08.21 17:36
    const isFabricFormat = dateStr.includes(",");
    const [date, hourStr] = dateStr.split(isFabricFormat ? ", " : " ");
    const {day, month, year} = parseDayMonthYear(date);
    const [fullHourStr, minutesStr, secondStr] = hourStr.removeSuffix(" a.m.").split(":");
    // Convert PM format to 24 hour format
    const fullHour = parseInt(fullHourStr) + (minutesStr.endsWith(" PM") ? 12 : 0);

    const yearNumber = parseInt(year);
    // Add the 2000s when the 20 at the start is omitted, e.g. "08/20/21"
    const actualYear = yearNumber < 1920 ? yearNumber + 2000 : yearNumber;

    return createDate(
        actualYear,
        parseInt(month) - 1, // Javascript Date month is 0-indexed
        parseInt(day),
        fullHour,
        parseInt(removeSuffix(minutesStr, " PM")), // minutes
        secondStr !== undefined ? parseInt(secondStr) : undefined // seconds
    );
}

function createDate(year: number, month: number, day: number, hour: number, minute: number, second: number | undefined): Date {
    if (second !== undefined) {
        return new Date(year, month, day, hour, minute, second)
    } else {
        return new Date(year, month, day, hour, minute)
    }
}

function parseCrashDate(dateStr: string, isConcise: boolean): Date {
    if (isConcise) {
        return parseConciseDate(dateStr)
    } else {
        return parseNormalDate(dateStr);
    }
}

function parseDayMonthYear(rawDate: string): { day: string, month: string, year: string } {
    // Sometimes the date is in year-month-day format
    if (rawDate.includes("-")) {
        const [year, month, day] = rawDate.split("-");
        return {day, month, year};
    }
    const [left, right, year] = rawDate.split(rawDate.includes("/") ? "/" : ".");

    const [day, month] = isDayMonthYear(left, right, rawDate) ? [left, right] : [right, left];
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

function parseTraceCall(call: string): { line: TraceLine, method: SimpleMethod } {
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

function parseJavaMethod(methodString: string): SimpleMethod {
    const parts = methodString.split(".");
    const javaClass = withoutLast(parts).join(".");
    const methodName = last(parts);
    return new SimpleMethod(parseJavaClass(javaClass), methodName)
}

function parseJavaClass(classString: string): JavaClass {
    return JavaClass.dotSeperated(classString);
}

export const SystemDetailsTitle = "System Details";
const FabricModsTitle = "Fabric Mods";
const ForgeModsTitle = "Mod List";
export const QuiltModsTitle = "Quilt Mods"
const SuspectedModsTitle = "Suspected Mods";

function getSystemDetails(report: CrashReport): CrashReportSection {
    return report.sections.find((section) => section.title === SystemDetailsTitle)!;
}

function getMods(report: CrashReport): Mod[] | undefined {
    const systemDetails = getSystemDetails(report);
    // Forge, Fabric and Quilt use a different format for the mod list.
    const mods = parseMods(systemDetails.details!)
    // Trim whitespace
    return mods?.map(mod => ({...mod, id: mod.id.trim()}))
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

function parseMods(systemDetails: StringMap): Mod[] | undefined {
    // Fabric uses "Fabric Mods" and Forge uses "Mod List"
    // Quilt mods is inserted by us in the parsing step.
    if (FabricModsTitle in systemDetails) {
        // Fabric
        return parseFabricMods(systemDetails)
    } else if (ForgeModsTitle in systemDetails) {
        return parseForgeMods(systemDetails)
    } else if (QuiltModsTitle in systemDetails) {
        return parseQuiltMods(systemDetails)
    }
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

function parseQuiltMods(systemDetails: StringMap): Mod[] {
    const raw = systemDetails[QuiltModsTitle]
    return raw.split("\n")
        // Get rid of non-mod lines in the table
        .filter(line => line !== "" && line !== "\t" && !line.startsWith("\t| Index") && !line.startsWith("\t|----"))
        .map(line => {
            // |   143 | Advancement Plaques | advancementplaques  | 1.4.6  | Fabric  | 4af48cf2e71ea3f1ba7987b3bf39662ae3838714 | <mods>\[进度牌匾] AdvancementPlaques-1.19.2-fabric-1.4.6.jar |  |
            const [_, index, name, id, version, type, hash, file, subFile] = line.split("|")
                .map(part => part.trim())
            return {
                id, name, version, isSuspected: false
            }
        })
}