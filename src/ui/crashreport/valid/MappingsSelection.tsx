import React, {CSSProperties, useState} from "react";
import {Column, Row} from "../../utils/simple/Flex";
import {VisibleSelection} from "../../utils/VisibleSelection";
import {CircularProgress, IconButton} from "@mui/material";
import {ArrowDropDown, ArrowDropUp} from "@mui/icons-material";
import {DropdownSelection} from "../../utils/DropdownSelection";
import {indexOfOrThrow} from "../../../utils/Javascript";
import {buildsOf} from "../../../mappings/Mappings";
import {MappingsState, withVersion} from "../../../mappings/MappingsState";
import {allMappingNamespaces, mappingsName} from "../../../mappings/MappingsNamespace";
import {PromiseBuilder} from "../../utils/PromiseBuilder";

export interface MappingsSelectionProps {
    isPortrait: boolean;
    mappings: MappingsState;
    onMappingsChange: (mappings: MappingsState) => void;
    minecraftVersion: string
}

export function MappingsSelection({props}:
                                      { props: MappingsSelectionProps }) {
    const {isPortrait, mappings, onMappingsChange} = props;
    return <Row justifyContent={"end"}>
        <Selection type={isPortrait ? SelectionType.Dropdown : SelectionType.Expandable}
                   style={{paddingTop: isPortrait ? 0 : 8}}
                   values={allMappingNamespaces.map(type => mappingsName(type))}
                   index={indexOfOrThrow(allMappingNamespaces, mappings.namespace)}
                   onIndexChange={i => {
                       const newNamespace = allMappingNamespaces[i];

                       //TODO: merge this with useMappingsState()

                       // When the user switches mapping, immediately switch to that mapping, and since getting what versions are available takes time, we'll set the version to undefined
                       // for now and what the available versions load we will set it to the first available one.
                       onMappingsChange({namespace: newNamespace, version: undefined})
                       void buildsOf(newNamespace, props.minecraftVersion).then(builds => onMappingsChange(withVersion(mappings, builds[0])))
                   }}/>

        <PromiseBuilder promise={buildsOf(mappings.namespace, props.minecraftVersion)} whenLoading={<CircularProgress/>} whenDone={builds =>
            <DropdownSelection variant={isPortrait ? "standard" : "outlined"}
                               style={{paddingLeft: 10, paddingRight: 5, alignSelf: isPortrait ? "center" : undefined}}
                               values={builds}
                               index={indexOfOrThrow(builds, mappings.version)}
                               onIndexChange={i => onMappingsChange(withVersion(mappings, builds[i]))}/>
        }/>

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