import {parseCrashReport} from "../../crash/parser/CrashReportParser";
import {BarebonesFabricCrash} from "../testlogs/BarebonesFabricCrash";
import {enrichCrashReport} from "../../crash/parser/CrashReportEnricher";
import {LoaderType} from "../../crash/model/RichCrashReport";
import {OnePointTwelveForgeCrash} from "../testlogs/1.12.2Crash";
import "../../fudge-lib/extensions/ExtensionsImpl"
import {OnePointTenForgeCrash} from "../testlogs/1.10.2Crash";
import {expect, test} from 'vitest'

test("1.12.2 Forge crash parse doesn't fail", () => {
    const report = parseCrashReport(OnePointTwelveForgeCrash)
    const enriched = enrichCrashReport(report);
    expect(enriched.context.loader.type).toEqual(LoaderType.Forge)
    const x= 2;
    // expect(enriched.context.loader.type).toEqual(LoaderType.Fabric);
    // expect(enriched.context.loader.version).toEqual(undefined);
    // expect(enriched.mods).toEqual(undefined);
})
test("1.10.2 Forge crash parse doesn't fail", () => {
    const report = parseCrashReport(OnePointTenForgeCrash)
    const enriched = enrichCrashReport(report);
    expect(enriched.context.loader.type).toEqual(LoaderType.Forge)
    expect(enriched.sections.length).toEqual(3)
    const x= 2;
    // expect(enriched.context.loader.type).toEqual(LoaderType.Fabric);
    // expect(enriched.context.loader.version).toEqual(undefined);
    // expect(enriched.mods).toEqual(undefined);
})