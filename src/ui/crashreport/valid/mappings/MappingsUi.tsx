import {WithChildren} from "../../../utils/simple/SimpleElementProps";
import {useScreenSize} from "../../../../utils/Gui";
import {Column, Row} from "../../../utils/simple/Flex";
import {Spacer} from "../../../utils/simple/SimpleDiv";
import React, {useState} from "react";
import {MappingsSelection} from "./MappingsSelection";
import {MappingsState, withBuild} from "../../../../mappings/MappingsState";
import {buildsOf, EmptyMappings, getMappingsCached, LoadingMappings, Mappings} from "../../../../mappings/Mappings";
import {IntermediaryToYarnMappingsProvider} from "../../../../mappings/MappingsProvider";
import {usePromise} from "../../../utils/PromiseBuilder";

export class MappingsController {
    mappingsState: MappingsState
    onMappingsStateChanged: (newState: MappingsState) => void
    mappings: Mappings
    minecraftVersion: string

    constructor(minecraftVersion: string) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [mappingsState, setMappingsState] = useMappingsState(minecraftVersion);
        this.mappingsState = mappingsState
        this.onMappingsStateChanged = setMappingsState;
        // eslint-disable-next-line react-hooks/rules-of-hooks
        this.mappings = useMappings(this.mappingsState)
        this.minecraftVersion = minecraftVersion;
    }
}

export function WithMappings({controller, children}:
                                 { controller: MappingsController }
                                 & WithChildren) {
    return <MappingSelectionLayout selection={
        <MappingsSelection mappingsLoading={controller.mappings.isLoading === true}
                           mappings={controller.mappingsState}
                           onMappingsChange={controller.onMappingsStateChanged}
                           minecraftVersion={controller.minecraftVersion}/>
    }>
        {children}
    </MappingSelectionLayout>
}

function MappingSelectionLayout({children, selection}: { selection: JSX.Element } & WithChildren) {
    const screen = useScreenSize();
    return screen.isPortrait ? <Column>{selection}{children}</Column> :
        <Row width={"max"}>
            {children}
            <Spacer flexGrow={1}/>
            {selection}
        </Row>
}

export type MutableMappingsState = [MappingsState, (newState: MappingsState) => void]

export function useMappingsState(minecraftVersion: string): MutableMappingsState {
    // Initially, immediately show a mapping, and since getting what versions are available takes time, we'll set the version to undefined
    // for now and what the available versions load we will set it to the first available one.
    const [state, setState] = useState<MappingsState>(
        {
            namespace: "Yarn",
            build: undefined
        }
    )

    const allBuilds = usePromise(buildsOf(state.namespace, minecraftVersion), [state.namespace])

    const actualState = withBuild(state, state.build ?? allBuilds?.[0]);
    return [actualState, setState];
}

//TODO: indicate that mappings are loading
export function useMappings(mappingsState: MappingsState): Mappings {
    const build = mappingsState.build
    const promise = build !== undefined ? getMappingsCached(IntermediaryToYarnMappingsProvider, build) : EmptyMappings
    return usePromise(promise, [build]) ?? LoadingMappings;
}
