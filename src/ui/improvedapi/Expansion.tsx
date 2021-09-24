import {WithChild} from "./Element";
import React, {Fragment, useContext, useEffect, useMemo, useState} from "react";

type SetShow = (show: boolean) => void
type Callback = () => void

//TODO multiple (arraY) implementation with not-nullable stuff
class ExpansionInstance {
    static Context = React.createContext(new ExpansionInstance());

    //TODO: debug being called a billion times
    static App(props: WithChild) {
        console.log("App")
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const expansionInstance = useMemo(() => new ExpansionInstance(),[]);
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [showExpansion, setShowExpansion] = useState(false);
        expansionInstance._init(setShowExpansion);
        return <ExpansionInstance.Context.Provider value={expansionInstance}>
            {props.children}
            <ExpansionInstance._Expansion showExpansion={showExpansion} expansionInstance={expansionInstance}/>
        </ExpansionInstance.Context.Provider>
    }

    //TODO: clickoutsidehandler
    static _Expansion(props: { showExpansion: boolean, expansionInstance: ExpansionInstance }) {
        const element = props.expansionInstance._element;
        return <Fragment>
            {props.showExpansion && props.expansionInstance._element}
        </Fragment>
    }


    _element?: JSX.Element;
    _onDismiss?: Callback;
    // _show?: boolean
    _setShow!: SetShow;

    set(element: JSX.Element, onDismiss: Callback) {
        this._element = element;
        const wtf = this;
        const newEl = this._element;
        this._onDismiss = onDismiss;
        this._setShow(true);
    }

    _init(setShow: SetShow) {
        this._setShow = setShow;
    }

    hide() {
        this._setShow(false);
    }


}

class ExpansionState {
    isShowing: boolean;
    _setShow: SetShow

    constructor(show: boolean, setShow: SetShow) {
        this.isShowing = show;
        this._setShow = setShow;
    }


    /**
     * Make sure you call these via lambdas. Don't pass these methods as-is or it will crash.
     */

    show() {
        this._setShow(true);
    }

    hide() {
        this._setShow(false);
    }

    toggle() {
        this._setShow(!this.isShowing);
    }
}

//TODO: should just be an effect?
export function NewExpansion(props: { controller: ExpansionState, onDismiss: Callback } & WithChild) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const expansionHandler = useContext(ExpansionInstance.Context);
    const show = props.controller.isShowing;
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        if (show) {
            expansionHandler.set(props.children, props.onDismiss)
        } else {
            expansionHandler.hide();
        }
    }, [expansionHandler, props, show])

    return <Fragment/>
}


export function useExpansion(): ExpansionState {
    const [show, setShow] = React.useState(false);
    return new ExpansionState(show, setShow);
}


export function WithExpansions(props: WithChild) {
    console.log("WE")
    return <ExpansionInstance.App children={props.children}/>;
}