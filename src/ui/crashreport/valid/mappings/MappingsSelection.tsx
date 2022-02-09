import React, {Fragment} from "react";
import {Column, Row} from "../../../utils/simple/Flex";
import {CircularProgress} from "@mui/material";
import {DropdownSelection} from "../../../utils/DropdownSelection";
import {indexOfOrThrow} from "../../../../utils/Javascript";
import {buildsOf} from "../../../../mappings/MappingsApi";
import {allMappingNamespaces, mappingsName} from "../../../../mappings/MappingsNamespace";
import {usePromise} from "../../../utils/PromiseBuilder";
import {useScreenSize} from "../../../../utils/Gui";
import {ItemSelection, SelectionType} from "../../../utils/Selection";
import {MappingsBuilds} from "../../../../mappings/providers/MappingsProvider";
import {Text} from "../../../utils/simple/Text";
import {DesiredBuildProblem, isValidDesiredBuild} from "../../../../mappings/resolve/MappingStrategy";
import {MappingsState, withBuild} from "./MappingsState";

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
                               // paddingTop: 8
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
        <Row /*style={{float: "right"}} justifyContent={"end"}*/
                         padding={{top: isPortrait ? 0 : 8, left: isPortrait ? 0 : 5}}
                         margin={{left: isPortrait ? 0 : 15}}>

        <ItemSelection type={isPortrait ? SelectionType.Dropdown : SelectionType.Expandable}
                       values={allMappingNamespaces.map(type => mappingsName(type))}
                       index={indexOfOrThrow(allMappingNamespaces, mappings.namespace)}
                       onIndexChange={i => {
                           const newNamespace = allMappingNamespaces[i];
                           // When the user switches mapping, immediately switch to that mapping,
                           // and since getting what versions are available takes time, we'll set the version to undefined
                           // for now.
                           // If the build is undefined then when all the builds load the first one will be used automatically.
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


