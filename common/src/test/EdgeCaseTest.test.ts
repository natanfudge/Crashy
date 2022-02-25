
import {testFabricCrashReportEnrich} from "./EnrichmentTest.test";
import {testFabricCrashReportParse} from "./ParsingTest.test";
import {parseCrashReport} from "../crash/parser/CrashReportParser";
import {enrichCrashReport} from "../crash/parser/CrashReportEnricher";
import {testFabricCrashReportUsingWindowsLines} from "./TestCrashes";

test("Windows newlines can be handled", () => {
    const parsed = parseCrashReport(testFabricCrashReportUsingWindowsLines)
    const enriched = enrichCrashReport(parsed);

    testFabricCrashReportParse(parsed)
    testFabricCrashReportEnrich(enriched)
});

