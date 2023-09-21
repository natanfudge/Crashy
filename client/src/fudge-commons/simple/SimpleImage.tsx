import React from "react";
import {deflattenStyle} from "./impl/SimpleImpl";
import {ElementProps} from "./SimpleElementProps";

export interface ImageProps extends ElementProps {
    /**
     * An alternate text for an image
     */
    alt: string;
    /**
     * 	The path to the image
     */
    src: string | undefined;
}

/**
 * {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img}
 */
export function SimpleImage(props: ImageProps) {
    return <img {...deflattenStyle(props)}/>
}