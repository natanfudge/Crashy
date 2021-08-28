import {CrashReport, CrashReportSection, StackTrace, StackTraceElement, StringMap} from "./CrashReport";
import {
    CrashContext,
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
    RichStackTrace,
    RichStackTraceElement,
    StackTraceMessage,
    TraceLine
} from "./RichCrashReport";
import {parseCrashReport} from "./CrashReportParser";

export function parseCrashReportRich(rawReport: string): RichCrashReport {
    return enrichCrashReport(parseCrashReport(rawReport));
}

export function enrichCrashReport(report: CrashReport): RichCrashReport {
    const mods = getMods(report);
    return {
        wittyComment: report.wittyComment,
        title: report.description,
        mods: mods,
        stackTrace: enrichStackTrace(report.stacktrace),
        sections: report.sections.map((section) => enrichCrashReportSection(section)),
        context: getCrashContext(report, mods)
    };
}

const JavaVersionTitle = "Java Version";
const MinecraftVersionTitle = "Minecraft Version";
const ForgeLoaderTitle = "Forge";
const FabricLoaderId = "fabricloader";
const OperatingSystemTitle = "Operating System";

function getCrashContext(report: CrashReport, mods: Mod[]): CrashContext {
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
    } else {
        //TODO: better parsing once we can get a hold of non-windows examples
        return {
            name: osString,
            type: OperatingSystemType.Linux
        };
    }
}

function getLoader(report: CrashReport, systemDetails: StringMap, mods: Mod[]): Loader {
    const forgeEntry = systemDetails[ForgeLoaderTitle];
    if (forgeEntry !== undefined) {
        // Forge

        const [, version] = forgeEntry.split(":");
        return {
            type: LoaderType.Forge,
            version: version
        };
    } else {
        // Fabric
        const fabricLoaderMod = mods.find((mod) => mod.id === FabricLoaderId)!;
        return {
            type: LoaderType.Fabric,
            version: fabricLoaderMod.version
        };
    }
}

function parseCrashDate(dateStr: string): Date {
    // Fabric format: 20/08/2021, 7:41 OR 20/08/2021, 7:41 PM
    // Forge format: 15.08.21 17:36
    const isFabricFormat = dateStr.includes(",");
    const [date, hourStr] = dateStr.split(isFabricFormat ? ", " : " ");
    const [day, month, year] = date.split(isFabricFormat ? "/" : ".");

    const [fullHourStr, minutesStr] = hourStr.split(":");
    // Convert PM format to 24 hour format
    const fullHour = parseInt(fullHourStr) + (minutesStr.endsWith(" PM") ? 12 : 0);

    return new Date(
        parseInt(year) + (isFabricFormat ? 0 : 2000), // Forge uses '21' instead of '2021'
        parseInt(month),
        parseInt(day),
        fullHour,
        parseInt(removeSuffix(minutesStr, " PM")) // minutes
    );
}

function enrichCrashReportSection(section: CrashReportSection): RichCrashReportSection {
    const enrichedDetails: StringMap = section.thread ? {Thread: section.thread} : {};
    // eslint-disable-next-line guard-for-in
    for (const prop in section.details) {
        enrichedDetails[prop] = section.details[prop];
    }
    return {
        name: section.title,
        details: enrichedDetails,
        stackTrace: section.stacktrace ? enrichStackTraceElements(section.stacktrace) : undefined
    };
}

function enrichStackTrace(trace: StackTrace): RichStackTrace {
    return {
        causedBy: trace.causedBy ? enrichStackTrace(trace.causedBy) : undefined,
        message: enrichStackTraceMessage(trace.message),
        elements: enrichStackTraceElements(trace.trace)
    };
}

function enrichStackTraceMessage(rawMessage: string): StackTraceMessage {
    //Example: java.lang.NullPointerException: Unexpected error
    const [exception, message] = rawMessage.split(": ");
    return {
        message: message,
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
            forgeMetadata: metadata ? parseForgeTraceMetadata(metadata) : undefined
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
        file: lineNumber ? file : removeLastChar(file),
        number: lineNumber ? parseInt(removeLastChar(lineNumber)) : undefined
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

function getMods(report: CrashReport): Mod[] {
    const systemDetails = getSystemDetails(report);
    const details = systemDetails.details!;
    // Fabric uses "Fabric Mods" and Forge uses "Mod List"
    const isFabric = FabricModsTitle in details;
    const isForge = ForgeModsTitle in details;

    // If not fabric or forge, then vanilla! No mods.
    if (!isFabric && !isForge) return [];

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

function parseFabricMods(systemDetails: StringMap): Mod[] {
    const raw = systemDetails[FabricModsTitle];
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
