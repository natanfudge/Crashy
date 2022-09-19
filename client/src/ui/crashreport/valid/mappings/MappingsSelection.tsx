import React, {Fragment} from "react";

import {DesiredBuildProblem, isValidDesiredBuild} from "../../../../mappings/resolve/MappingStrategy";
import {MappingsState, withBuild} from "./MappingsState";
import {buildsOf} from "../../../../mappings/MappingsApi";
import {DropdownSelection} from "../../../../fudge-commons/components/DropdownSelection";
import {useScreenSize} from "../../../../fudge-commons/methods/Gui";
import {CircularProgress} from "@mui/material";
import {allMappingNamespaces, mappingsName} from "../../../../mappings/MappingsNamespace";
import {Column, Row} from "../../../../fudge-commons/simple/Flex";
import {ItemSelection, SelectionType} from "../../../../fudge-commons/components/Selection";
import {indexOfOrThrow} from "../../../../fudge-commons/methods/Javascript";
import {MappingsBuilds} from "../../../../mappings/providers/MappingsProvider";
import {Text} from "../../../../fudge-commons/simple/Text";
import {usePromise} from "../../../../fudge-commons/components/PromiseBuilder";

export interface MappingsSelectionProps {
    mappings: MappingsState;
    mappingsLoading: boolean;
    onMappingsChange: (mappings: MappingsState) => void;
    minecraftVersion: string
}


function BuildSelection({isPortrait, builds, mappings, onMappingsChange, mappingsLoading}:
                            {
                                isPortrait: boolean, builds: MappingsBuilds, mappingsLoading: boolean,
                                mappings: MappingsState, onMappingsChange: (mappings: MappingsState) => void
                            }) {
    return <Column>
        <DropdownSelection variant={isPortrait ? "standard" : "outlined"}
                           style={{
                               paddingLeft: 10,
                               paddingRight: 5,
                               alignSelf: isPortrait ? "center" : undefined,
                           }}
                           values={builds}
                           index={isValidDesiredBuild(mappings.build) ? indexOfOrThrow(builds, mappings.build) : 0}
                           onIndexChange={i => onMappingsChange(withBuild(mappings, builds[i]))}/>

    </Column>;
}

export function MappingsSelection({mappings, onMappingsChange, minecraftVersion, mappingsLoading}:
                                      MappingsSelectionProps) {
    const screen = useScreenSize();
    const isPortrait = screen.isPortrait;
    const builds = usePromise(buildsOf(mappings.namespace, minecraftVersion), [mappings.namespace]);
    return <Column style={{float: "right"}} justifyContent={"end"}>
        <Row padding={{top: isPortrait ? 0 : 8, left: isPortrait ? 0 : 5}}
                         margin={{left: isPortrait ? 0 : 15}}>

        <ItemSelection type={isPortrait ? SelectionType.Dropdown : SelectionType.Expandable}
                       values={allMappingNamespaces.map(type => mappingsName(type))}
                       index={indexOfOrThrow(allMappingNamespaces, mappings.namespace)}
                       onIndexChange={i => {
                           const newNamespace = allMappingNamespaces[i];
                           onMappingsChange({namespace: newNamespace, build: DesiredBuildProblem.BuildsLoading})
                       }}/>


        {builds === undefined ? <CircularProgress style={{padding: 7}}/> : <Fragment>
            {builds.length > 0 &&
                <BuildSelection mappingsLoading={mappingsLoading} isPortrait={isPortrait} builds={builds}
                                mappings={mappings}
                                onMappingsChange={onMappingsChange}/>}
        </Fragment>}
    </Row>
        {mappingsLoading &&
            <Text padding={{left: 8, right: 3}} className={"blinking_text"} align={"center"} fontWeight={"bold"}
                  text={"Loading Mappings..."}/>}
    </Column>
}


