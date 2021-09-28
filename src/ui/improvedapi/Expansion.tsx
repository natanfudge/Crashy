import {SingleChildParentProps, WithChild} from "./Element";
import React, {Fragment, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState} from "react";
import {Stack} from "./Flex";
import {Wrap} from "./Core";
import {coerce, objectMap, Require, withoutKey, withProperty} from "../Utils";
import {ClickAwayListener} from "@mui/material";
import ReactDOM from "react-dom";


type ExpansionsState = Record<string, ExpansionProps>


//////// API /////////
export function WithExpansions(props: WithChild) {
    const expansions = useMemo(() => new Expansions(), []);
    const [showingExpansions, setShowingExpansions] = useState<ExpansionsState>({});
    const [exitingExpansions, setExitingExpansions] = useState<ExpansionsState>({});

    expansions.init(targeted => {
        switch (targeted.show) {
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

export type ExpansionPropsApi = ManualExpansionProps | ManagedExpansionProps

function isManualApi(props: ExpansionPropsApi): props is ManualExpansionProps {
    return "show" in props;
}

export interface ManualExpansionProps extends BaseExpansionPropsApi {
    show: ShowState;
    anchor: Element | null;
}

export interface ManagedExpansionProps extends BaseExpansionPropsApi {
    state: ExpansionState
}

export interface BaseExpansionPropsApi extends SingleChildParentProps {
    id: string;
    onDismiss: OnDismiss
    anchorReference: Alignment
    position: Alignment;
    sticky?: boolean
    animationDurationMillis?: number
}

type NewShowState = "show" | "animate-close" | "close"

type ExpansionProps = Require<ManualExpansionProps, "animationDurationMillis" | "sticky">

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

export interface TimeoutWrapper {
    timeout?: ReturnType<typeof setTimeout>
}

function stop(timeout: TimeoutWrapper) {
    if (timeout.timeout === undefined) return;
    else {
        clearTimeout(timeout.timeout);
        timeout.timeout = undefined;
    }
}

function ExpansionNode(props: ExpansionProps) {
    const expansionHandler = useContext(Expansions.Context);
    console.log("Show: " + props.show);
    const [completelyClosed, setCompletelyClosed] = useState(false);
    const show = props.show === "show"
    const timeoutHandle = useMemo<TimeoutWrapper>(() => ({timeout: undefined}), [show]);

    useEffect(() => {
        if (show) {
            // Showing, no need to completely close
            stop(timeoutHandle);
            setCompletelyClosed(false);
        } else if (!completelyClosed && timeoutHandle.timeout === undefined) {
            // Checked undefined to make sure we only do this once each time its needed.
            timeoutHandle.timeout = setTimeout(() => setCompletelyClosed(true), props.animationDurationMillis)
        }
        return () => {
            // Existing composition, no need to completely close
            stop(timeoutHandle);
        };
    }, [props.animationDurationMillis, show, completelyClosed])

    // const
    return ReactDOM.createPortal(
        (show || !completelyClosed) && <ExpansionImpl {...props} />,
        document.getElementById('root')!);
    // useEffect(() => {
    //     expansionHandler.set(props)
    //     return () => expansionHandler.set({...props, show: "snap-close"});
    // }, [expansionHandler, props])

    // return <Fragment/>
}

export function Expansion(props: ExpansionPropsApi) {
    const manualProps: ManualExpansionProps = isManualApi(props) ? props : {
        ...props,
        anchor: props.state.anchor,
        show: props.state.showState
    }
    return ExpansionNode({
        ...manualProps,
        sticky: manualProps.sticky ?? false,
        animationDurationMillis: manualProps.animationDurationMillis ?? 100
    });
}

interface AnchorWrapper {
    anchor: Anchor
}

export function useExpansion(): ExpansionState {
    const anchorElement = React.useMemo<AnchorWrapper>(() => ({anchor: null}), []);
    const [show, setShow] = React.useState<ShowState>("closed");
    return new ExpansionState(show, setShow, anchorElement.anchor, anchor => {
            anchorElement.anchor = anchor
        }
    );
}

//TODO: try to replace with portals

type ShowState = "show" | "snap-close" | "closed"

type Anchor = Element | null

export class ExpansionState {

    readonly showState: ShowState;
    readonly anchor: Anchor

    private readonly setAnchor: (anchor: Anchor) => void
    private readonly setShow: (show: ShowState) => void

    constructor(show: ShowState, setShow: (show: ShowState) => void, anchor: Anchor, setAnchor: (anchor: Anchor) => void) {
        this.showState = show;
        this.setShow = setShow;
        this.anchor = anchor;
        this.setAnchor = setAnchor;
    }

    toString() {
        return `{state: ${this.showState}, anchor: ${JSON.stringify(this.anchor?.getBoundingClientRect()) ?? "null"}}`
    }


    /**
     * Make sure you call these via lambdas. Don't pass these methods as-is or it will crash.
     */

    show(anchor: Anchor) {
        this.setAnchor(anchor);
        this.setShow("show");
    }

    hide() {
        this.setShow("closed");
    }

    toggle(anchor: Anchor) {
        this.showState === "show" ? this.hide() : this.show(anchor);
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
        show,
        anchor,
        onDismiss,
        anchorReference,
        position,
        style,
        animationDurationMillis,
        sticky,
        ...elementProps
    } = props
    // Calculate the size of the expansion so we can position it properly
    const [rect, setRect] = useState<DOMRect | undefined>(undefined);
    console.log("Anchor: " + anchor);
    if (anchor === null) return <Fragment/>


    const {x, y} = positionExpansion({
        anchorRect: anchor.getBoundingClientRect(),
        anchorAlignment: toNumericAlignment(anchorReference),
        expansionRect: rect ?? {height: 0, width: 0, top: 0, left: 0},
        expansionAlignment: toNumericAlignment(position)
    })

    const finalProps: SingleChildParentProps = {
        ...elementProps,
        style: {...style, position: sticky ? "fixed" : "absolute", left: x, top: y}
    };

    console.log("Show in impl: " + show);
    return <Fragment>
        <SizeCalculator depProps={props} finalProps={finalProps} setRect={setRect}/>
        <ClickAwayListener onClickAway={() => props.onDismiss()}>
            <div style={{zIndex: 2000}}>
                <GrowingAnimation duration={props.animationDurationMillis} show={show === "show"}
                                  finalProps={finalProps}/>
                {/*{GrowingAnimation({*/}
                {/*    duration: props.animationDurationMillis, show: show === "show", finalProps*/}
                {/*})}*/}
            </div>

        </ClickAwayListener>
    </Fragment>
}


interface Rect {
    top: number;
    left: number;
    height: number;
    width: number;
}


function positionExpansion({anchorRect, expansionRect, anchorAlignment, expansionAlignment}:
                               { anchorRect: DOMRect, expansionRect: Rect, anchorAlignment: NumericAlignment, expansionAlignment: NumericAlignment })
    : { x: number, y: number } {
    const anchorX = anchorRect.left * (1 - anchorAlignment.x) + anchorRect.right * anchorAlignment.x;
    const anchorY = anchorRect.top * (1 - anchorAlignment.y) + anchorRect.bottom * anchorAlignment.y;
    const offsetX = expansionRect.width * expansionAlignment.x
    const offsetY = expansionRect.height * expansionAlignment.y

    const x = anchorX - offsetX;
    const y = anchorY - offsetY;

    // Don't let the expansion overflow out of the screen
    const maxX = document.body.clientWidth - expansionRect.width;
    const maxY = document.body.scrollWidth - expansionRect.height;

    return {x: coerce(x, {min: 0, max: maxX}), y: coerce(y, {min: 0, max: maxY})}
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

function GrowingAnimationTest({
                                  show,
                                  finalProps,
                                  duration
                              }: { duration: number, show: boolean, finalProps: SingleChildParentProps }) {

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
    return <Wrap {...otherProps} style={{...style, transform, transition: `transform ${duration}ms`}}/>

}

