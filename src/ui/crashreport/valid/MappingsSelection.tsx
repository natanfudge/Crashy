import React, {CSSProperties, Fragment, useState} from "react";
import {Column, Row} from "../../utils/simple/Flex";
import {VisibleSelection} from "../../utils/VisibleSelection";
import {CircularProgress, IconButton} from "@mui/material";
import {ArrowDropDown, ArrowDropUp} from "@mui/icons-material";
import {DropdownSelection} from "../../utils/DropdownSelection";
import {indexOfOrThrow} from "../../../utils/Javascript";
import {buildsOf} from "../../../mappings/Mappings";
import {MappingsState, withBuild} from "../../../mappings/MappingsState";
import {allMappingNamespaces, mappingsName} from "../../../mappings/MappingsNamespace";
import {PromiseBuilder, usePromise} from "../../utils/PromiseBuilder";

export interface MappingsSelectionProps {
    isPortrait: boolean;
    mappings: MappingsState;
    onMappingsChange: (mappings: MappingsState) => void;
    minecraftVersion: string
}

export function MappingsSelection({props}:
                                      { props: MappingsSelectionProps }) {
    const {isPortrait, mappings, onMappingsChange} = props;
    const builds = usePromise(buildsOf(mappings.namespace, props.minecraftVersion), [mappings.namespace]);
    return <Row justifyContent={"end"} padding={{top: isPortrait ? 0 : 8}}>
        <Selection type={isPortrait ? SelectionType.Dropdown : SelectionType.Expandable}
            // style={{paddingTop: }}
                   values={allMappingNamespaces.map(type => mappingsName(type))}
                   index={indexOfOrThrow(allMappingNamespaces, mappings.namespace)}
                   onIndexChange={i => {
                       const newNamespace = allMappingNamespaces[i];
                       // When the user switches mapping, immediately switch to that mapping, and since getting what versions are available takes time, we'll set the version to undefined
                       // for now and what the available versions load we will set it to the first available one.
                       onMappingsChange({namespace: newNamespace, build: undefined})
                       //TODO: version:undefined should do usePromise, see useMappingsState
                   }}/>

        {builds === undefined? <CircularProgress style={{padding:7}}/> : <Fragment>
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

// export function set

export enum SelectionType {
    Expandable, Dropdown
}

export function Selection(props: { type: SelectionType, values: string[], index: number, onIndexChange: (i: number) => void, style?: CSSProperties }) {
    switch (props.type) {
        case SelectionType.Expandable:
            return <ExpandableVisibleSelection values={props.values} index={props.index}
                                               onIndexChange={props.onIndexChange} style={props.style}/>
        case SelectionType.Dropdown:
            return <DropdownSelection variant={"outlined"} size={"small"} values={props.values} index={props.index}
                                      onIndexChange={props.onIndexChange} style={props.style}/>
    }
}

function ExpandableVisibleSelection({values, index, onIndexChange, style}:
                                        {
                                            values: string[],
                                            index: number, onIndexChange: (value: number) => void,
                                            style?: CSSProperties
                                        }) {
    const [showAll, setShowAll] = useState(false);
    return <Column style={style}>
        <VisibleSelection showAll={showAll} values={values} currentIndex={index} onValueChange={onIndexChange}/>
        <IconButton disableTouchRipple={true} style={{padding: 0}} onClick={() => setShowAll((prev) => !prev)}>
            {showAll ? <ArrowDropUp fontSize="large"/> : <ArrowDropDown fontSize={"large"}/>}
        </IconButton>

    </Column>
}
