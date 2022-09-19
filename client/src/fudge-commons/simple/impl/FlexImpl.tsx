import React, {CSSProperties} from "react";
import {deflattenStyle} from "./SimpleImpl";
import * as CSS from "csstype";
import {FlexAlignment, FlexParentProps} from "../Flex";

 interface FlexImplProps extends FlexParentProps {
    flexDirection: CSS.Property.FlexDirection
}

export function Flex(props: FlexImplProps) {
    // const {flexWrap, flexFlow, justifyContent, alignItems, alignContent, flexDirection, style, ...otherProps} = props;
    // const {children, style, ...otherProps} = props;
    return <div{...deflattenFlex(props)}/>
}

export function deflattenFlex(props: FlexImplProps) {
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

export function fixAlignment<T extends FlexAlignment>(alignment: T | undefined): T | "flex-end" | "flex-start" | undefined {
    switch (alignment) {
        case "end":
            return "flex-end"
        case "start":
            return "flex-start"
        default:
            return alignment
    }
}