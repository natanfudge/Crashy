import {expect, test} from "vitest";
import {parseCrashReport} from "../../crash/parser/CrashReportParser";
import {OnePointTwelveForgeCrash} from "../testlogs/1.12.2Crash";
import {enrichCrashReport} from "../../crash/parser/CrashReportEnricher";
import {LoaderType} from "../../crash/model/RichCrashReport";
import {TestQuiltLog} from "../testlogs/ConciseQuilt";
import {TestQuiltLittleModsLog} from "../testlogs/QuiltLittleMods";
import {QuiltFabricLog} from "../testlogs/QuiltFabric";

test("Concise log can be parsed", () => {
    const report = parseCrashReport(TestQuiltLog)
    expect(report.dateTime).toEqual("2023/05/14 08:25:36.8724")
    const enriched = enrichCrashReport(report)
    expect(enriched.context.time).toEqual(new Date(2023,4, 14, 8, 25, 36, 872))
    expect(enriched.context.javaVersion).toEqual("18")
    expect(enriched.mods![0]).toEqual({
        id: "advancementplaques",
        name: "Advancement Plaques",
        version: "1.4.6",
        isSuspected: false
    })
        expect(enriched.mods![2]).toEqual({
        id: "appleskin",
        name: "AppleSkin",
        version: "2.4.1+mc1.19",
        isSuspected: false
    })

    expect(enriched.context.loader).toEqual({
        type: LoaderType.Quilt,
        version: "0.19.0-beta.13"
    })

    expect(enriched.context.operatingSystem).toEqual(undefined)
    //TODO: also need to sort out quilt crash to look better
    expect(enriched.context.minecraftVersion).toEqual("1.19.2")
})
test("Concise log with a small amount of mods can be parsed", () => {
    const report = parseCrashReport(TestQuiltLittleModsLog)
    expect(report.dateTime).toEqual("2023/05/14 08:25:36.8724")
    const enriched = enrichCrashReport(report)
    // const enriched = enrichCrashReport(report);
    // expect(enriched.context.loader.type).toEqual(LoaderType.Forge)
    // const x= 2;
    // expect(enriched.context.loader.type).toEqual(LoaderType.Fabric);
    // expect(enriched.context.loader.version).toEqual(undefined);
    // expect(enriched.mods).toEqual(undefined);
})
test("Fabric-Quilt log can be parsed", () => {
    const report = parseCrashReport(QuiltFabricLog)
    expect(report.stacktrace.causedBy?.causedBy?.causedBy?.causedBy?.causedBy).not.toEqual(undefined)
    const enriched = enrichCrashReport(report)
    // 2023-05-19 21:33:02
    expect(enriched.context.time).toEqual(new Date(2023,4, 19, 21,33,2))
    expect(enriched.mods).toContainEqual({
        id: "completeconfig-gui-yacl",
        name: "completeconfig-gui-yacl",
        version: "2.3.0",
        isSuspected: false
    })
    expect(enriched.mods).toContainEqual({
        id: "continuity",
        name: "Continuity",
        version: "2.0.2+1.19",
        isSuspected: false
    })
})