import {useEffect, useState} from "react";

export function PromiseBuilder<T>({
                                      promise,
                                      whenLoading,
                                      whenDone,
    deps
                                  }: { promise: Promise<NonNullable<T>>, whenLoading: JSX.Element, whenDone: (result: T) => JSX.Element, deps: any[] }): JSX.Element {
    const [result, setResult] = useState<T | undefined>(undefined)
    useEffect(() => void promise.then(setResult), [deps])
    if (result === undefined) {
        return whenLoading
    } else {
        return whenDone(result)
    }
}

export function usePromise<T>(promise: Promise<NonNullable<T>>, deps: any[]): T | undefined {
    const [result, setResult] = useState<T | undefined>(undefined)
    useEffect(() => void promise.then(setResult), deps)
    return result
}