/* eslint-disable react-hooks/rules-of-hooks */

import {SingleChildParentProps, WithChild} from "./Element";
import React, {Fragment, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState} from "react";
import {Stack} from "./Flex";
import {Wrap} from "./Core";
import {objectMap, Require, withoutKey, withProperty} from "../Utils";
import {ClickAwayListener} from "@mui/material";


type ExpansionsState = Record<string, ExpansionProps>


//////// API /////////
export function WithExpansions(props: WithChild) {
    const expansions = useMemo(() => new Expansions(), []);
    const [showingExpansions, setShowingExpansions] = useState<ExpansionsState>({});
    const [exitingExpansions, setExitingExpansions] = useState<ExpansionsState>({});

    expansions.init(targeted => {
        const show = showState(targeted.state);
        switch (show) {
            case "show":
                setShowingExpansions(old => withProperty(old, targeted.id, targeted));
                setExitingExpansions(old => withoutKey(old, targeted.id));
                break;
            case "snap-close":
                setShowingExpansions(old => withoutKey(old, targeted.id));
                break;
            case "closed":
                setShowingExpansions(old => withoutKey(old, targeted.id));
                setExitingExpansions(old => withProperty(old, targeted.id, targeted));
                setTimeout(() => setExitingExpansions(old => withoutKey(old, targeted.id)), targeted.animationDurationMillis);
                break;

        }
    });

    const allExpansions = {...showingExpansions, ...exitingExpansions}
    return <Expansions.Context.Provider value={expansions}>
        <Stack>
            {props.children}
            {objectMap(allExpansions, (id, expansion) => <ExpansionImpl key={expansion.id} {...expansion}/>)}
        </Stack>
    </Expansions.Context.Provider>
}

export type OnDismiss = () => void

export interface ExpansionPropsApi extends SingleChildParentProps {
    id: string;
    state: ExpansionState;
    anchor: Element | null;
    onDismiss: OnDismiss
    anchorReference: Alignment
    position: Alignment;
    animationDurationMillis?: number
}

type ExpansionProps = Require<ExpansionPropsApi, "animationDurationMillis">

// type ExpansionProps = Require<ExpansionPropsApi, "animationDurationMillis">


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


export function Expansion(props: ExpansionPropsApi) {
    const expansionHandler = useContext(Expansions.Context);
    useEffect(() => {
        const implProps = {...props, animationDurationMillis: props.animationDurationMillis ?? 100}
        expansionHandler.set(implProps)
        return () => expansionHandler.set({...implProps, state: "snap-close"});
    }, [expansionHandler, props])

    return <Fragment/>
}


export function useExpansion(): StandaloneExpansionState {
    const [show, setShow] = React.useState<ShowState>("closed");
    useEffect(() => {
        // Cleanup
    });
    return new StandaloneExpansionState(show, setShow);
}

type ShowState = "show" | "snap-close" | "closed"
export type ExpansionState = StandaloneExpansionState | ShowState;

function showState(expansionState: ExpansionState) : ShowState {
    return expansionState instanceof StandaloneExpansionState ? expansionState.isShowing : expansionState;
}

export class StandaloneExpansionState {

    readonly isShowing: ShowState;
    private readonly setShow: (show: ShowState) => void

    constructor(show: ShowState, setShow: (show: ShowState) => void) {
        this.isShowing = show;
        this.setShow = setShow;
    }

    /**
     * Make sure you call these via lambdas. Don't pass these methods as-is or it will crash.
     */

    show() {
        this.setShow("show");
    }

    hide() {
        this.setShow("closed");
    }

    toggle() {
        this.setShow(this.isShowing === "show" ? "closed" : "show");
    }
}

///////////// Expansions impl ///////////////
type SetExpansion = (expansionsProps: ExpansionProps) => void

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


