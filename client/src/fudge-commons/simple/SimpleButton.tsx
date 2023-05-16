import {OverridableStringUnion} from "@mui/types";
import {ButtonPropsSizeOverrides} from "@mui/material/Button/Button";
import {Button} from "@mui/material";
import React from "react";
import {SingleChildParentProps} from "./SimpleElementProps";
import {ClickCallback} from "./GuiTypes";
import {deflattenStyle} from "./impl/SimpleImpl";
import {Require} from "fudge-lib/dist/types/Basic";

export interface SimpleButtonProps extends Require<SingleChildParentProps,'onClick'> {
    variant?: 'text' | 'outlined' | 'contained'
    disabled?: boolean
    /**
     * The URL to link to when the button is clicked.
     * If defined, an `a` element will be used as the root node.
     */
    href?: string;
    /**
     * The size of the component.
     * `small` is equivalent to the dense button styling.
     * @default 'medium'
     */
    size?: OverridableStringUnion<'small' | 'medium' | 'large', ButtonPropsSizeOverrides>;
}

/**
 * @see https://mui.com/components/buttons/
 */
export function SimpleButton(props: SimpleButtonProps) {
    return <Button {...deflattenStyle(props)} />
}
