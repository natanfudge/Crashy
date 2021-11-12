import {SingleChildParentProps} from "../improvedapi/Element";
import React from "react";
import {_implExpansion} from "./Impl";
import {_implUseExpansion} from "./Util";
import {Alignment} from "../../../utils/Gui";

export function Expansion(props: ExpansionPropsApi) {
    return _implExpansion(props);
}

export type ExpansionPropsApi = ManualExpansionProps | ManagedExpansionProps

export interface ManualExpansionProps extends BaseExpansionPropsApi {
    show: boolean;
    anchor: Element | null;
}

export interface ManagedExpansionProps extends BaseExpansionPropsApi {
    state: ExpansionState
}

export interface BaseExpansionPropsApi extends SingleChildParentProps {
    onDismiss: OnDismiss
    anchorReference: Alignment
    position: Alignment;
    sticky?: boolean
    animationDurationMillis?: number
}

export type OnDismiss = () => void


export function useExpansion(): ExpansionState {
    return _implUseExpansion();
}

export interface ExpansionState {
    toString(): void;

    show(anchor: Anchor): void

    hide(): void

    toggle(anchor: Anchor): void

    currentAnchor: Anchor
    isShowing: boolean
}

export type Anchor = Element | null