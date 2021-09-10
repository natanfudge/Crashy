import {deflattenStyle, SingleChildParentProps} from "./Element";
import {Paper} from "@mui/material";
import React from "react";

export function Surface(props: SingleChildParentProps) {
    return <Paper {...deflattenStyle(props)}/>
}