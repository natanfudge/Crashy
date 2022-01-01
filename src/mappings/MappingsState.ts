import {MappingsNamespace} from "./MappingsNamespace";

export interface MappingsState {
    type: MappingsNamespace,
    version: string
}

export function withVersion(state: MappingsState, version: string): MappingsState {
    return {type: state.type, version}
}