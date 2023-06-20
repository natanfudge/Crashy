import {DesiredBuild} from "../../../../mappings/resolve/MappingStrategy";
import {MappingsNamespace} from "../../../../mappings/MappingsNamespace";

export interface MappingsSelection {
    namespace: MappingsNamespace,
    build: DesiredBuild
}

export function withBuild(state: MappingsSelection, build: DesiredBuild): MappingsSelection {
    return {namespace: state.namespace, build: build}
}