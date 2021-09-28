import React, {CSSProperties} from "react";
import * as CSS from "csstype"
import {Align, fixAlignment} from "./Flex";
import {isObj} from "../Generic";


interface FlexChildProps {
    order?: CSS.Property.Order
    flexGrow?: CSS.Property.FlexGrow
    flexShrink?: CSS.Property.FlexShrink
    /**
     * sets the initial main size
     */
    flexBasis?: CSS.Property.FlexBasis
    alignSelf?: Align
}

interface StyleProps extends FlexChildProps {
    padding?: Padding;
    margin?: Margin;
    height?: Size;
    width?: Size;
    backgroundColor?: CSS.Property.BackgroundColor
    isBold?: boolean
}

type Size = "auto"
    | "fit-content"
    | "intrinsic"
    | "max-content"
    | "min-content"
    | "min-intrinsic"
    | "max"
    | number
    | Percent

interface Percent {
    percent: number
}

export type ClickCallback = (htmlElement: Element) => void

export interface ElementProps extends StyleProps {
    onClick?: ClickCallback
    className?: string
    /**
     * @deprecated
     */
    style?: CSSProperties;
}

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

function isAxes(obj: Padding): obj is Axes {
    return isObj(obj) && ("horizontal" in obj || "vertical" in obj)
}


function expandPaddingOrMargin(paddingOrMargin?: Padding): Directions {
    if (paddingOrMargin === undefined) {
        return {}
    } else if (typeof paddingOrMargin === "number") {
        return {
            top: paddingOrMargin,
            bottom: paddingOrMargin,
            left: paddingOrMargin,
            right: paddingOrMargin
        };
    } else if (isAxes(paddingOrMargin)) {
        return {
            top: paddingOrMargin.vertical,
            bottom: paddingOrMargin.vertical,
            left: paddingOrMargin.horizontal,
            right: paddingOrMargin.horizontal
        };
    } else {
        return paddingOrMargin;
    }
}

function isPercent(obj: Size): obj is Percent {
    return isObj(obj) && obj.percent !== undefined;
}

function expandSize(size?: Size): CSS.Property.Width | undefined | number {
    if (size === undefined) return undefined;
    if (size === "max") return "100%"
    if (isPercent(size)) {
        return `${size.percent}%`
    } else {
        return size
    }
}

export type WithChildren = {
    children: React.ReactNode
}

export type WithChild = {
    children: JSX.Element
}

export type ManyChildParentProps = ElementProps & WithChildren
export type SingleChildParentProps = ElementProps & WithChild

// let totalTime = 0;
export function deflattenStyle<T extends ElementProps>(props: T) {
    const {
        backgroundColor,
        padding,
        margin,
        height,
        width,
        flexBasis,
        flexGrow,
        flexShrink,
        order,
        alignSelf,
        style,
        isBold,
        onClick,
        ...otherProps
    } = props;

    const expandedPadding = expandPaddingOrMargin(padding);

    const expandedMargin = expandPaddingOrMargin(margin);

    const paddingObjPart = expandedPadding === undefined? undefined: {
        paddingTop: expandedPadding.top,
        paddingRight: expandedPadding.right,
        paddingLeft: expandedPadding.left,
        paddingBottom: expandedPadding.bottom
    }
    const marginObjPart = expandedMargin === undefined? undefined: {
        marginTop: expandedMargin.top,
        marginRight: expandedMargin.right,
        marginLeft: expandedMargin.left,
        marginBottom: expandedMargin.bottom
    }

    const expandedHeight = expandSize(height)
    const expandedWidth = expandSize(width)

    const newStyle: CSSProperties = {
        ...paddingObjPart, ...marginObjPart,
        height: expandedHeight,
        width: expandedWidth,
        minHeight: expandedHeight,
        minWidth: expandedWidth,
        flexBasis,
        flexGrow,
        flexShrink,
        order,
        fontWeight: isBold === true ? "bold" : undefined,
        alignSelf: fixAlignment(alignSelf),
        cursor: props.onClick !== undefined ? "pointer" : undefined,
        backgroundColor,
        ...style
    }

    const reactOnClick: React.MouseEventHandler | undefined = onClick !== undefined ? (event => onClick(event.currentTarget)) : undefined

    return {
        style: newStyle,
        onClick: reactOnClick,
        ...otherProps
    };
}