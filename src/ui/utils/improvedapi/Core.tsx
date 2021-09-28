import {deflattenStyle, ElementProps, SingleChildParentProps} from "./Element";
import {Divider} from "@mui/material";
import React from "react";

export interface ImageProps extends ElementProps {
    alt: string;
    src: string | undefined;
}

export function CImage(props: ImageProps) {
    // eslint-disable-next-line jsx-a11y/alt-text
    return <img {...deflattenStyle(props)}/>
}

export function Spacer(props: ElementProps) {
    return <div {...deflattenStyle(props)}/>
}

// Use Row/Col for wrapping because the layout is not obvious otherwise
export function Wrap(props: SingleChildParentProps & {divRef?: React.Ref<HTMLDivElement>}) {
    const {divRef,...otherProps} = props;
    return <div {...deflattenStyle(otherProps)} ref = {props.divRef}/>
}

export function CDivider(props: ElementProps) {
    return <Divider  {...deflattenStyle(props)}/>
}