import React, {CSSProperties, Fragment, useState} from "react";
import {Column, Row} from "../../utils/simple/Flex";
import {VisibleSelection} from "../../utils/VisibleSelection";
import {IconButton} from "@mui/material";
import {ArrowDropDown, ArrowDropUp} from "@mui/icons-material";
import {DropdownSelection} from "../../utils/DropdownSelection";
import {indexOfOrThrow} from "../../../utils/Javascript";
import {allMappingTypes, mappingsName, MappingsState, versionsOf, withVersion} from "../../../utils/Mappings";
import {Text} from "../../utils/simple/Text";
import {Spacer} from "../../utils/simple/SimpleDiv";
import {primaryColor, secondaryColor} from "../../Colors";

export interface MappingsSelectionProps {
    isPortrait: boolean;
    mappings: MappingsState;
    onMappingsChange: (mappings: MappingsState) => void;
}

export function MappingsSelection({props}:
                                      {props:MappingsSelectionProps}) {
    const {isPortrait, mappings, onMappingsChange} = props;
    const versions = versionsOf(mappings.type)
    return <Row justifyContent={"end"}>
        <Selection type={isPortrait ? SelectionType.Dropdown : SelectionType.Expandable}
                   style={{paddingTop: isPortrait? 0: 8}}
                   values={allMappingTypes.map(type => mappingsName(type))}
                   index={indexOfOrThrow(allMappingTypes, mappings.type)}
                   onIndexChange={i => onMappingsChange(
                       {version: versionsOf(allMappingTypes[i])[0], type: allMappingTypes[i]}
                   )}/>

        <DropdownSelection variant={isPortrait? "standard": "outlined"} style={{paddingLeft: 10, paddingRight: 5, alignSelf: isPortrait? "center": undefined}}
                           values={versions}
                           index={indexOfOrThrow(versions, mappings.version)}
                           onIndexChange={i => onMappingsChange(withVersion(mappings, versions[i]))}/>
    </Row>
}

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