import {useState} from "react";
import {State, useStateObject} from "./State";

export class PersistentValue {
    private readonly key: string

    constructor(key: string) {
        this.key = key;
    }

    getValue(): string | null {
        return localStorage.getItem(this.key)
    }

    setValue(value: string) {
        localStorage.setItem(this.key, value)
    }
}

export function usePersistentState(key: string, defaultValue: string | (() => string)): State<string> {
    const persistent = new PersistentValue(key)
    const valueState = useStateObject(
        persistent.getValue() ?? (typeof defaultValue === "string" ? defaultValue : defaultValue())
    )

    return valueState.onSet(newValue =>  persistent.setValue(newValue))
}
