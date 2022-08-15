import {useEffect, useState} from "react";
import {Alignment, NumericAlignment, Rect} from "../types/Gui";


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

function orientationIsPortrait(orientationType: OrientationType): boolean {
    return orientationType === "portrait-primary" || orientationType === "portrait-secondary";
}

export class ScreenSize {
    private size: Rect
    get isPortrait(): boolean {
        return this.size.width < this.size.height;
    }

    get isPhone(): boolean {
        return this.size.width < 920;
    }
    constructor(size: Rect) {
        this.size = size;
    }

    static ofDocument(document: Document) {
        return new ScreenSize(document.body.getBoundingClientRect());
    }
}

export function useScreenSize(): ScreenSize {
    const [screenSize, setScreenSize] = useState(ScreenSize.ofDocument(document))

    useEffect(() => {
        function handleResize() {
            setScreenSize(ScreenSize.ofDocument(document))
        }

        window.addEventListener('resize', handleResize)

        return () => window.removeEventListener('resize', handleResize)
    })
    return screenSize;
}