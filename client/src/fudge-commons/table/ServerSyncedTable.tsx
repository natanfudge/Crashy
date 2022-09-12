import {arrayToTableRecord, TableData, TableKey, TableRecord} from "./TableData";
import {useState} from "react";

export function useServerSyncedTable<T>(service: TableData<T>): ServerSyncedTable<T> {
    const [memoryList, setMemoryList] = useState(() => serviceToRecord(service));
    return new ServerSyncedTable<T>(service, memoryList, setMemoryList);
}

 class ServerSyncedTable<T> implements TableData<T> {
    private readonly memoryRecord: TableRecord<T>;
    private readonly setMemoryRecord: (setter: (old: TableRecord<T>) => TableRecord<T>) => void
    private readonly service: TableData<T>

    constructor(service: TableData<T>, memoryList: TableRecord<T>,
                setMemoryList: (setter: (old: TableRecord<T>) => TableRecord<T>) => void) {
        this.memoryRecord = memoryList;
        this.setMemoryRecord = setMemoryList;
        this.service = service;
    }

    delete(element: TableKey): void {
        this.setMemoryRecord(old => {
            const {[element]: omit, ...withoutElement} = old;
            return withoutElement;
        })
        this.service.delete(element)
    }

    getId(row: T): TableKey {
        return this.service.getId(row);
    }

    getRows(): T[] {
        return Object.values(this.memoryRecord)
    }

    set(element: T): void {
        this.setMemoryRecord(old => ({...old, [this.getId(element)]: element}))
        this.service.set(element)
    }
}

function serviceToRecord<T>(service: TableData<T>): TableRecord<T> {
    return arrayToTableRecord(service.getRows(), service.getId)
}

