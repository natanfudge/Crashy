import {isObj} from "crash-parser/src/util/Utils";
import {CSSProperties} from "react";

export type Color = string | Gradient

/**
 * See crashyTitleColor as example
 */
export interface Gradient {
    /**
     * Examples: <br> (b = blue, r = red)
     * 'to left':
     * bbbbbbbbbbbbbbbbbbbbbbbrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr
     * bbbbbbbbbbbbbbbbbbbbbbbrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr
     * bbbbbbbbbbbbbbbbbbbbbbbrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr
     * bbbbbbbbbbbbbbbbbbbbbbbrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr
     *
     * 'to top':
     * rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr
     * rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr
     * bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
     * bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
     */
    direction: GradientDirection
    firstColor: GradientColor
    midpointPercent?: number
    secondColor: GradientColor
}

export type GradientColor = string | {
    color: string
    endPercent: number
}

export type GradientDirection = "to bottom" | "to top" | "to right" | "to left"

export function isGradient(obj?: Color) : obj is Gradient {
    return isObj(obj) && obj?.firstColor !== undefined;
}

function gradientColorString(color: GradientColor) : string {
    return typeof color === "string"? color: `${color.color} ${color.endPercent}%`
}

export function gradientToCss(gradient: Gradient) : string {
   return cssFunction("linear-gradient",
       gradient.direction,
       gradientColorString(gradient.firstColor),
       gradient.midpointPercent !== undefined? `${gradient.midpointPercent}%` : undefined,
       gradientColorString(gradient.secondColor)
   )
}

function cssFunction(name: string, ...args: (unknown | undefined)[]): string{
    return `${name}(${args.filter(arg => arg !== undefined).join(",")})`
}