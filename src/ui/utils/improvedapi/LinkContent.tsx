import React from "react";
import {WithChild} from "./SimpleElementProps";

/**
 * Makes the parent a link
 */
export function LinkContent({href, children}: { href: string } & WithChild) {
    return <a href={href} style={{display: "block", textDecoration: "none"}}>
        {children}
    </a>
}