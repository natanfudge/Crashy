import {useEffect, useState} from "react";

export function PromiseBuilder<T>({
                                      promise,
                                      whenLoading,
                                      whenDone
                                  }: { promise: Promise<NonNullable<T>>, whenLoading: JSX.Element, whenDone: (result: T) => JSX.Element }): JSX.Element {
    const [result, setResult] = useState<T | undefined>(undefined)
    useEffect(() => void promise.then(setResult), [])
    if (result === undefined) {
        return whenLoading
    } else {
        return whenDone(result)
    }
}