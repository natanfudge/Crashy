import {DesiredBuild, DesiredBuildProblem} from "../../../../mappings/resolve/MappingStrategy";
import {buildsOf} from "../../../../mappings/MappingsApi";
import {WithChildren} from "../../../../fudge-commons/simple/SimpleElementProps";
import {Column} from "../../../../fudge-commons/simple/Flex";
import {usePromise} from "fudge-lib/dist/state/UsePromise";
import {useScreenSize} from "fudge-lib/dist/methods/Gui";
import {getVisibleMappingNamespaces, MappingsNamespace} from "../../../../mappings/MappingsNamespace";
import {MappingsSelectionUi} from "./MappingsSelectionUi";
import {MappingsSelection, withBuild} from "./MappingsSelection";
import {MappingsController} from "./MappingsController";
import {PersistentValue} from "fudge-lib/dist/state/PersistentState";
import {State, useStateObject} from "fudge-lib/dist/state/State";


export function WithMappings({controller, children}:
                                 { controller: MappingsController }
                                 & WithChildren) {
    return <MappingSelectionLayout selection={
        <MappingsSelectionUi mappings={controller}/>}>
        {children}
    </MappingSelectionLayout>
}

function MappingSelectionLayout({children, selection}: { selection: JSX.Element } & WithChildren) {
    const screen = useScreenSize();
    return screen.isPortrait ? <Column>{selection}{children}</Column> :
        <div style={{width: "100%"}}>
            {selection}
            {children}
        </div>
}

// export type MutableMappingsState = [MappingsSelection, (newState: MappingsSelection) => void]

export function useMappingsSelection(minecraftVersion: string): State<MappingsSelection> {
    // Initially, immediately show a mapping, and since getting what versions are available takes time, we'll set the version to undefined
    // for now and when the available versions load we will set it to the first available one.
    const namespaces = getVisibleMappingNamespaces(minecraftVersion);
    const namespaceSelectionStore = new PersistentValue(`namespace-selection-${minecraftVersion}`)
    const previousNamespaceSelection = namespaceSelectionStore.getValue() as MappingsNamespace;
    // If the previous namespace selection is available here - use it. Otherwise - use the first available one.
    const initialNamespace = namespaces.includes(previousNamespaceSelection) ? previousNamespaceSelection : namespaces[0]

    const state = useStateObject<MappingsSelection>(
        {namespace: initialNamespace, build: DesiredBuildProblem.BuildsLoading}
    )

    // Sometimes the user build selection becomes invalid because the namespace no longer supports it.
    // So we fix up the state to have a valid build always.
    const actualState = withBuild(state.value, useBuildFor(state.value, minecraftVersion));

    return state
        .mapValue(actualState)
        .onSet(newValue => namespaceSelectionStore.setValue(newValue.namespace))
}

function useBuildFor(state: MappingsSelection, minecraftVersion: string): DesiredBuild {
    const allBuilds = usePromise(() => buildsOf(state.namespace, minecraftVersion), [state.namespace])

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

