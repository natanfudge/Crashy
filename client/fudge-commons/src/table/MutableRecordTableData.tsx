import {arrayToTableRecord, TableData, TableKey, TableRecord} from "./TableData";

export class MutableRecordTableData<T> implements TableData<T> {
    private readonly elements: TableRecord<T>
    readonly getId: (row: T) => TableKey;

    constructor(elements: T[], getId: (row: T) => TableKey) {
        this.elements = arrayToTableRecord(elements, getId);
        this.getId = getId;
    }

    delete(element: TableKey): void {
        delete this.elements[element]
    }

    getRows(): T[] {
        return Object.values(this.elements)
    }

    set(element: T): void {
        this.elements[this.getId(element)] = element;
    }
}