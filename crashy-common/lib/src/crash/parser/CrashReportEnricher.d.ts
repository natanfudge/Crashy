import { CrashReport } from "../model/CrashReport";
import { RichCrashReport } from "../model/RichCrashReport";
import "../../util/Extensions";
export declare function parseCrashReportRich(rawReport: string): RichCrashReport;
export declare function enrichCrashReport(report: CrashReport): RichCrashReport;
