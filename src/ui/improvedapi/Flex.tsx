import React, {CSSProperties} from "react";
import * as CSS from "csstype";
import {deflattenStyle, ManyChildParentProps} from "./Element";


/**
 * {@link https://css-tricks.com/snippets/css/a-guide-to-flexbox/#flexbox-properties Flexbox Guide}
 */
export interface RowProps extends ManyChildParentProps {
    flexWrap?: CSS.Property.FlexWrap
    flexFlow?: CSS.Property.FlexFlow
    justifyContent?: CSS.Property.JustifyContent
    /**
     * This defines the default behavior for how flex items are laid out along the cross axis on the current line. Think of it as the justify-content version for the cross-axis (perpendicular to the main-axis).
     */
    alignItems?: FlexAlignment
    /**
     * This aligns a flex container’s lines within when there is extra space in the cross-axis, similar to how justify-content aligns individual items within the main-axis.
     */
    alignContent?: FlexAlignment
}

export type Alignment = "start" | "center" | "end"
export type FlexAlignment = Alignment | "stretch"

export type ColumnProps = RowProps

export interface FlexProps extends RowProps {
    flexDirection: CSS.Property.FlexDirection
}
export function fixAlignment<T extends FlexAlignment >(alignment: T | undefined):
    Exclude<T,"end" | "start"> | "flex-end" | "flex-start" | undefined {
    switch (alignment) {
        case "end":
            return "flex-end"
        case "start":
            return "flex-start"
        default:
            // @ts-ignore
            return alignment
    }
}

function deflattenFlex(props: FlexProps) {
    const {
        flexWrap,
        flexFlow,
        justifyContent,
        alignItems,
        alignContent,
        flexDirection,
        style,
        ...otherProps
    } = deflattenStyle(props);
    const newStyle: CSSProperties = {
        display: "flex",
        // flexFlow must be first to not override flexWrap and flexDirection...
        flexFlow,
        flexWrap,
        justifyContent,
        alignItems: fixAlignment(alignItems),
        alignContent: fixAlignment(alignContent),
        flexDirection, ...style
    }
    return {
        style: newStyle, ...otherProps
    }
}

function Flex(props: FlexProps) {
    // const {flexWrap, flexFlow, justifyContent, alignItems, alignContent, flexDirection, style, ...otherProps} = props;
    // const {children, style, ...otherProps} = props;
    return <div{...deflattenFlex(props)}/>
}

export function Stack(props: ManyChildParentProps) {
    return <div className={"stack"} {...deflattenStyle(props)}/>
}

export function Column(props: ColumnProps) {
    return Flex({flexDirection: "column", ...props})
}

export function Row(props: RowProps) {
    return Flex({flexDirection: "row", ...props})
}

