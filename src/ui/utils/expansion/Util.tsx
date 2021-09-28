import React from "react";
import {Anchor, ExpansionState} from "./Api";

export function _implUseExpansion(): ExpansionState {
    const anchorElement = React.useMemo<AnchorWrapper>(() => ({anchor: null}), []);
    const [show, setShow] = React.useState<boolean>(false);
    return new ExpansionStateImpl(show, setShow, anchorElement.anchor, anchor => {
            anchorElement.anchor = anchor
        }
    );
}


interface AnchorWrapper {
    anchor: Anchor
}

class ExpansionStateImpl implements ExpansionState {

    readonly isShowing: boolean;
    readonly currentAnchor: Anchor

    private readonly setAnchor: (anchor: Anchor) => void
    private readonly setShow: (show: boolean) => void

    constructor(show: boolean, setShow: (show: boolean) => void, anchor: Anchor, setAnchor: (anchor: Anchor) => void) {
        this.isShowing = show;
        this.setShow = setShow;
        this.currentAnchor = anchor;
        this.setAnchor = setAnchor;
    }

    toString() {
        return `{state: ${this.isShowing}, anchor: ${JSON.stringify(this.currentAnchor?.getBoundingClientRect()) ?? "null"}}`
    }


    /**
     * Make sure you call these via lambdas. Don't pass these methods as-is or it will crash.
     */

    show(anchor: Anchor) {
        this.setAnchor(anchor);
        this.setShow(true);
    }

    hide() {
        this.setShow(false);
    }

    toggle(anchor: Anchor) {
        this.isShowing ? this.hide() : this.show(anchor);
    }
}