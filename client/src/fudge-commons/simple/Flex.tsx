import React from "react";
import * as CSS from "csstype";
import {ElementProps, ManyChildParentProps, WithChildren} from "./SimpleElementProps";
import {deflattenStyle} from "./impl/SimpleImpl";
import {Flex} from "./impl/FlexImpl";
//aaa
export function Stack(props: ManyChildParentProps) {
    return <div className={"stack"} {...deflattenStyle(props)}/>
}

export function Row(props: FlexParentProps) {
    return  Flex({flexDirection: "row", ...props})
}

export function Column(props: FlexParentProps) {
    return Flex({flexDirection: "column", ...props})
}

export type FlexParentProps = FlexProps & WithChildren

/**
 * @see https://css-tricks.com/snippets/css/a-guide-to-flexbox/#flexbox-properties
 */
export interface FlexProps extends ElementProps {
    /**
     * The **`flex-wrap`** CSS property sets whether flex items are forced onto one line or can wrap onto multiple lines. If wrapping is allowed, it sets the direction that lines are stacked.
     * @see https://developer.mozilla.org/docs/Web/CSS/flex-wrap
     */
    flexWrap?: CSS.Property.FlexWrap
    /**
     * The **`flex-flow`** CSS shorthand property specifies the direction of a flex container, as well as its wrapping behavior.
     * @see https://developer.mozilla.org/docs/Web/CSS/flex-flow
     */
    flexFlow?: CSS.Property.FlexFlow
    /**
     * The CSS **`justify-content`** property defines how the browser distributes space between and around content items along the main-axis of a flex container, and the inline axis of a grid container.
     * @see https://developer.mozilla.org/docs/Web/CSS/justify-content
     */
    justifyContent?: CSS.Property.JustifyContent
    /**
     * This defines the default behavior for how flex items are laid out along the cross axis on the current line. Think of it as the justify-content version for the cross-axis (perpendicular to the main-axis).
     * @see https://developer.mozilla.org/en-US/docs/Web/CSS/align-items
     */
    alignItems?: FlexAlignment
    /**
     * This aligns a flex container’s lines within when there is extra space in the cross-axis, similar to how justify-content aligns individual items within the main-axis.
     * @see https://developer.mozilla.org/en-US/docs/Web/CSS/align-content
     */
    alignContent?: FlexAlignment
}

export type Align = "start" | "center" | "end"
export type FlexAlignment = Align | "stretch"














