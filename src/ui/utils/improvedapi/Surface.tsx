import {Paper} from "@mui/material";
import React from "react";
import {deflattenStyle} from "./impl/SimpleImpl";
import {SingleChildParentProps} from "./SimpleElementProps";

/**
 * @see https://mui.com/components/paper
 */
export function Surface(props: SingleChildParentProps) {
    return <Paper {...deflattenStyle(props)} />
}