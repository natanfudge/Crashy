import React, {CSSProperties, useState} from "react";
import {Column, Row} from "../../utils/simple/Flex";
import {VisibleSelection} from "../../utils/VisibleSelection";
import {IconButton} from "@mui/material";
import {ArrowDropDown, ArrowDropUp} from "@mui/icons-material";
import {DropdownSelection} from "../../utils/DropdownSelection";
import {indexOfOrThrow} from "../../../utils/Javascript";
import {allMappingTypes, mappingsName, MappingsState, versionsOf, withVersion} from "../../../utils/Mappings";


export function MappingsSelection({mappings, onMappingsChange}:
                                      { mappings: MappingsState, onMappingsChange: (mappings: MappingsState) => void }) {
    const versions = versionsOf(mappings.type)
    return <Row>
        <ExpandableVisibleSelection style={{paddingTop: 8}}
                                    values={allMappingTypes.map(type => mappingsName(type))}
                                    currentIndex={indexOfOrThrow(allMappingTypes, mappings.type)}
                                    onValueChange={i => onMappingsChange(
                                        {version: versionsOf(allMappingTypes[i])[0], type: allMappingTypes[i]}
                                    )}/>
        <DropdownSelection style={{paddingLeft: 5, paddingRight: 5}}
                           options={versions}
                           index={indexOfOrThrow(versions, mappings.version)}
                           onIndexChange={i => onMappingsChange(withVersion(mappings, versions[i]))}/>
    </Row>
}

function ExpandableVisibleSelection({values, currentIndex, onValueChange, style}:
                                        {
                                            values: string[],
                                            currentIndex: number, onValueChange: (value: number) => void,
                                            style?: CSSProperties
                                        }) {
    const [showAll, setShowAll] = useState(false);
    return <Column style={style}>
        <VisibleSelection showAll={showAll} values={values} currentIndex={currentIndex} onValueChange={onValueChange}/>
        <IconButton disableTouchRipple={true} style={{padding: 0}} onClick={() => setShowAll((prev) => !prev)}>
            {showAll ? <ArrowDropUp fontSize="large"/> : <ArrowDropDown fontSize={"large"}/>}
        </IconButton>

    </Column>
}