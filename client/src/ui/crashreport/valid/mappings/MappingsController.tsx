import {MappingsSelection} from "./MappingsSelection";
import {useMappingsSelection} from "./MappingsUi";
import {RichCrashReport, RichStackTrace, RichStackTraceElement} from "../../../../crash/model/RichCrashReport";
import {useMemo, useState} from "react";
import {SimpleMappable} from "../../../../crash/model/Mappable";
import {HashSet} from "fudge-lib/dist/collections/hashmap/HashSet";
import {
    getMappingForContext,
    IdentityMapping,
    MappingContext,
    MappingStrategy
} from "../../../../mappings/resolve/MappingStrategy";
import {MappingsNamespace} from "../../../../mappings/MappingsNamespace";
import {usePromise} from "fudge-lib/dist/state/UsePromise";
import {detectMappingNamespace} from "../../../../mappings/resolve/MappingDetector";

// import {HashSet} from "fudge-lib/dist/collections/hashmap/HashSet";


/**
 * Returns undefined if mappings are loading
 */
export function useMappings(report: RichCrashReport): MappingsController {
    const minecraftVersion = report.context.minecraftVersion;
    const [selection, onSelectionChanged] = minecraftVersion !== undefined ? useMappingsSelection(minecraftVersion).destruct()
        // Provide a dummy selection in case there's no minecraft version available
        : useState<MappingsSelection>({namespace: "Yarn", build: "1"})
    const strategy = getStrategy()

    return {
        selection: selection,
        minecraftVersion: report.context.minecraftVersion,
        onSelectionChanged: onSelectionChanged,
        strategy: strategy ?? IdentityMapping,
        isLoading: strategy === undefined
    }

    function getStrategy(): MappingStrategy | undefined {
        const mappables = useMemo(() => findAllMappablesInReport(report), [report])
        const originalNamespace = useMemo(() => detectReportMappingsNamespace(mappables, report), [report])
        if (originalNamespace === undefined) return IdentityMapping
        const context: MappingContext = {
            relevantMappables: mappables,
            desiredBuild: selection.build,
            desiredNamespace: selection.namespace,
            minecraftVersion: report.context.minecraftVersion,
            originalNamespace
        }
        // console.log(Object.values(context))
        // return IdentityMapping
        return usePromise(
            () => getMappingForContext(context), [selection.namespace, selection.build]
        )
    }

}

export interface MappingsController {
    selection: MappingsSelection
    onSelectionChanged: (newState: MappingsSelection) => void
    minecraftVersion: string | undefined
    strategy: MappingStrategy
    isLoading: boolean
}

function detectReportMappingsNamespace(mappables: HashSet<SimpleMappable>, report: RichCrashReport): MappingsNamespace | undefined {
    if (mappables.isEmpty) return undefined
    else {
        return detectMappingNamespace(mappables.toArray()[0], report)
    }
}

// interface MappingsController {
//     //TODO: rename to selection
//     mappingsState: MappingsSelection,
//     //TODO: rename to onSelectionChanged
//     onMappingsStateChanged: (newState: MappingsSelection) => void
//     report: RichCrashReport
//     strategy:
// }

// export class MappingsController {
//
//
//     // strategy
//
//     constructor(report: RichCrashReport) {
//         const [mappingsState, setMappingsState] = useMappingsState(report.context.minecraftVersion);
//         this.selection = mappingsState
//         this.onSelectionChanged = setMappingsState;
//         this.report = report;
//     }
// }

function findAllMappablesInReport(report: RichCrashReport): HashSet<SimpleMappable> {
    const all = HashSet.ofCapacity<SimpleMappable>(50)
    visitStackTrace(all, report.stackTrace)
    report.sections.forEach(section => {
        if (section.stackTrace !== undefined) visitElements(all, section.stackTrace)
    })
    return all
}

function visitStackTrace(all: HashSet<SimpleMappable>, stackTrace: RichStackTrace) {
    visitElements(all, stackTrace.elements)
    all.put(stackTrace.title.class)
    if (stackTrace.causedBy !== undefined) {
        visitStackTrace(all, stackTrace.causedBy)
    }
}

function visitElements(all: HashSet<SimpleMappable>, elements: RichStackTraceElement[]) {
    elements.forEach(element => {
        if (typeof element !== "number") {
            all.put(element.method)
            all.put(element.method.classIn)
        }
    })
}
