import {TsKey} from "../types/Basic";

export interface TableMutations<Row> {
    getId(row: Row): TableKey

    set(element: Row): void

    delete(key: TsKey): void
}

export interface TableData<Row> extends TableMutations<Row> {
    getRows(): Row[]
}

export type TableKey = string | number;
export type TableRecord<T> = Record<TableKey, T>

export function arrayToTableRecord<T>(array: T[], getId: (row: T) => TsKey): TableRecord<T> {
    return array.toRecord(r => [getId(r), r])
}