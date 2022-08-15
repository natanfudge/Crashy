
import {testFabricCrashReportEnrich} from "./EnrichmentTest.test";
import {testFabricCrashReportParse} from "./ParsingTest.test";
import {testFabricCrashReportUsingWindowsLines} from "./TestCrashes";
import {enrichCrashReport} from "../crash/parser/CrashReportEnricher";
import {parseCrashReport} from "../crash/parser/CrashReportParser";

test("Windows newlines can be handled", () => {
    const parsed = parseCrashReport(testFabricCrashReportUsingWindowsLines)
    const enriched = enrichCrashReport(parsed);

    testFabricCrashReportParse(parsed)
    testFabricCrashReportEnrich(enriched)
});

