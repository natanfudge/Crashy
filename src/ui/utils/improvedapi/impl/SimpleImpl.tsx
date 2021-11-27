import React, {CSSProperties} from "react";
import * as CSS from "csstype";
import {isObj} from "crash-parser/src/util/Utils";
import {Axes, Directions, Padding, Percent, Size} from "../GuiTypes";
import {ElementProps} from "../SimpleElementProps";
import {fixAlignment} from "./FlexImpl";

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
        onClick,
        border,
        position,
        maxWidth,
        maxHeight,
        overflow,
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

    const borderObjPart = border === undefined? undefined: {
        borderWidth: border.width,
        borderStyle: border.style,
        borderColor: border.color
    }

    const expandedHeight = expandSize(height)
    const expandedWidth = expandSize(width)
    const expandedMaxWidth = expandSize(maxWidth)
    const expandedMaxHeight = expandSize(maxHeight)


    const newStyle: CSSProperties = {
        ...paddingObjPart, ...marginObjPart, ...borderObjPart,
        height: expandedHeight,
        width: expandedWidth,
        minHeight: expandedHeight,
        minWidth: expandedWidth,
        maxWidth: expandedMaxWidth,
        maxHeight: expandedMaxHeight,
        flexBasis,
        flexGrow,
        flexShrink,
        order,
        overflow,
        alignSelf: fixAlignment(alignSelf),
        cursor: props.onClick !== undefined ? "pointer" : undefined,
        backgroundColor,
        position,
        ...style
    }

    const reactOnClick: React.MouseEventHandler | undefined = onClick !== undefined ? (event => onClick(event.currentTarget)) : undefined

    return {
        style: newStyle,
        onClick: reactOnClick,
        ...otherProps
    };
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

function isAxes(obj: Padding): obj is Axes {
    return isObj(obj) && ("horizontal" in obj || "vertical" in obj)
}

function expandSize(size: Size | undefined): CSS.Property.Width | undefined | number {
    if (size === undefined) return undefined;
    if (size === "max") return "100%"
    if (isPercent(size)) {
        return `${size.percent}%`
    } else {
        return size
    }
}

function isPercent(obj: Size): obj is Percent {
    return isObj(obj) && obj.percent !== undefined;
}