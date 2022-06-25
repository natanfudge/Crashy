import {Dispatch, SetStateAction, useState} from "react";

export type OnChange<T> = (newValue: T) => void
export type SetState<T> = Dispatch<SetStateAction<T>>

export class State<T> {
    set: SetState<T>
    value: T

    constructor(value: T, set: SetState<T>) {
        this.set = set;
        this.value = value;
    }
}

export function useObjState<T>(initialValue: T) : State<T> {
    const [value,setValue] = useState(initialValue);
    return new State<T>(value,setValue)
}