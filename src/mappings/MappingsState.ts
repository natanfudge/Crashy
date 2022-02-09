import {MappingsNamespace} from "./MappingsNamespace";
import {DesiredBuild} from "./resolve/MappingStrategy";

export interface MappingsState {
    namespace: MappingsNamespace,
    build: DesiredBuild
}

export function withBuild(state: MappingsState, build: DesiredBuild): MappingsState {
    return {namespace: state.namespace, build: build}
}
