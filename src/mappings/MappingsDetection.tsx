import {RichCrashReport, RichStackTraceElement} from "crash-parser/src/model/RichCrashReport";
import {MappingsNamespace} from "./MappingsNamespace";
//
// export function detectMappings(report: RichCrashReport): MappingsNamespace {
//     //TODO: we need very special handling for nec deobfuscated mappings,
//     // because some identifiers will be in intermediary and some in yarn, because some intermediary names are not mapped to yarn yet.
//
//     //TODO:
//     if (report.deobfuscated) return "Yarn";
//     if (report.stackTrace.elements.some(element => isIntermediaryName(element))) return "Intermediary";
//     if (report.mods.some)
//         }
//
//
//
// export function hasNecDeobfuscation(report: RichCrashReport): boolean {
//     const firstElement = report.stackTrace.elements[0];
//     return false;
//     // return typeof firstElement !== "number" && firstElement.
// }
