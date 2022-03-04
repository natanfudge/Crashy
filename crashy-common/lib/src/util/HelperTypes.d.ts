export declare type Key = string | number | symbol;
export declare type Require<T, K extends keyof T> = Omit<T, K> & {
    [RequiredProperty in K]-?: T[RequiredProperty];
};
export declare type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;
export declare type Replace<T, K extends keyof T, New> = Omit<T, K> & {
    K: New;
};
export declare type TsObject = Record<string, unknown>;
