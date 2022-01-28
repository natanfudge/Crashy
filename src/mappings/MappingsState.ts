import {MappingsNamespace} from "./MappingsNamespace";
import {DesiredBuild} from "./MappingMethod";

export interface MappingsState {
    namespace: MappingsNamespace,
    build: DesiredBuild
}

export function withBuild(state: MappingsState, build: DesiredBuild): MappingsState {
    return {namespace: state.namespace, build: build}
}
