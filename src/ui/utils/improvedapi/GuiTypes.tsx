import * as CSS from "csstype";

export interface Border {
    width: number
    /**
     * The **`border-style`** shorthand CSS property sets the line style for all four sides of an element's border.
     * @see https://developer.mozilla.org/docs/Web/CSS/border-style
     */
    style: CSS.Property.BorderStyle
    /**
     * The border-color shorthand CSS property sets the color of an element's border.
     * @see https://developer.mozilla.org/docs/Web/CSS/border-color
     */
    color: CSS.Property.BorderColor
}

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/width
 */
export type Size =
    /**
     * The browser will calculate and select a width for the specified element.
     */
    "auto"
    /**
     * Uses the fit-content formula with the available space replaced by the specified argument, i.e. min(max-content, max(min-content, <length-percentage>)).
     */
    | "fit-content"
    /**
     * In CSS, the intrinsic size of an element is the size it would be based on its content, if no external factors were applied to it.
     * For example, inline elements are sized intrinsically: width, height, and vertical margin and padding have no impact, though horizontal margin and padding do.
     * @see https://developer.mozilla.org/en-US/docs/Glossary/Intrinsic_Size
     */
    | "intrinsic"
    /**
     * The intrinsic preferred size.
     */
    | "max-content"
    /**
     * The intrinsic minimum size.
     */
    | "min-content"
    | "min-intrinsic"
    /**
     * Same as 100%
     */
    | "max"
    /**
     * Defines the size in pixels
     */
    | number
    /**
     * Defines the size as a percentage of the containing block's size.
     */
    | Percent

export interface Percent {
    percent: number
}

export type ClickCallback = (htmlElement: Element) => void

export interface Directions {
    top?: number
    right?: number
    left?: number
    bottom?: number
}

export interface Axes {
    /**
     * Left to right
     */
    horizontal?: number
    /**
     * Top to bottom
     */
    vertical?: number
}

export type Margin = number | Directions | MarginAxes
export type Padding = number | Directions | PaddingAxes
export type PaddingAxes = Axes
export type MarginAxes = Axes