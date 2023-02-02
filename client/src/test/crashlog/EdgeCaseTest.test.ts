import {testFabricCrashReportEnrich} from "./EnrichmentTest.test";
import {testFabricCrashReportParse} from "./ParsingTest.test";
import {testFabricCrashReportUsingWindowsLines} from "../testlogs/TestCrashes";
import {enrichCrashReport, parseCrashReportRich} from "../../crash/parser/CrashReportEnricher";
import {parseCrashReport} from "../../crash/parser/CrashReportParser";
import "../../fudge-commons/extensions/ExtensionsImpl"
import {TestBadDate} from "../testlogs/TestBadDate";
import {RenderingOverlayProblematicCrash} from "../testlogs/RenderingOverlayProblematicCrash";
import {SeeminglyInnocentCrashTest} from "../testlogs/SeeminglyInnocentCrashTest";
import {firstMigratedLog} from "../testlogs/FirstMigratedLog";
import {LastMinuteFailingLog} from "../testlogs/LastMinuteFailingLog";

test("Windows newlines can be handled", () => {
    const parsed = parseCrashReport(testFabricCrashReportUsingWindowsLines)
    const enriched = enrichCrashReport(parsed);

    testFabricCrashReportParse(parsed)
    testFabricCrashReportEnrich(enriched)
});

test("Date is parsed correctly in 2021-12-24 format", () => {
    const enriched = parseCrashReportRich(TestBadDate)
    const time = enriched.context.time;
    expect(time.getFullYear()).toEqual(2021)
    expect(time.getMonth()).toEqual(11)
    expect(time.getDate()).toEqual(24)
})

test("RenderingOverlayProblematicCrash can be parsed", () => {
    const enriched = parseCrashReportRich(RenderingOverlayProblematicCrash)
    expect(enriched.sections[2].details!["Recovery"]).toEqual("Yes")
    expect(enriched.mods !== undefined).toBeTruthy()
})

test("Seemingly innocent crash log can be parsed", () => {
    const enriched = parseCrashReportRich(SeeminglyInnocentCrashTest.replaceAll("    ", "\t"))
    expect(enriched.context.loader.version).toEqual("9.1.3+9.1.3+main.9b69c82a")
})

test("First migrated crash can be parsed", () => {
    const enriched = parseCrashReportRich(firstMigratedLog)
    expect(enriched.sections)
})

test("Last minute failing log can be parsed", () => {
    const enriched = parseCrashReportRich(LastMinuteFailingLog)
    // expect(enriched.sections)
})