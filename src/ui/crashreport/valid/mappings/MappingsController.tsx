import {MappingsState} from "./MappingsState";
import {RichCrashReport, RichStackTrace, RichStackTraceElement} from "crash-parser/src/model/RichCrashReport";
import {MappingContext} from "../../../../mappings/resolve/MappingStrategy";
import {useMemo} from "react";
import {HashSet} from "../../../../utils/hashmap/HashSet";
import {BasicMappable} from "crash-parser/src/model/Mappable";
import {useMappingsState} from "./MappingsUi";

export class MappingsController {
    mappingsState: MappingsState
    onMappingsStateChanged: (newState: MappingsState) => void
    report: RichCrashReport

    constructor(report: RichCrashReport) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [mappingsState, setMappingsState] = useMappingsState(report.context.minecraftVersion);
        this.mappingsState = mappingsState
        this.onMappingsStateChanged = setMappingsState;
        this.report = report;
    }

    getContext(): MappingContext {
        // eslint-disable-next-line react-hooks/rules-of-hooks
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

function findAllMappablesInReport(report: RichCrashReport): HashSet<BasicMappable> {
    const all = HashSet.ofCapacity<BasicMappable>(50)
    visitStackTrace(all, report.stackTrace)
    report.sections.forEach(section => {
        if (section.stackTrace !== undefined) visitElements(all, section.stackTrace)
    })
    return all
}

function visitStackTrace(all: HashSet<BasicMappable>, stackTrace: RichStackTrace) {
    visitElements(all, stackTrace.elements)
    all.put(stackTrace.title.class)
    if (stackTrace.causedBy !== undefined) {
        visitStackTrace(all, stackTrace.causedBy)
    }
}

function visitElements(all: HashSet<BasicMappable>, elements: RichStackTraceElement[]) {
    elements.forEach(element => {
        if (typeof element !== "number") {
            all.put(element.method)
            all.put(element.method.classIn)
        }
    })
}
