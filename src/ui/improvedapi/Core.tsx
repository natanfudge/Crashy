import {deflattenStyle, ElementProps, SingleChildParentProps} from "./Element";
import {Divider} from "@mui/material";
import React from "react";

export interface ImageProps extends ElementProps {
    alt: string;
    src: string | undefined;
}

export function Image(props: ImageProps) {
    // eslint-disable-next-line jsx-a11y/alt-text
    return <img {...deflattenStyle(props)}/>
}

export function Spacer(props: ElementProps) {
    return <div {...deflattenStyle(props)}/>
}

export function Wrap(props: SingleChildParentProps) {
    return <div {...deflattenStyle(props)}/>
}

export function CDivider(props: ElementProps) {
    return <Divider  {...deflattenStyle(props)}/>
}