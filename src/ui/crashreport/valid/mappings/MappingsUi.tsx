import {WithChildren} from "../../../utils/simple/SimpleElementProps";
import {useScreenSize} from "../../../../utils/Gui";
import {Column} from "../../../utils/simple/Flex";
import React, {useMemo, useState} from "react";
import {MappingsSelection} from "./MappingsSelection";
import {usePromise} from "../../../utils/PromiseBuilder";
import {RichCrashReport, RichStackTrace, RichStackTraceElement} from "crash-parser/src/model/RichCrashReport";
import {DesiredBuild, DesiredBuildProblem, MappingContext} from "../../../../mappings/resolve/MappingStrategy";
import {buildsOf, useAnyMappingsLoading} from "../../../../mappings/MappingsApi";
import {HashSet} from "../../../../utils/hashmap/HashSet";
import {BasicMappable} from "../../../../mappings/Mappable";
import {MappingsState, withBuild} from "./MappingsState";

export class MappingsController {
    mappingsState: MappingsState
    onMappingsStateChanged: (newState: MappingsState) => void
    report: RichCrashReport

    constructor(report: RichCrashReport) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [mappingsState, setMappingsState] = useMappingsState(report.context.minecraftVersion);
        this.mappingsState = mappingsState
        this.onMappingsStateChanged = setMappingsState;
        // eslint-disable-next-line react-hooks/rules-of-hooks
        // this.mappings = useMappings(this.mappingsState)
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


export function WithMappings({controller, children}:
                                 { controller: MappingsController }
                                 & WithChildren) {
    const mappingsLoading = useAnyMappingsLoading();
    return <MappingSelectionLayout selection={
        <MappingsSelection mappingsLoading={mappingsLoading}
                           mappings={controller.mappingsState}
                           onMappingsChange={controller.onMappingsStateChanged}
                           minecraftVersion={controller.report.context.minecraftVersion}/>
    }>
        {children}
    </MappingSelectionLayout>
}

function MappingSelectionLayout({children, selection}: { selection: JSX.Element } & WithChildren) {
    const screen = useScreenSize();
    return screen.isPortrait ? <Column>{selection}{children}</Column> :
        <div style={{width: "100%"}} /*width={"max"}*/>

            {selection}
            {/*<Spacer flexGrow={1}/>*/}
            {children}
        </div>
}

export type MutableMappingsState = [MappingsState, (newState: MappingsState) => void]

export function useMappingsState(minecraftVersion: string): MutableMappingsState {
    // Initially, immediately show a mapping, and since getting what versions are available takes time, we'll set the version to undefined
    // for now and what the available versions load we will set it to the first available one.
    const [state, setState] = useState<MappingsState>(
        {
            namespace: "Yarn",
            build: DesiredBuildProblem.BuildsLoading
        }
    )

    const actualState = withBuild(state, useDetermineBuildToUse(state, minecraftVersion));
    return [actualState, setState];
}

function useDetermineBuildToUse(state: MappingsState, minecraftVersion: string): DesiredBuild {
    const allBuilds = usePromise(buildsOf(state.namespace, minecraftVersion), [state.namespace])

    // If the user has chosen something, use it.
    if (state.build !== DesiredBuildProblem.BuildsLoading) return state.build;
    // If loading...
    if (allBuilds === undefined) return DesiredBuildProblem.BuildsLoading;
    // If finished loading but the user has not chosen anything
    if (allBuilds.length === 0) {
        return DesiredBuildProblem.NoBuildsForNamespace
    } else {
        // Choose the first build automatically
        return allBuilds[0]
    }
}

// export function useMappings(mappingsState: MappingsState): Mappings {
//     const build = mappingsState.build
//     const promise = build !== undefined ? getMappingsCached(IntermediaryToYarnMappingsProvider, build) : EmptyMappings
//     return usePromise(promise, [build]) ?? LoadingMappings;
// }
