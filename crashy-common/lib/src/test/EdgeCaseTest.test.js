"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EnrichmentTest_test_1 = require("./EnrichmentTest.test");
var ParsingTest_test_1 = require("./ParsingTest.test");
var CrashReportParser_1 = require("../crash/parser/CrashReportParser");
var CrashReportEnricher_1 = require("../crash/parser/CrashReportEnricher");
var TestCrashes_1 = require("./TestCrashes");
test("Windows newlines can be handled", function () {
    var parsed = (0, CrashReportParser_1.parseCrashReport)(TestCrashes_1.testFabricCrashReportUsingWindowsLines);
    var enriched = (0, CrashReportEnricher_1.enrichCrashReport)(parsed);
    (0, ParsingTest_test_1.testFabricCrashReportParse)(parsed);
    (0, EnrichmentTest_test_1.testFabricCrashReportEnrich)(enriched);
});
