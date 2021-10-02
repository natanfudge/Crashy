export interface NumericAlignment {
    /**
     * 0.0 to 1.0
     */
    x: number
    /**
     * 0.0 to 1.0
     */
    y: number
}

export type EdgeAlignment =
    "top-left"
    | "top-center"
    | "top-right"
    | "middle-left"
    | "center"
    | "middle-right"
    | "bottom-left"
    | "bottom-center"
    | "bottom-right"
export type Alignment = EdgeAlignment | NumericAlignment

export interface Rect {
    top: number;
    left: number;
    height: number;
    width: number;
}

export function toNumericAlignment(edge: Alignment): NumericAlignment {
    if (typeof edge !== "string") return edge;
    switch (edge) {
        case "top-left":
            return {x: 0, y: 0}
        case "top-center":
            return {x: 0.5, y: 0}
        case "top-right":
            return {x: 1, y: 0}
        case "middle-left":
            return {x: 0, y: 0.5}
        case "center":
            return {x: 0.5, y: 0.5}
        case "middle-right":
            return {x: 1, y: 0.5}
        case "bottom-left":
            return {x: 0, y: 1}
        case "bottom-center":
            return {x: 0.5, y: 1}
        case "bottom-right":
            return {x: 1, y: 1}
    }
}

