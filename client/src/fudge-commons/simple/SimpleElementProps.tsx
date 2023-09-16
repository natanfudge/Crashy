import * as CSS from "csstype";
import {Align} from "./Flex";
import React, {CSSProperties} from "react";
import {Border, ClickCallback, Margin, Padding, Size} from "./GuiTypes";

export interface FlexChildProps {
    /**
     * The **`order`** CSS property sets the order to lay out an item in a flex or grid container. Items in a container are sorted by ascending `order` value and then by their source code order.
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/order
     */
    order?: CSS.Property.Order
    /**
     * The flex-grow CSS property sets the flex grow factor of a flex item's main size.<br>
     * @see https://developer.mozilla.org/en-US/docs/Web/CSS/flex-grow
     */
    flexGrow?: CSS.Property.FlexGrow
    /**
     * The flex-shrink CSS property sets the flex shrink factor of a flex item. If the size of all flex items is larger than the flex container, items shrink to fit according to flex-shrink.<br>
     * @see https://developer.mozilla.org/en-US/docs/Web/CSS/flex-shrink
     */
    flexShrink?: CSS.Property.FlexShrink
    /**
     * The flex-basis CSS property sets the initial main size of a flex item. It sets the size of the content box unless otherwise set with box-sizing. <br>
     * @see https://developer.mozilla.org/en-US/docs/Web/CSS/flex-basis
     */
    flexBasis?: CSS.Property.FlexBasis
    /**
     * The align-self CSS property overrides a grid or flex item's align-items value. In Grid, it aligns the item inside the grid area. In Flexbox, it aligns the item on the cross axis. <br>
     * @see https://developer.mozilla.org/en-US/docs/Web/CSS/align-self
     */
    alignSelf?: Align
}

export interface StyleProps extends FlexChildProps {
    /**
     * The padding area, bounded by the padding edge, extends the content area to include the element's padding.
     * @see https://developer.mozilla.org/en-US/docs/Web/CSS/padding
     */
    padding?: Padding;
    /**
     * The margin area, bounded by the margin edge, extends the border area to include an empty area used to separate the element from its neighbors.
     * @see https://developer.mozilla.org/en-US/docs/Web/CSS/margin
     */
    margin?: Margin;
    /**
     * The **`height`** CSS property specifies the height of an element. By default, the property defines the height of the content area. If `box-sizing` is set to `border-box`, however, it instead determines the height of the border area.
     * @see https://developer.mozilla.org/docs/Web/CSS/height
     */
    height?: Size;
    /**
     * The **`width`** CSS property sets an element's width. By default, it sets the width of the content area, but if `box-sizing` is set to `border-box`, it sets the width of the border area.
     * @see https://developer.mozilla.org/docs/Web/CSS/width
     */
    width?: Size;
    /**
     * The **`max-width`** CSS property sets the maximum width of an element. It prevents the used value of the `width` property from becoming larger than the value specified by `max-width`.
     * @see https://developer.mozilla.org/docs/Web/CSS/max-width
     */
    maxWidth?: Size;
    /**
     * The **`max-height`** CSS property sets the maximum height of an element. It prevents the used value of the `height` property from becoming larger than the value specified for `max-height`.
     * @see https://developer.mozilla.org/docs/Web/CSS/max-height
     */
    maxHeight?: Size;
    /**
     * The **`background-color`** CSS property sets the background color of an element.
     * @see https://developer.mozilla.org/docs/Web/CSS/background-color
     */
    backgroundColor?: CSS.Property.BackgroundColor
    /**
     * The **`border`** shorthand CSS property sets an element's border. It sets the values of `border-width`, `border-style`, and `border-color`.
     * @see https://developer.mozilla.org/docs/Web/CSS/border
     */
    border?: Border
    /**
     * The **`position`** CSS property sets how an element is positioned in a document. The `top`, `right`, `bottom`, and `left` properties determine the final location of positioned elements.
     * @see https://developer.mozilla.org/docs/Web/CSS/position
     */
    position?: CSS.Property.Position
    /**
     * The **`overflow`** CSS shorthand property sets the desired behavior for an element's overflow — i.e. when an element's content is too big to fit in its block formatting context — in both directions.
     * @see https://developer.mozilla.org/docs/Web/CSS/overflow
     */
    overflow?: CSS.Property.Overflow
}

export interface ElementProps extends StyleProps {
    /**
     * `onClick` is invoked when the element is clicked. Passing a defined onClick will cause the element to appear clickable for the mouse cursor as well.
     */
    onClick?: ClickCallback
    style?: CSSProperties;
    className?: string;
}

export type WithChildren = {
    children: React.ReactNode
}

export type WithChild = {
    children: JSX.Element
}

export type ManyChildParentProps = ElementProps & WithChildren
export type SingleChildParentProps = ElementProps & WithChild