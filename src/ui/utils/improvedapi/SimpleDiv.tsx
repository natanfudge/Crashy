import React from "react";
import {deflattenStyle} from "./impl/SimpleImpl";
import {ElementProps, ManyChildParentProps, SingleChildParentProps} from "./SimpleElementProps";

type Reffable = {divRef?: React.Ref<HTMLDivElement>}
/**
 * Places a div element with the specified props.
 * Mainly acts as empty space <br>
 * {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div}
 */
export function Spacer(props: ElementProps) {
    return <div {...deflattenStyle(props)}/>
}

/**
 * Use for wrapping a single element with props
 */
export function Wrap(props: SingleChildParentProps & Reffable) {
    return WrapMultiple(props);
}

/**
 * Use for when you need multiple elements to be siblings but don't have any kind of layout relationship between them, e.g. when there is a dialog.
 */
export function WrapMultiple(props: ManyChildParentProps & Reffable) {
    const {divRef,...otherProps} = props;
    return <div {...deflattenStyle(otherProps)} ref = {props.divRef}/>
}