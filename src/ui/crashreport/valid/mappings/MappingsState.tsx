import {DesiredBuild} from "../../../../mappings/resolve/MappingStrategy";
import {MappingsNamespace} from "../../../../mappings/MappingsNamespace";

export interface MappingsState {
    namespace: MappingsNamespace,
    build: DesiredBuild
}

export function withBuild(state: MappingsState, build: DesiredBuild): MappingsState {
    return {namespace: state.namespace, build: build}
}
