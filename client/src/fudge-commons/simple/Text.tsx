import {Typography} from "@mui/material";
import React, {CSSProperties} from "react";
import {OverridableStringUnion} from "@mui/types";
import {TypographyPropsVariantOverrides} from "@mui/material/Typography/Typography";
import {Variant} from "@mui/material/styles/createTypography";
import {TypographyClasses} from "@mui/material/Typography/typographyClasses";
import {SxProps} from "@mui/system";
import {Theme} from "@mui/material/styles";
import * as CSS from "csstype"
import {deflattenStyle} from "./impl/SimpleImpl";
import {ElementProps, ManyChildParentProps, SingleChildParentProps} from "./SimpleElementProps";
import {Color, gradientToCss, isGradient} from "./Color";
// hello test
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
    /**
     * The **`color`** CSS property sets the foreground color value of an element's text and text decorations, and sets the `<currentcolor>` value. `currentcolor` may be used as an indirect value on _other_ properties and is the default for other color properties, such as `border-color`.
     * @see https://developer.mozilla.org/docs/Web/CSS/color
     */
    color?: Color
    /**
     * The **`font-family`** CSS property specifies a prioritized list of one or more font family names and/or generic family names for the selected element.
     * @see https://developer.mozilla.org/docs/Web/CSS/font-family
     */
    fontFamily?: CSS.Property.FontFamily
    /**
     * The **`font-style`** CSS property sets whether a font should be styled with a normal, italic, or oblique face from its `font-family`.
     * @see https://developer.mozilla.org/docs/Web/CSS/font-style
     */
    fontStyle?: CSS.Property.FontStyle
    /**
     * The **`font-weight`** CSS property specifies the weight or boldness of the font.
     * @see https://developer.mozilla.org/docs/Web/CSS/font-weight
     */
    fontWeight?: CSS.Property.FontWeight
    /**
     * The **`white-space`** CSS property sets how white space inside an element is handled.
     * @see https://developer.mozilla.org/docs/Web/CSS/white-space
     */
    whiteSpace?: CSS.Property.WhiteSpace
    /**
     * The **`word-break`** CSS property sets whether line breaks appear wherever the text would otherwise overflow its content box.
     * @see https://developer.mozilla.org/docs/Web/CSS/word-break
     */
    wordBreak?: CSS.Property.WordBreak

    spanRef?: React.RefObject<HTMLSpanElement>
}

export interface TextProps extends Omit<TextThemeProps, 'children'> {
    text: string
}

export function Text(props: TextProps) {
    const {text, ...otherProps} = props;
    return <TextTheme {...otherProps}>{text}</TextTheme>
}

/**
 * Applies a text style to all child text nodes.
 * Also useful for formatting with <b> and <link> and such
 */
export function TextTheme(props: TextThemeProps) {
    const {color, style, fontFamily, fontStyle, whiteSpace, wordBreak,spanRef, ...otherProps} = deflattenStyle(props);

    const actualColor = isGradient(color) ? undefined : color;

    return <Typography ref={spanRef} style={{fontFamily, fontStyle, whiteSpace, wordBreak, ...gradientStyle(color), ...style}}
                       color={actualColor}{...otherProps}/>
}


export function SimpleSpan(props: ElementProps & {text: string, color?: Color}){
    const {text,color,style, ...otherProps} = deflattenStyle(props);
    return <span style = {{...gradientStyle(color),...style}} {...otherProps}>
        {text}
    </span>
}

function gradientStyle(color: Color | undefined): CSSProperties {
    return isGradient(color) ? {
        background: gradientToCss(color),
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent"
    } : {color}
}