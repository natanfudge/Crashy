import {Variant as ThemeVariant} from "@material-ui/core/styles/createTypography";
import {deflattenStyle, ParentProps} from "./Element";
import {PropTypes, Typography} from "@material-ui/core";
import React from "react";

type Variant = ThemeVariant | 'srOnly';

export interface TextThemeProps extends ParentProps {
    align?: PropTypes.Alignment;
    color?: string
    gutterBottom?: boolean;
    noWrap?: boolean;
    paragraph?: boolean;
    variant?: Variant | 'inherit';
    variantMapping?: Partial<Record<Variant, string>>;
}

// interface Color {
//     value: string
// }
//
// // const x = rgb(5,5,5);
// // function rgb(r: number, g : number, b: number){
// //     return `rgb(${r},${g},${b})`
// // }
//
// const x = color("rgb(0,0,0)")
//
// function color(c: string){
//     return c;
// }

export function TextTheme(props: TextThemeProps) {
    const {color, style, ...otherProps} = deflattenStyle(props);

    return <Typography
        style={{
            color: color,
            ...style
        }}
        {...otherProps}/>
}

export interface TextProps extends Omit<TextThemeProps, 'children'> {
    text: string
}

export function Text(props: TextProps) {
    const {text, ...otherProps} = props;
    return <TextTheme {...otherProps}>{text}</TextTheme>
}