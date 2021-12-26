import React, {CSSProperties} from "react";
import {FormControl, MenuItem, Select} from "@mui/material";

export function DropdownSelection({options, index, onIndexChange, style}:
                               {
                                   options: string[],
                                   index: number, onIndexChange: (index: number) => void,
                                   style?: CSSProperties
                               }) {
    return <FormControl style={{minWidth: "fit-content", maxWidth: "fit-content",...style}} fullWidth>
        <Select
            variant={'outlined'}
            value={options[index]}
            onChange={(e) => onIndexChange(options.findIndex(option => option === e.target.value))}
        >
            {options.map((option, i) => <MenuItem key={i} value={option}>{option}</MenuItem>)}
        </Select>
    </FormControl>
}