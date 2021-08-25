import {CrashReport, StringMap} from "./CrashReport";
import {LoaderType, Mod, OperatingSystemType, RichCrashReport} from "./RichCrashReport";

export function enrichCrashReport(report: CrashReport): RichCrashReport {

    return {
        wittyComment: report.wittyComment,
        title: report.description,
        mods: getMods(report),
        stackTrace: {
            elements: [],
            message: {
                message: "",
                class: {
                    packageName : "",
                    simpleName: ""
                }
            },
            causedBy: undefined
        },
        sections: [],
        context: {
            time: new Date(),
            javaVersion :"",
            minecraftVersion: "",
            loader: {
                type: LoaderType.Fabric,
                version: ""
            },
            operatingSystem: {
                name: "",
                type: OperatingSystemType.Windows
            }
        }
    }
}

const SystemDetailsTitle = "System Details"
const FabricModsTitle = "Fabric Mods"
const ForgeModsTitle = "Mod List"
const SuspectedModsTitle = "Suspected Mods"

function getMods(report: CrashReport): Mod[] {
    const systemDetails = report.sections.find(section => section.title === SystemDetailsTitle)!
    const details = systemDetails.details!
    // Fabric uses "Fabric Mods" and Forge uses "Mod List"
    const isFabric = FabricModsTitle in details
    const isForge = ForgeModsTitle in details

    // If not fabric or forge, then vanilla! No mods.
    if (!isFabric && !isForge) return [];

    // Forge and fabric use a different format for the mod list.
    return isFabric ? parseFabricMods(details) : parseForgeMods(details)
}

function getSuspectedModIds(systemDetails: StringMap): string[] {
    if (!(SuspectedModsTitle in systemDetails)) return [];
    const suspectedMods = systemDetails[SuspectedModsTitle];
    if (suspectedMods === "None" || suspectedMods === "Unknown") return [];

    // the format is defined like this:
    // mods.joinToString(", ") {mod -> "${mod.name} (${mod.id})"
    return suspectedMods.split(", ")
        .map(mod => mod.substring(mod.indexOf("(") + 1, mod.length - 1))
}

function parseFabricMods(systemDetails: StringMap): Mod[] {
    const raw = systemDetails[FabricModsTitle]
    // Remove leading newline
    const noLeadingNewline = raw.substring(1)
    const suspectedMods = getSuspectedModIds(systemDetails);
    const mods = noLeadingNewline.split("\n")
        .map(modLine => {
            // Remove leading tab
            const noLeadingTab = modLine.substring(1)
            //Example:    betterdroppeditems: Better Dropped Items 1.3.0-1.17
            // The first word is the id, the last word is the version and the words in-between are the name.
            const words = noLeadingTab.split(" ")
            // Remove trailing ':'
            const id = removeLastChar(words[0])
            // Get words in-between and join them
            const name = words.slice(1, words.length - 1).join(" ")
            // Get last word - the version
            const version = last(words)

            return {
                id: id,
                name: name,
                version: version,
                forgeMetadata: undefined,
                isSuspected: suspectedMods.includes(id)
            }
        })

    return mods;
}

function removeLastChar(str: string): string {
    return str.substring(0, str.length - 1)
}

function last<T>(arr: T[]): T {
    return arr[arr.length - 1]
}

function parseForgeMods(systemDetails: StringMap): Mod[] {
    return [] //TODO
}