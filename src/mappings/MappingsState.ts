import {MappingsNamespace} from "./MappingsNamespace";

export interface MappingsState {
    namespace: MappingsNamespace,
    // Undefined if still loading available versions
    version: string | undefined
}

export function withVersion(state: MappingsState, version: string): MappingsState {
    return {namespace: state.namespace, version}
}