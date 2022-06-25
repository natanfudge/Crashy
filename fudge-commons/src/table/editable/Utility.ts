import {ColumnMetadata, ComplexColumn, OptionColumn, RowObj} from "./EditableTable";
import {TableKey} from "../TableData";

export type EditedRow<T> = undefined | ExistingEditedRow<T>

export type ExistingEditedRow<T> = {
    content: T
    index: number
    /**
     * Value of row before it was edited
     * Undefined - this is a new row
     */
    origValue: T | undefined
}

export function getLabel<T extends RowObj, C>(metadata: ColumnMetadata<T, C>): string {
    return isComplexColumn(metadata) ? metadata.label : metadata;
}

export function isComplexColumn<T extends RowObj, C>(metadata: ColumnMetadata<T, C>): metadata is ComplexColumn<T, C> {
    return typeof metadata !== "string";
}

export function isOptionColumn<T extends RowObj, C>(metadata: ColumnMetadata<T, C>): metadata is OptionColumn<T, C> {
    return isComplexColumn(metadata) && metadata.options !== undefined;
}

export function columnIsShown<T extends RowObj, C>(metadata: ColumnMetadata<T, C>, anyRowIsBeingEdited: boolean): boolean {
    return !isComplexColumn(metadata) || metadata.show === undefined || metadata.show(anyRowIsBeingEdited);
}

export function isOldRow<T>(row: EditedRow<T>): row is Omit<ExistingEditedRow<T>, "origValue"> & { origValue: T } {
    return row === undefined || row.origValue !== undefined;
}

export function editedRowIsNew<T>(row: EditedRow<T>): boolean {
    return row !== undefined && row.origValue === undefined;
}

export function isNewRow<T>(row: T, editedRow: EditedRow<T>): boolean {
    return editedRowIsNew(editedRow) && editedRow?.content === row;
}

export function tableKeyCompare(key1: TableKey, key2: TableKey): number {
    if (typeof key1 === "number") {
        if (typeof key2 === "number") {
            // Number vs number
            return key1 - key2;
        } else {
            // Number vs string: number comes before
            return -1;
        }
    } else {
        if (typeof key2 === "number") {
            // String vs number: number comes before
            return 1;
        } else {
            // String vs string
            return key1.localeCompare(key2)
        }
    }
}