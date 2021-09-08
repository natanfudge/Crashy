import {deflattenStyle, SingleChildParentProps} from "./Element";
import {Paper} from "@mui/material";
import React from "react";

export function Surface(props: SingleChildParentProps) {
    // return React.forwardRef((_,ref) => {
    //     return <Paper ref={ref} {...deflattenStyle(props)}/>
    // })
    return <Paper {...deflattenStyle(props)}/>
}