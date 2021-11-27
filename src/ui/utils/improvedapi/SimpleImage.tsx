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
    // eslint-disable-next-line jsx-a11y/alt-text
    return <img {...deflattenStyle(props)}/>
}