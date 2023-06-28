import {useState} from "react";
import {State, useStateObject} from "./State";

export class PersistentValue<T extends string> {
    private readonly key: string

    constructor(key: string) {
        this.key = key;
    }

    getValue(): T | null {
        return localStorage.getItem(this.key) as T
    }

    setValue(value: T) {
        localStorage.setItem(this.key, value)
    }
}

export function usePersistentState<T extends string = string>(key: string, defaultValue: T | (() => T)): State<T> {
    const persistent = new PersistentValue<T>(key)
    const valueState = useStateObject<T>(
        persistent.getValue() ?? (typeof defaultValue === "string" ? defaultValue : defaultValue())
    )

    return valueState.onSet(newValue =>  persistent.setValue(newValue))
}
