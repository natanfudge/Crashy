import React, {CSSProperties} from "react";
import {FormControl, MenuItem, Select} from "@mui/material";

export function DropdownSelection({size, variant,values, index, onIndexChange, style}:
                               {
                                   size?: 'small' | 'medium',
                                   variant: 'standard' | 'outlined' | 'filled',
                                   values: string[],
                                   index: number, onIndexChange: (index: number) => void,
                                   style?: CSSProperties
                               }) {
    return <FormControl style={{minWidth: "fit-content", maxWidth: "fit-content",...style}} fullWidth>
        <Select
            size={size ?? 'medium'}
            variant={variant}
            value={values[index]}
            onChange={(e) => onIndexChange(values.findIndex(option => option === e.target.value))}
        >
            {values.map((option, i) => <MenuItem key={i} value={option}>{option}</MenuItem>)}
        </Select>
    </FormControl>
}