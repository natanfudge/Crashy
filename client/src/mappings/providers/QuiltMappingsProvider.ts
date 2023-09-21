import {MappingsVersion} from "./MappingsProvider";
import {MappingsFilter} from "../MappingsFilter";
import {Mappings} from "../Mappings";
import {MappingsBuilder} from "../MappingsBuilder";
import {extractTinyMappings} from "./ProviderUtils";
import {parseTinyFile} from "./TinyMappings";
import {httpGet} from "../../fudge-lib/methods/Http";

export async function getQuiltBuilds(minecraftVersion: string): Promise<string[]> {
    // Arrives in xml
    const builds = await (await httpGet({url: "https://maven.quiltmc.org/repository/release/org/quiltmc/quilt-mappings/maven-metadata.xml"})).text()
    const versionsPart = builds.removeBeforeFirstExclusive("<versions>").removeAfterLastExclusive("</versions>")
    const relevantVersions = versionsPart.split("<version>")
        .filter(versionString => versionString.startsWith(minecraftVersion + "+"))
    const versionsParsed = relevantVersions.map(v => v.removeAfterLastExclusive("</version>"))
    // Quilt has the right mappings only from 1.19.2+build.16 onwards
    if (minecraftVersion === "1.19.2") return versionsParsed.filter(v => parseInt(v.removeBeforeLastExclusive("build.")) >= 16)
    return versionsParsed
}

export async function getQuiltMappings(version: MappingsVersion, filter: MappingsFilter): Promise<Mappings> {
    const jar = await httpGet({url: "https://maven.quiltmc.org/repository/release/org/quiltmc/quilt-mappings/1.19.2+build.16/quilt-mappings-1.19.2+build.16-intermediary-v2.jar"})
    const unzipped = await extractTinyMappings(jar);

    return parseTinyFile(unzipped, filter);
}

const oldestQuiltSnapshotMain = 22
const oldestQuiltSnapshotSecondary = 42
const oldestQuiltRelease = 1_19_2

export function quiltSupportsMcVersion(version: string): boolean {
    // Try to parse the version and return anything newer than 1.18.2
    const isSnapshot = version.includes("w")
    if (isSnapshot) {
        const [main, secondary] = version.split("w")
        if (!isNumber(main)) return false
        const mainValue = parseInt(main)
        const secondaryWithoutPrefix = secondary.slice(0, -1)
        if (!isNumber(secondaryWithoutPrefix)) return false
        const secondaryValue = parseInt(secondary)
        return mainValue >= oldestQuiltSnapshotMain && secondaryValue >= oldestQuiltSnapshotSecondary
    } else {
        // Remove ".", "-pre", "-rc" and such
        const noBullshit = version.removeAfterFirst("-").replaceAll(".", "")
        return isNumber(noBullshit) && parseInt(noBullshit) >= oldestQuiltRelease
    }
}

function isNumber(str: string): boolean {
    return /^[0-9]+$/.test(str)
}