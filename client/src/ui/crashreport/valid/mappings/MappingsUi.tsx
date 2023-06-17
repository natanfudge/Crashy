
import {DesiredBuild, DesiredBuildProblem} from "../../../../mappings/resolve/MappingStrategy";
import {buildsOf} from "../../../../mappings/MappingsApi";
import {MappingsState, withBuild} from "./MappingsState";
import {MappingsController} from "./MappingsController";
import {WithChildren} from "../../../../fudge-commons/simple/SimpleElementProps";
import {MappingsSelection} from "./MappingsSelection";
import {Column} from "../../../../fudge-commons/simple/Flex";
import {usePromise} from "../../../../fudge-commons/components/PromiseBuilder";
import {useState} from "react";
import {useScreenSize} from "fudge-lib/dist/methods/Gui";
import {getVisibleMappingNamespaces} from "../../../../mappings/MappingsNamespace";
import {getUserPreferences, setUserPreferences} from "../../../../utils/Preferences";


export function WithMappings({controller, children}:
                                 { controller: MappingsController }
                                 & WithChildren) {
    return <MappingSelectionLayout selection={
        <MappingsSelection
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
        <div style={{width: "100%"}} >
            {selection}
            {children}
        </div>
}

export type MutableMappingsState = [MappingsState, (newState: MappingsState) => void]

export function useMappingsState(minecraftVersion: string): MutableMappingsState {
    // Initially, immediately show a mapping, and since getting what versions are available takes time, we'll set the version to undefined
    // for now and what the available versions load we will set it to the first available one.
    const namespaces = getVisibleMappingNamespaces(minecraftVersion);
    const initialNamespace = namespaces.find(namespace => getUserPreferences().defaultMappingNamespace === namespace)
        ?? namespaces[0]
    const [state, setState] = useState<MappingsState>(
        {
            namespace: initialNamespace,
            build: DesiredBuildProblem.BuildsLoading
        }
    )

    const actualState = withBuild(state, useBuildFor(state, minecraftVersion));
    return [actualState, (newState) => {
        setUserPreferences({defaultMappingNamespace: newState.namespace})
        setState(newState)
    }];
}

function useBuildFor(state: MappingsState, minecraftVersion: string): DesiredBuild {
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

