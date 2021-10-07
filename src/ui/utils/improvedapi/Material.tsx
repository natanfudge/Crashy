import {ClickCallback, deflattenStyle, ElementProps, ManyChildParentProps, SingleChildParentProps} from "./Element";
import {AppBar, Button, IconButton, Paper, TextField} from "@mui/material";
import React from "react";

export function Surface(props: SingleChildParentProps) {
    return <Paper {...deflattenStyle(props)}/>
}

export interface CIconButtonProps extends SingleChildParentProps {
    // icon: JSX.Element
    onClick: ClickCallback
}

export function CIconButton(props: CIconButtonProps) {
    // const {icon, ...otherProps} = props
    return <IconButton {...deflattenStyle(props)}/>
}

export interface CTextFieldProps extends ElementProps {
    value: string
    onValueChanged: (value: string) => void
    error?: boolean
    label?: React.ReactNode
    disabled?: boolean
}

export function CTextField(props: CTextFieldProps) {
    const {onValueChanged, ...otherProps} = props;
    return <TextField
        onChange={e => onValueChanged(e.target.value)}
        {...deflattenStyle(otherProps)}/>
}

export interface CButtonProps extends SingleChildParentProps {
    onClick: ClickCallback
    variant?: 'text' | 'outlined' | 'contained'
    disabled?: boolean

}

export function CButton(props: CButtonProps) {
    return <Button {...deflattenStyle(props)}/>
}

export function CAppBar(props: ManyChildParentProps) {
    const {style, ...otherProps} = deflattenStyle(props);
    return <AppBar {...otherProps} style={{display: "flex", flexDirection: "row", ...style}}/>
}