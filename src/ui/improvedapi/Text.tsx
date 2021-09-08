import {deflattenStyle, ManyChildParentProps} from "./Element";
import {Typography} from "@mui/material";
import React from "react";
import {OverridableStringUnion} from "@mui/types";
import {TypographyPropsVariantOverrides} from "@mui/material/Typography/Typography";
import {Variant} from "@mui/material/styles/createTypography";
import {TypographyClasses} from "@mui/material/Typography/typographyClasses";
import {SxProps} from "@mui/system";
import {Theme} from "@mui/material/styles";

// type MuiVariant = OverridableStringUnion<Variant | 'inherit', TypographyPropsVariantOverrides>
// type Alignment = 'inherit' | 'left' | 'center' | 'right' | 'justify'

// export interface TextThemeProps extends ManyChildParentProps {
//     align?: Alignment;
//     color?: string
//     gutterBottom?: boolean;
//     noWrap?: boolean;
//     paragraph?: boolean;
//     variant?: MuiVariant;
//     variantMapping?: Partial<Record<Variant, string>>;
// }

export interface TextThemeProps extends ManyChildParentProps {
    /**
     * Set the text-align on the component.
     * @default 'inherit'
     */
    align?: 'inherit' | 'left' | 'center' | 'right' | 'justify';

    /**
     * Override or extend the styles applied to the component.
     */
    classes?: Partial<TypographyClasses>;
    /**
     * If `true`, the text will have a bottom margin.
     * @default false
     */
    gutterBottom?: boolean;
    /**
     * If `true`, the text will not wrap, but instead will truncate with a text overflow ellipsis.
     *
     * Note that text overflow can only happen with block or inline-block level elements
     * (the element needs to have a width in order to overflow).
     * @default false
     */
    noWrap?: boolean;
    /**
     * If `true`, the element will be a paragraph element.
     * @default false
     */
    paragraph?: boolean;
    /**
     * The system prop that allows defining system overrides as well as additional CSS styles.
     */
    sx?: SxProps<Theme>;
    /**
     * Applies the theme typography styles.
     * @default 'body1'
     */
    variant?: OverridableStringUnion<Variant | 'inherit', TypographyPropsVariantOverrides>;
    /**
     * The component maps the variant prop to a range of different HTML element types.
     * For instance, subtitle1 to `<h6>`.
     * If you wish to change that mapping, you can provide your own.
     * Alternatively, you can use the `component` prop.
     * @default {
     *   h1: 'h1',
     *   h2: 'h2',
     *   h3: 'h3',
     *   h4: 'h4',
     *   h5: 'h5',
     *   h6: 'h6',
     *   subtitle1: 'h6',
     *   subtitle2: 'h6',
     *   body1: 'p',
     *   body2: 'p',
     *   inherit: 'p',
     * }
     */
    variantMapping?: Partial<Record<OverridableStringUnion<Variant | 'inherit', TypographyPropsVariantOverrides>, string>>;
    color?: string
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
    const {color, ...otherProps} = deflattenStyle(props);


    return <Typography
        color={color}
        {...otherProps}
        // style={style}
        // sx = {otherProps.sx}
        // align={otherProps.align}
        // onClick={otherProps.onClick}
    />
}

export interface TextProps extends Omit<TextThemeProps, 'children'> {
    text: string
}

export function Text(props: TextProps) {
    const {text, ...otherProps} = props;
    return <TextTheme {...otherProps}>{text}</TextTheme>
}