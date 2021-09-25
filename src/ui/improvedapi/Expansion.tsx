/* eslint-disable react-hooks/rules-of-hooks */

import {SingleChildParentProps, WithChild} from "./Element";
import React, {Fragment, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState} from "react";
import {Stack} from "./Flex";
import {duration} from "@mui/material";

type OnDismiss = () => void
type SetExpansion = (expansionsProps: ExpansionProps) => void

//////// API /////////
export function WithExpansions(props: WithChild) {
    const expansions = useMemo(() => new Expansions(), []);
    const [showingExpansions, setShowingExpansions] = useState<ExpansionProps[]>([]);

    expansions.init(targeted => {
        const show = isShowing(targeted.state);

        // Optimization: Don't re-render when setting show to false, and it wasn't shown anyway
        if (showingExpansions.every((expansion) => expansion.id !== targeted.id) && !show) return;

        setShowingExpansions(prevShown => {
            // console.log("Re-render")
            const notIncludingTargeted = prevShown.filter((prevInstance) => prevInstance.id !== targeted.id);
            // If show, add to array, if not, don't add to array
            //TODO: after animation delay remove from array
            return [...notIncludingTargeted, targeted] /*: notIncludingTargeted*/;
        })
    });
    // console.log("Expansions: " + showingExpansions.length);
    return <Expansions.Context.Provider value={expansions}>
        <Stack>
            {props.children}
            {showingExpansions.map((expansion) => <ExpansionImpl key={expansion.id} {...expansion}/>)}
        </Stack>
    </Expansions.Context.Provider>
}

export interface ExpansionProps extends SingleChildParentProps {
    id: string;
    state: ExpansionState;
    anchor?: Element;
    onDismiss: OnDismiss
    anchorReference: Alignment
    position: Alignment
}

// interface InternalExpansionProps extends ExpansionProps {
//
// }

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


// type VerticalExpansionPlacement = "top" | "center" | "bottom"
// type HorizontalExpansionPlacement = "top" | "center" | "bottom"


export function Expansion(props: ExpansionProps) {
    const expansionHandler = useContext(Expansions.Context);
    // const show = props.state.isShowing;
    useEffect(() => {
        expansionHandler.set(props)
    }, [expansionHandler, props])

    return <Fragment/>
}


export function useExpansion(): StandaloneExpansionState {
    const [show, setShow] = React.useState(false);
    return new StandaloneExpansionState(show, setShow);
}

export type ExpansionState = StandaloneExpansionState | boolean;

function isShowing(expansionState: ExpansionState) {
    return expansionState instanceof StandaloneExpansionState ? expansionState.isShowing : expansionState;
}

export class StandaloneExpansionState {

    readonly isShowing: boolean;
    private readonly setShow: (show: boolean) => void

    constructor(show: boolean, setShow: (show: boolean) => void) {
        this.isShowing = show;
        this.setShow = setShow;
    }

    /**
     * Make sure you call these via lambdas. Don't pass these methods as-is or it will crash.
     */

    show() {
        this.setShow(true);
    }

    hide() {
        this.setShow(false);
    }

    toggle() {
        this.setShow(!this.isShowing);
    }
}

///////////// Expansions impl ///////////////
class Expansions {
    static readonly Context = React.createContext(new Expansions());
    setExpansion!: SetExpansion;

    set(expansion: ExpansionProps) {
        this.setExpansion(expansion);
    }

    init(setShow: SetExpansion) {
        this.setExpansion = setShow;
    }
}

