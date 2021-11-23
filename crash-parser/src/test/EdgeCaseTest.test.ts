
import {testFabricCrashReportEnrich} from "./EnrichmentTest.test";
import {testFabricCrashReportParse} from "./ParsingTest.test";
import {parseCrashReport} from "../parser/CrashReportParser";
import {enrichCrashReport} from "../parser/CrashReportEnricher";
import {testFabricCrashReportUsingWindowsLines} from "./TestCrashes";

test("Windows newlines can be handled", () => {
    const parsed = parseCrashReport(testFabricCrashReportUsingWindowsLines)
    const enriched = enrichCrashReport(parsed);

    testFabricCrashReportParse(parsed)
    testFabricCrashReportEnrich(enriched)
});

