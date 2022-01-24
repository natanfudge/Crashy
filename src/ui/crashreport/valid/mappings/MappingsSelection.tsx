import React, {Fragment} from "react";
import {Column, Row} from "../../../utils/simple/Flex";
import {CircularProgress} from "@mui/material";
import {DropdownSelection} from "../../../utils/DropdownSelection";
import {indexOfOrThrow} from "../../../../utils/Javascript";
import {buildsOf} from "../../../../mappings/Mappings";
import {MappingsState, withBuild} from "../../../../mappings/MappingsState";
import {allMappingNamespaces, mappingsName} from "../../../../mappings/MappingsNamespace";
import {usePromise} from "../../../utils/PromiseBuilder";
import {useScreenSize} from "../../../../utils/Gui";
import {WithChildren} from "../../../utils/simple/SimpleElementProps";
import {Spacer} from "../../../utils/simple/SimpleDiv";
import {ItemSelection, SelectionType} from "../../../utils/Selection";

export interface MappingsSelectionProps {
    mappings: MappingsState;
    onMappingsChange: (mappings: MappingsState) => void;
    minecraftVersion: string
}




export function MappingsSelection({mappings, onMappingsChange, minecraftVersion}:
                               MappingsSelectionProps) {
    const screen = useScreenSize();
    const isPortrait = screen.isPortrait;
    const builds = usePromise(buildsOf(mappings.namespace, minecraftVersion), [mappings.namespace]);
    return <Row justifyContent={"end"} padding={{top: isPortrait ? 0 : 8}}>
        <ItemSelection type={isPortrait ? SelectionType.Dropdown : SelectionType.Expandable}
                   values={allMappingNamespaces.map(type => mappingsName(type))}
                   index={indexOfOrThrow(allMappingNamespaces, mappings.namespace)}
                   onIndexChange={i => {
                       const newNamespace = allMappingNamespaces[i];
                       // When the user switches mapping, immediately switch to that mapping,
                       // and since getting what versions are available takes time, we'll set the version to undefined
                       // for now.
                       // If the build is undefined then when all the builds load the first one will be used automatically.
                       onMappingsChange({namespace: newNamespace, build: undefined})
                   }}/>
        {builds === undefined ? <CircularProgress style={{padding: 7}}/> : <Fragment>
            {builds.length > 0 && <DropdownSelection variant={isPortrait ? "standard" : "outlined"}
                                                     style={{
                                                         paddingLeft: 10,
                                                         paddingRight: 5,
                                                         alignSelf: isPortrait ? "center" : undefined,
                                                         // paddingTop: 8
                                                     }}
                                                     values={builds}
                                                     index={mappings.build === undefined ? 0 : indexOfOrThrow(builds, mappings.build)}
                                                     onIndexChange={i => onMappingsChange(withBuild(mappings, builds[i]))}/>}
        </Fragment>}
    </Row>
}