//TODO: clickoutsidehandler
function ExpansionImpl(props: ExpansionProps) {
    const {
        id,
        state,
        anchor,
        onDismiss,
        anchorReference,
        position,
        style,
        animationDurationMillis,
        ...elementProps
    } = props
    if (anchor === null) return <Fragment/>

    const referenceAlign = toNumericAlignment(anchorReference);
    const positionAlign = toNumericAlignment(position);
    const anchorPos = anchor.getBoundingClientRect();
    const anchorX = anchorPos.left * (1 - referenceAlign.x) + anchorPos.right * referenceAlign.x;
    const anchorY = anchorPos.top * (1 - referenceAlign.y) + anchorPos.bottom * referenceAlign.y;

    // Calculate the size of the expansion so we can position it properly
    const [rect, setRect] = useState<DOMRect | undefined>(undefined);

    const offset = rect === undefined ? {x: 0, y: 0} : {
        x: rect.width * positionAlign.x,
        y: rect.height * positionAlign.y
    }

    const x = anchorX - offset.x;
    const y = anchorY - offset.y

    const finalProps: SingleChildParentProps = {
        ...elementProps,
        style: {...style, position: "absolute", left: x, top: y}
    };

    const show = showState(state);
    return <Fragment>
        <SizeCalculator depProps={props} finalProps={finalProps} setRect={setRect}/>
        <ClickAwayListener onClickAway={() => {
            console.log("Outside")
            props.onDismiss();
        }}>
            <div>
                {GrowingAnimation({
                    //TODO: fix
                    duration: props.animationDurationMillis, show: show === "show", finalProps: finalProps
                })}
            </div>

        </ClickAwayListener>
    </Fragment>

}

//TODO: benchmark with and without duplicated divs, with and without inline styles

//TODO: consider using limited positioning if this causes performance issues
function SizeCalculator({
                            depProps,
                            setRect,
                            finalProps
                        }: { depProps: ExpansionProps, finalProps: SingleChildParentProps, setRect: (rect: DOMRect | undefined) => void }) {
    // First run: calculate = true:
    // - First useLayoutEffect is called, but calculate is true so it does nothing
    // - Second useLayoutEffect is called, calculating correct size and setting calculate to false
    // Second run: calculate = false
    // - First useLayoutEffect is not called because dependencies have not changed
    // - Second useLayoutEffect is called but calculate = false so it does nothing

    // First run: calculate = false:
    // - First useLayoutEffect is called, setting calculate to true
    // - Second useLayoutEffect is called but calculate = false so it does nothing
    // Second run: calculate = true:
    // - First useLayoutEffect is not called because dependencies have not changed
    // - Second useLayoutEffect is called, calculating correct size and setting calculate to false
    // Third run: calculate = false:
    // - First useLayoutEffect is not called because dependencies have not changed
    // - Second useLayoutEffect is called but calculate = false so it does nothing


    const ref = useRef<HTMLDivElement>(null)
    const [calculate, setCalculate] = React.useState(true)


    useLayoutEffect(() => {
        if (!calculate) setCalculate(true)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [depProps])


    useLayoutEffect(() => {
        if (calculate) {
            setRect(ref.current!.getBoundingClientRect())
            setCalculate(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [depProps, calculate])

    return <Fragment>
        {calculate && <Wrap divRef={ref} {...finalProps}/>}
    </Fragment>
}


function GrowingAnimation({
                              show,
                              finalProps,
                              duration
                          }: { duration: number, show: boolean, finalProps: SingleChildParentProps }) {
    const [shrink, setShrink] = React.useState(true);

    // If show = false then shrink will stay as true and it will shrink
    // If show = true then we want to start it off as shrink = true so the animation will work properly,
    // and then we set shrink = false in useEffect so it will grow.
    useLayoutEffect(() => setShrink(true), [show])

    useEffect(() => {
        if (show) {
            setShrink(false);
        }
    }, [show])

    const transform = shrink ? "scale(0.0)" : "scale(1.0)";
    const {style, ...otherProps} = finalProps;
    return <Wrap {...otherProps} style={{...style, transform: transform, transition: `transform ${duration}ms`}}/>

}

