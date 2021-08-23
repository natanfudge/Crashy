import {Variant as ThemeVariant} from "@material-ui/core/styles/createTypography";
import {deflattenStyle, ParentProps} from "./Element";
import {PropTypes, Typography} from "@material-ui/core";
import React from "react";

type Variant = ThemeVariant | 'srOnly';

export interface TextThemeProps extends ParentProps {
    align?: PropTypes.Alignment;
    color?:
        | 'initial'
        | 'inherit'
        | 'primary'
        | 'secondary'
        | 'textPrimary'
        | 'textSecondary'
        | 'error';
    display?: 'initial' | 'block' | 'inline';
    gutterBottom?: boolean;
    noWrap?: boolean;
    paragraph?: boolean;
    variant?: Variant | 'inherit';
    variantMapping?: Partial<Record<Variant, string>>;
}

export function TextTheme(props: TextThemeProps) {
    return <Typography {...deflattenStyle(props)}/>
}

export interface TextProps extends Omit<TextThemeProps, 'children'> {
    text: string
}

export function Text(props: TextProps) {
    const {text, ...otherProps} = props;
    return <TextTheme {...otherProps}>{text}</TextTheme>
}