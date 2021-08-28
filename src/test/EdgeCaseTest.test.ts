import {parseCrashReport} from "../model/CrashReportParser";
import {testFabricCrashReport, testFabricCrashReportUsingWindowsLines} from "../model/TestCrashes";
import {enrichCrashReport} from "../model/CrashReportEnricher";
import {testFabricCrashReportEnrich} from "./EnrichmentTest.test";
import {testFabricCrashReportParse} from "./ParsingTest.test";

test("Windows newlines can be handled", () => {
    const parsed = parseCrashReport(testFabricCrashReportUsingWindowsLines)
    const enriched = enrichCrashReport(parsed);

    testFabricCrashReportParse(parsed)
    testFabricCrashReportEnrich(enriched)
});
