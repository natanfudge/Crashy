import {expect, test} from "vitest";
import {parseCrashReport} from "../../crash/parser/CrashReportParser";
import {OnePointTwelveForgeCrash} from "../testlogs/1.12.2Crash";
import {enrichCrashReport} from "../../crash/parser/CrashReportEnricher";
import {LoaderType} from "../../crash/model/RichCrashReport";
import {TestQuiltLog} from "../testlogs/Quilt";
import {TestQuiltLittleModsLog} from "../testlogs/QuiltLittleMods";

test("Quilt log can be parsed", () => {
    const report = parseCrashReport(TestQuiltLog)
    expect(report.dateTime).toEqual("2023/05/14 08:25:36.8724")
    const enriched = enrichCrashReport(report)
    // const enriched = enrichCrashReport(report);
    // expect(enriched.context.loader.type).toEqual(LoaderType.Forge)
    // const x= 2;
    // expect(enriched.context.loader.type).toEqual(LoaderType.Fabric);
    // expect(enriched.context.loader.version).toEqual(undefined);
    // expect(enriched.mods).toEqual(undefined);
})
test("Quilt log with a small amount of mods can be parsed", () => {
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