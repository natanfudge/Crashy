import {ExpansionPropsApi, ManagedExpansionProps, ManualExpansionProps} from "./Api";
import React, {Fragment, useEffect, useLayoutEffect, useMemo, useRef, useState} from "react";
import ReactDOM from "react-dom";
import {SingleChildParentProps} from "../improvedapi/Element";
import {ClickAwayListener} from "@mui/material";
import {Wrap} from "../improvedapi/Core";
import {coerce, NumericAlignment, Rect, Require, toNumericAlignment} from "../Generic";

export function _implExpansion(props: ExpansionPropsApi) {
    const manualProps: ManualExpansionProps = isManualApi(props) ? props : toManual(props)
    return ExpansionPortal({
        ...manualProps,
        sticky: manualProps.sticky ?? false,
        animationDurationMillis: manualProps.animationDurationMillis ?? 100
    });
}

function toManual({state, ...props}: ManagedExpansionProps) {
    return {
        ...props,
        anchor: state.currentAnchor,
        show: state.isShowing
    }
}

function isManualApi(props: ExpansionPropsApi): props is ManualExpansionProps {
    return "show" in props;
}

type ExpansionProps = Require<ManualExpansionProps, "animationDurationMillis" | "sticky">

function ExpansionPortal(props: ExpansionProps) {
    const [completelyClosed, setCompletelyClosed] = useState(false);
    const show = props.show
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
        (show || !completelyClosed) && <DynamicallyAttachedNode {...props} />,
        document.getElementById('root')!
    );
}

function stop(timeout: TimeoutWrapper) {
    if (timeout.timeout === undefined) return;
    else {
        clearTimeout(timeout.timeout);
        timeout.timeout = undefined;
    }
}

interface TimeoutWrapper {
    timeout?: ReturnType<typeof setTimeout>
}

function DynamicallyAttachedNode(props: ExpansionProps) {
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

    return <Fragment>
        <SizeCalculator depProps={props} finalProps={finalProps} setRect={setRect}/>
        <ClickAwayListener onClickAway={() => props.onDismiss()}>
            <div style={{zIndex: 2000}}>
                <GrowingAnimation duration={props.animationDurationMillis} show={show} finalProps={finalProps}/>
            </div>

        </ClickAwayListener>
    </Fragment>
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
    // console.log("Props: " + JSON.stringify(otherProps));
    return <Wrap {...otherProps} style={{...style, transform, transition: `transform ${duration}ms`, zIndex: 2000}}/>

}







