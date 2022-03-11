import React, {CSSProperties, useState} from "react";
import {DropdownSelection} from "./DropdownSelection";
import {VisibleSelection} from "./VisibleSelection";
import {IconButton} from "@mui/material";
import {ArrowDropDown, ArrowDropUp} from "@mui/icons-material";
import {Column} from "../simple/Flex";

export enum SelectionType {
    Expandable, Dropdown
}

export function ItemSelection(props: { type: SelectionType, values: string[], index: number, onIndexChange: (i: number) => void, style?: CSSProperties }) {
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
