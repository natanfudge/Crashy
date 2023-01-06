
import {testFabricCrashReportEnrich} from "./EnrichmentTest.test";
import {testFabricCrashReportParse} from "./ParsingTest.test";
import {testFabricCrashReportUsingWindowsLines} from "../testlogs/TestCrashes";
import {enrichCrashReport} from "../../crash/parser/CrashReportEnricher";
import {parseCrashReport} from "../../crash/parser/CrashReportParser";
import "../../fudge-commons/extensions/ExtensionsImpl"
test("Windows newlines can be handled", () => {
    const parsed = parseCrashReport(testFabricCrashReportUsingWindowsLines)
    const enriched = enrichCrashReport(parsed);

    testFabricCrashReportParse(parsed)
    testFabricCrashReportEnrich(enriched)
});
