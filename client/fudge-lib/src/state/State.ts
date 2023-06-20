import {Dispatch, SetStateAction, useState} from "react";



export type State<T> = [T, Dispatch<SetStateAction<T>>]

export function listenToStateChange<T>([value, setValue]: State<T>, callback: (value: T) => void): State<T> {
    return mapState([value,setValue], value, (newValue) => {
        callback(newValue)
        return newValue
    })
}

export function mapState<T>([value, setValue]: State<T>,valueMap: T, setStateMap: (value: T) => T): State<T> {
    return [valueMap, (newValue) => {
        if (typeof newValue === "function") {
            const newValueHandler = newValue as ((value: T) => T)
            setValue((prevState) => {
                const updatedValue = newValueHandler(prevState);
                return setStateMap(updatedValue);
            });
        } else {
            setValue(setStateMap(newValue))
        }
    }]
}