export type TsKey = string | number | symbol
export type Require<T, K extends keyof T> = Omit<T, K> & {
    [RequiredProperty in K]-?: T[RequiredProperty]
}
export type FuckYouIncremental = number;
export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>
export type Replace<T,K extends keyof T, New> = Omit<T,K> & {K: New}
export type TsObject = Record<string,unknown>
