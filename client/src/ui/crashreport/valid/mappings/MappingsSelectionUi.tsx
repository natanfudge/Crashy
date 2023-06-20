import React, {Fragment} from "react";

import {DesiredBuildProblem, isValidDesiredBuild} from "../../../../mappings/resolve/MappingStrategy";
import {MappingsSelection, withBuild} from "./MappingsSelection";
import {buildsOf} from "../../../../mappings/MappingsApi";
import {DropdownSelection} from "../../../../fudge-commons/components/DropdownSelection";
import {useScreenSize} from "fudge-lib/dist/methods/Gui";
import {CircularProgress} from "@mui/material";
import {getVisibleMappingNamespaces, mappingsName} from "../../../../mappings/MappingsNamespace";
import {Column, Row} from "../../../../fudge-commons/simple/Flex";
import {ItemSelection, SelectionType} from "../../../../fudge-commons/components/Selection";
import {indexOfOrThrow} from "fudge-lib/dist/methods/Javascript";
import {MappingsBuilds} from "../../../../mappings/providers/MappingsProvider";
import {Text} from "../../../../fudge-commons/simple/Text";
import {usePromise} from "../../../../fudge-commons/components/PromiseBuilder";
import {MappingsController} from "./MappingsController";

// export interface MappingsSelectionProps {
//     mappings: MappingsSelection;
//     onMappingsChange: (mappings: MappingsSelection) => void;
//     minecraftVersion: string
// }


function BuildSelection({isPortrait, builds, mappings, onMappingsChange}:
                            {
                                isPortrait: boolean, builds: MappingsBuilds,
                                mappings: MappingsSelection, onMappingsChange: (mappings: MappingsSelection) => void
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

export function MappingsSelectionUi({mappings}:
                                        { mappings: MappingsController }) {
    const screen = useScreenSize();
    const isPortrait = screen.isPortrait;
    const builds = usePromise(() => buildsOf(mappings.selection.namespace, mappings.minecraftVersion), [mappings.selection.namespace]);
    const mappingNamespaces = getVisibleMappingNamespaces(mappings.minecraftVersion)

    function Builds() {
        return builds === undefined ? <CircularProgress style={{padding: 7}}/> : <Fragment>
            {builds.length > 0 &&
                <BuildSelection isPortrait={isPortrait} builds={builds}
                                mappings={mappings.selection}
                                onMappingsChange={mappings.onSelectionChanged}/>}
        </Fragment>
    }

    function Namespaces() {
        return <ItemSelection type={isPortrait ? SelectionType.Dropdown : SelectionType.Expandable}
                              values={mappingNamespaces.map(type => mappingsName(type))}
                              index={mappingNamespaces.indexOfOrThrow(mappings.selection.namespace)}
                              onIndexChange={i => {
                                  const newNamespace = mappingNamespaces[i];
                                  mappings.onSelectionChanged({namespace: newNamespace, build: DesiredBuildProblem.BuildsLoading})
                              }}/>
    }

    return <Column style={{float: "right"}} justifyContent={"end"}>
        <Row padding={{top: isPortrait ? 0 : 8, left: isPortrait ? 0 : 5, right: 15}}
             margin={{left: isPortrait ? 0 : 15}}>

            {/*In portrait place namespaces before builds, in desktop place builds before namespaces.*/}
            {isPortrait ? <Fragment>
                {Namespaces()}
                {Builds()}
            </Fragment> : <Fragment>
                {Builds()}
                {Namespaces()}
            </Fragment>
            }


        </Row>
        {mappings.isLoading &&
            <Text padding={{left: 8, right: 3}} className={"blinking_text"} align={"center"} fontWeight={"bold"}
                  text={"Loading Mappings..."}/>}
    </Column>
}


