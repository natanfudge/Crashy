import {useEffect, useState} from "react";



export function usePromise<T>(promise: Promise<NonNullable<T>> | T, deps: unknown[]): T | undefined {
    const [result, setResult] = useState<T | undefined>(undefined)
    useEffect(() => {
        setResult(undefined);
        void Promise.resolve(promise).then(setResult)
    }, deps)
    return result
}
