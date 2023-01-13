
import {testFabricCrashReportEnrich} from "./EnrichmentTest.test";
import {testFabricCrashReportParse} from "./ParsingTest.test";
import {testFabricCrashReportUsingWindowsLines} from "../testlogs/TestCrashes";
import {enrichCrashReport, parseCrashReportRich} from "../../crash/parser/CrashReportEnricher";
import {parseCrashReport} from "../../crash/parser/CrashReportParser";
import "../../fudge-commons/extensions/ExtensionsImpl"
import {TestBadDate} from "../testlogs/TestBadDate";
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