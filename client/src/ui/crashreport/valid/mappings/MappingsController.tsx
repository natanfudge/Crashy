import {MappingsState} from "./MappingsState";
import {useMappingsState} from "./MappingsUi";
import {MappingContext} from "../../../../mappings/resolve/MappingStrategy";
import {RichCrashReport, RichStackTrace, RichStackTraceElement} from "../../../../crash/model/RichCrashReport";
import {useMemo} from "react";
import {SimpleMappable} from "../../../../crash/model/Mappable";
import {HashSet} from "fudge-lib/src/collections/hashmap/HashSet";
// import {HashSet} from "../../fudge-lib/src/collections/hashmap/HashSet";

export class MappingsController {
    mappingsState: MappingsState
    onMappingsStateChanged: (newState: MappingsState) => void
    report: RichCrashReport

    constructor(report: RichCrashReport) {
        const [mappingsState, setMappingsState] = useMappingsState(report.context.minecraftVersion);
        this.mappingsState = mappingsState
        this.onMappingsStateChanged = setMappingsState;
        this.report = report;
    }

    getContext(): MappingContext {
        const mappables = useMemo(() => findAllMappablesInReport(this.report), [this.report])
        return {
            relevantMappables: mappables,
            desiredBuild: this.mappingsState.build,
            desiredNamespace: this.mappingsState.namespace,
            isDeobfuscated: this.report.deobfuscated,
            loader: this.report.context.loader.type,
            minecraftVersion: this.report.context.minecraftVersion
        }
    }
}

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
