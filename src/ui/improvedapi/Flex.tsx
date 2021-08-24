import React, {CSSProperties} from "react";
import * as CSS from "csstype";
import {deflattenStyle,  ParentProps} from "./Element";


/**
 * {@link https://css-tricks.com/snippets/css/a-guide-to-flexbox/#flexbox-properties Flexbox Guide}
 */
export interface RowProps extends ParentProps {
    flexWrap?: CSS.Property.FlexWrap
    flexFlow?: CSS.Property.FlexFlow
    justifyContent?: CSS.Property.JustifyContent
    /**
     * This defines the default behavior for how flex items are laid out along the cross axis on the current line. Think of it as the justify-content version for the cross-axis (perpendicular to the main-axis).
     */
    alignItems?: CSS.Property.AlignItems
    /**
     * This aligns a flex container’s lines within when there is extra space in the cross-axis, similar to how justify-content aligns individual items within the main-axis.
     */
    alignContent?: CSS.Property.AlignContent
}

type ColumnProps = RowProps

export interface FlexProps extends RowProps {
    flexDirection: CSS.Property.FlexDirection
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
    return {
        style: {
            display: "flex",
            // flexFlow must be first to not override flexWrap and flexDirection...
            flexFlow,
            flexWrap,
            justifyContent,
            alignItems,
            alignContent,
            flexDirection, ...style
        }, ...otherProps
    }
}

function Flex(props: FlexProps) {
    // const {flexWrap, flexFlow, justifyContent, alignItems, alignContent, flexDirection, style, ...otherProps} = props;
    // const {children, style, ...otherProps} = props;
    return <div{...deflattenFlex(props)}/>
}

export function Stack(props: ParentProps) {
    return <div className={"stack"} {...deflattenStyle(props)}/>
}

export function Column(props: ColumnProps) {
    return Flex({flexDirection: "column", ...props})
}

export function Row(props: RowProps) {
    return Flex({flexDirection: "row", ...props})
}

