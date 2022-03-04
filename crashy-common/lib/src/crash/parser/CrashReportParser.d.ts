import { CrashReport } from "../model/CrashReport";
import "../../util/ExtensionsImpl";
export declare function parseCrashReport(rawReport: string): CrashReport;
export declare function parseCrashReportImpl(rawReport: string, strict: boolean): CrashReport;
