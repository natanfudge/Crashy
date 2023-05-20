import {MappingsVersion} from "./MappingsProvider";
import {MappingsFilter} from "../MappingsFilter";
import {Mappings} from "../Mappings";
import {MappingsBuilder} from "../MappingsBuilder";
import {httpGet} from "fudge-lib/dist/methods/Http";

export async function getQuiltBuilds(minecraftVersion: string): Promise<string[]> {
    return []
    // Arrives in xml
    // const builds = await (await httpGet({url: "https://maven.quiltmc.org/repository/release/org/quiltmc/quilt-mappings/maven-metadata.xml"})).text()
    // //TODO: add removeBeforeFirst
    // const versionsPart = builds.removeBeforeFirst("<versions>").removeAfterLast("</versions>")
    // const relevantVersions = versionsPart.split("<version>")
    //     .filter(versionString => versionString.startsWith(minecraftVersion))
    // const versionsParsed = relevantVersions.map(v => v.removeSuffix("</version>"))
    // return versionsParsed
}

export async function getQuiltMappings(version: MappingsVersion, filter: MappingsFilter): Promise<Mappings> {
    const mappings = new MappingsBuilder(filter, "Quilt")

    return mappings.build()
}

const oldestQuiltSnapshotMain = 22
const oldestQuiltSnapshotSecondary = 14
const oldestQuiltRelease = 1_18_2

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