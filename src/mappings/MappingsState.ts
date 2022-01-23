import {MappingsNamespace} from "./MappingsNamespace";

export interface MappingsState {
    namespace: MappingsNamespace,
    // Undefined if still loading available versions
    build: string | undefined
}

export function withBuild(state: MappingsState, build: string | undefined): MappingsState {
    return {namespace: state.namespace, build: build}
}