function toNumericAlignment(edge: Alignment): NumericAlignment {
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

enum TransformState {
    CalculatingSize,
    SettingTo0,
    SettingTo1
}

//TODO: clickoutsidehandler
function ExpansionImpl(props: ExpansionProps) {
    const {id, state, anchor, onDismiss, anchorReference, position, style, ...elementProps} = props
    if (anchor === undefined) return <Fragment/>

    const referenceAlign = toNumericAlignment(anchorReference);
    const positionAlign = toNumericAlignment(position);
    const anchorPos = anchor.getBoundingClientRect();
    const anchorX = anchorPos.left * (1 - referenceAlign.x) + anchorPos.right * referenceAlign.x;
    const anchorY = anchorPos.top * (1 - referenceAlign.y) + anchorPos.bottom * referenceAlign.y;

    // Calculate the size of the expansion so we can position it properly
    const ref = useRef<HTMLDivElement>(null)
    const [rect, setRect] = useState<DOMRect | undefined>(undefined);

    // console.log("Recompose?")
    useLayoutEffect(() => {
        // console.log("Recompose!")
        // console.log("Layout effect: current = " + ref.current)
        // setRect(ref.current!.getBoundingClientRect())
    }, [props])

    const offset = rect === undefined ? {x: 0, y: 0} : {
        x: rect.width * positionAlign.x,
        y: rect.height * positionAlign.y
    }

    // console.log("Width: " + rect?.width);

    // console.log("Offset: " + JSON.stringify(offset));
    // console.log("AnchorY: " + anchorY)

    const x = anchorX - offset.x;
    const y = anchorY - offset.y

    // const [transformed, setTransformed] = useState(false);
    //
    // useEffect(() => {
    //     if (rect === undefined) return;
    //     if (!transformed) setTransformed(true);
    // },[rect,transformed])
    //
    // const transform = transformed ?  undefined: "scale(0.5)";

    // {/*// return (/*<Grow in = {isShowing(state)}>*/*/}
    //     {/*//     <div>*/}
    //     {/*//         <Wrap {...elementProps} style={{...style, position: "absolute", left: x, top: y, transform:show? "scale(1.0)" : "scale(0.0)", transition: "transform 1s" }}*/}
    //     {/*//               divRef={ref}/>*/}
    //     {/*//     </div>*/}
    //     {/*//*/}
    //     {/*//  // </Grow>*/}
    //TODO: figure out how we measure size
    //TODO: i think, just shove it in some random div because it's gonna get deleted later

    const show = isShowing(state);
    // noinspection RequiredAttributes
    // console.log("Showing: " + isShowing(state));
    return (GrowingAnimation({
            show, children: <div>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. A ab accusantium aperiam architecto cum
                deserunt dicta
                distinctio dolore ea eos error facere illo iure, iusto laboriosam maiores minus molestias nobis numquam
                omnis
                praesentium provident reiciendis repellat repellendus similique sit tenetur vel voluptas voluptate
                voluptates!
                Culpa ducimus explicabo facilis omnis voluptates.
            </div>
        })
    )

}


function GrowingAnimation({show, children}: { show: boolean } & WithChild) {
    const [shrink, setShrink] = React.useState(true);

    // If show = false then shrink will stay as true and it will shrink
    // If show = true then we want to start it off as shrink = true so the animation will work properly,
    // and then we set shrink = false in useEffect so it will grow.
    useLayoutEffect(() => {
        setShrink(true);
    }, [show])

    useEffect(() => {
        if (show) {
            setShrink(false);
        }
    }, [show])

    const transform = shrink ? "scale(0.0)" : "scale(1.0)";
    return <div style={{transform: transform, transition: "transform 1s"}}>
        {children}
    </div>

}

const defaultStyle = {
    transition: `opacity ${duration}ms ease-in-out`,
    opacity: 0,
}

const transitionStyles = {
    entering: {opacity: 1},
    entered: {opacity: 1},
    exiting: {opacity: 0},
    exited: {opacity: 0},
};

// export functon Fade = ({ in: inProp }) => (
//     <Transition in={inProp} timeout={duration}>
//         {state => (
//             <div style={{
//                 ...defaultStyle,
//                 ...transitionStyles[state]
//             }}>
//                 I'm a fade Transition!
//             </div>
//         )}
//     </Transition>
// );