import {EditableTableProps, RowObj} from "./EditableTable";
import {getValidation} from "./Validation";
import {EditedRow, editedRowIsNew, isOldRow} from "./Utility";
import {State} from "../../types/React";
import {recordSome} from "../../methods/Javascript";

export function addNewRow<T extends RowObj>(editedRow: State<EditedRow<T>>, props: EditableTableProps<T>) {
    // First save the currently edited row
    const newRowAdded = saveRowIfNeeded(editedRow.value, props)
    // Then add a new row and start editing it
    const newRow = props.initialValue

    // New row index: row amount
    const oldRowAmountNotIncludingNew = props.rows.length;
    const actualOldRowAmount = newRowAdded ? oldRowAmountNotIncludingNew + 1 : oldRowAmountNotIncludingNew;

    editedRow.set({index: actualOldRowAmount, content: newRow, origValue: undefined})
}

/**
 * Returns true if a new row was added
 */
export function saveRowIfNeeded<T extends RowObj>(row: EditedRow<T>, props: EditableTableProps<T>): boolean {
    if (row !== undefined) {

        // If row is not valid - don't save.
        if (recordSome(props.columns, (key, metadata) => {
            const validation = getValidation(metadata, editedRowIsNew(row), row.content, row.origValue?.[key])
            return validation !== undefined && !validation.isValid(row.content[key])
        })) {
            return false;
        }

        if (isOldRow(row)) {
            // When we 'set' an existing row, it will be put into the table using the ID depending on the new value.
            // So to to keep around the old value in the table we delete it using the original ID.
            props.rowMutator.delete(props.rowMutator.getId(row.origValue))
        }
        props.rowMutator.set(row.content)
        return editedRowIsNew(row)
    }
    return false;
}
