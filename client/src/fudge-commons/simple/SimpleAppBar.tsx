import {AppBar} from "@mui/material";
import React from "react";
import {ManyChildParentProps} from "./SimpleElementProps";
import {deflattenStyle} from "./impl/SimpleImpl";

/**
 * Layouts children in a row
 * @see https://mui.com/components/app-bar/
 */
export function SimpleAppBar(props: ManyChildParentProps) {
    return <AppBar {...deflattenStyle(props)}/>
}
