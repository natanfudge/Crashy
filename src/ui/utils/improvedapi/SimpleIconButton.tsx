import {IconButton} from "@mui/material";
import React from "react";
import {SingleChildParentProps} from "./SimpleElementProps";
import {ClickCallback} from "./GuiTypes";
import {deflattenStyle} from "./impl/SimpleImpl";

export interface SimpleIconButtonProps extends SingleChildParentProps {
    // icon: JSX.Element
    //TODO: use some form of required<onClick>
    onClick: ClickCallback
}

/**
 * @see https://mui.com/components/icons/#:~:text=EXAMPLE-,%3CIconButton%20aria%2Dlabel%3D%22Example%22%3E,-%3CFontAwesomeIcon%20icon%3D%7BfaEllipsisV
 */
export function SimpleIconButton(props: SimpleIconButtonProps) {
    // const {icon, ...otherProps} = props
    return <IconButton {...deflattenStyle(props)} />
}