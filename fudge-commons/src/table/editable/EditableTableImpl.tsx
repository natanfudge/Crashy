import {ColumnMetadata, Columns, EditableTableProps, RowObj} from "./EditableTable";
import {DateValidation, getValidation, Validation} from "./Validation";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    TableRow
} from "@mui/material";
import {Delete, Edit, Save} from "@mui/icons-material";
import {useScreenSize} from "../../methods/Gui";
import {Fragment} from "react";
import {mapRecord} from "../../methods/Javascript";
import {AlternatingColorTableRow, DataCell, HeaderCell} from "./StyledComponents";
import {columnIsShown, EditedRow, getLabel, isNewRow, isOldRow, isOptionColumn} from "./Utility";
import {saveRowIfNeeded} from "./CRUD";
import {recordAll, recordFilter, recordToArray} from "../../methods/Javascript";
import {OnChange, State, useObjState} from "../../types/React";
import {AdaptiveAutocompleteText, AdaptiveCheck, AdaptiveDateInput, AdaptiveText} from "../../components/InputUtils";


export function EditableRowBody<T extends RowObj>(props: EditableTableProps<T> & { editedRow: State<EditedRow<T>> }) {
    const screen = useScreenSize();
    const rowsWithoutNew = props.rows;
    const editedRow = props.editedRow.value

    const rows: T[] = isOldRow(editedRow) ? rowsWithoutNew : [...rowsWithoutNew, editedRow!.content];
    const onClickEdit = (nowEditable: boolean, i: number) => {
        // Save the previously edited row if there is one.
        saveRowIfNeeded(editedRow, props)
        if (!nowEditable) {
            props.editedRow.set(undefined)
        } else {
            props.editedRow.set({content: rows[i], index: i, origValue: rows[i]})
        }
    };


    const dialogOpen = useObjState(false)

    function rowProps(index: number): TableRowProps<T> {
        return {
            row: rows[index],
            columns: props.columns,
            onEditableChange: (newEditable) => onClickEdit(newEditable, index),
            onClickDelete: () => {
                dialogOpen.set(true)
            },
            editable: editedRow !== undefined && editedRow.index === index,
            editedRow: props.editedRow
        }
    }

    const compactMode = editedRow !== undefined && screen.isPhone

    return <Fragment>
        {compactMode ? <EditableTableRow {...rowProps(editedRow!.index)}/> :
            rows.map((row, i) => <EditableTableRow key={i} {...rowProps(i)}/>)}
        <ConfirmDeleteDialog open={dialogOpen} onConfirm={() => {
            props.editedRow.set(undefined)

            // No need to delete anything if it's a new row since it hasn't been added to the rowMutator yet
            if (isOldRow(editedRow)) {
                // Deletion is only available when editing
                props.rowMutator.delete(props.rowMutator.getId(editedRow!.origValue));
            }
        }}/>
    </Fragment>
}


function ConfirmDeleteDialog(props: { open: State<boolean>, onConfirm: () => void }) {
    const close = () => {
        props.open.set(false)
    }

    return <Dialog
        open={props.open.value}
        onClose={close}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dvialog-description"
    >
        {/*to do: implement localization for this if needed*/}
        <DialogTitle id="alert-dialog-title">
            {"מחק שורה?"}
        </DialogTitle>
        <DialogContent>
            <DialogContentText id="alert-dialog-description">
                אי אפשר לבטל את הפעולה הזאת.
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button sx={{color: "error.main"}} onClick={() => {
                close()
                props.onConfirm()
            }}>מחק</Button>
            <Button onClick={close} autoFocus>
                חזור
            </Button>
        </DialogActions>
    </Dialog>
}

interface TableRowProps<T extends RowObj> {
    row: T
    columns: Columns<T>
    editable: boolean
    onEditableChange: OnChange<boolean>,
    onClickDelete: () => void
    editedRow: State<EditedRow<T>>
}

function EditableTableRow<T extends RowObj>(props: TableRowProps<T>) {
    const screen = useScreenSize();
    const portraitEditLayout = props.editable && screen.isPhone;
    return portraitEditLayout ? <TwoColumnLayout {...props}/> : <SingleRowLayout  {...props}/>
}


function SingleRowLayout<T extends RowObj>(props: TableRowProps<T>) {
    const shownColumns = recordFilter(props.columns, (k, v) =>
        columnIsShown(v, props.editedRow.value !== undefined))

    return <AlternatingColorTableRow>
        <EditButton canSave={canSave(props)} onClickDelete={props.onClickDelete}
                    onClickEdit={() => props.onEditableChange(!props.editable)}
                    editable={props.editable}
                    doubleWidth={false}/>
        {recordToArray(shownColumns, (key, metadata) => {
            return <EditableDataCell key={key} {...props} columnKey={key} columnData={metadata}/>
        })}
    </AlternatingColorTableRow>;
}

function TwoColumnLayout<T extends RowObj>(props: TableRowProps<T>) {
    const shownColumns = recordFilter(props.columns, (k, v) =>
        columnIsShown(v, props.editedRow.value !== undefined))
    return <Fragment>
        <TableRow>
            <EditButton canSave={canSave(props)} onClickDelete={props.onClickDelete}
                        onClickEdit={() => props.onEditableChange(!props.editable)}
                        editable={props.editable} doubleWidth={true}/>
        </TableRow>
        {recordToArray(shownColumns, (key, metadata) => {
            return <TableRow key={key}>
                <HeaderCell sx={{color: "text.primary"}}>
                    {getLabel(metadata)}
                </HeaderCell>
                <EditableDataCell key={key} {...props} columnKey={key} columnData={metadata}/>
            </TableRow>
        })}
    </Fragment>
}

function canSave<T extends RowObj>(props: TableRowProps<T>): boolean {
    const editedRow = props.editedRow.value;
    // Only relevant when editing
    if (editedRow === undefined) return true;
    return recordAll(props.columns, (columnKey, metadata) => {
        const validator = getValidation(metadata, isNewRow(props.row, editedRow), editedRow.content, editedRow?.origValue?.[columnKey])
        if (validator === undefined) return true;
        return validator.isValid(editedRow.content[columnKey])
    })
}

function EditButton(props: { onClickEdit: () => void, onClickDelete: () => void, editable: boolean, doubleWidth: boolean, canSave: boolean }) {
    return <DataCell colSpan={props.doubleWidth ? 2 : 1} sx={{backgroundColor: "background.default", border: 0}}>
        {props.editable && <IconButton onClick={props.onClickDelete} sx={{}}>
            <Delete color={"error"} sx={{display: "block"}}/>
        </IconButton>}
        <IconButton disabled={props.editable && !props.canSave} onClick={props.onClickEdit} sx={{
            padding: props.editable ? "inherit" : 0
        }}>
            {props.editable ? <Save color={props.canSave ? "success": "disabled"} sx={{display: "block"}}/> : <Edit sx={{display: "block"}}/>}
        </IconButton>

    </DataCell>;
}

interface TableCellProps<T extends RowObj, C extends keyof T> extends TableRowProps<T> {
    columnKey: C
    columnData: ColumnMetadata<T, T[C]>
}

function EditableDataCell<T extends RowObj, C extends keyof Columns<T>>(props: TableCellProps<T, C>) {
    return <DataCell>
        <EditableTableCellImpl
            editedRow={props.editedRow.value}
            onValueChange={newValue => {
                // If value is changing this is the edited row, and it's not undefined
                const oldValue = props.editedRow.value!
                props.editedRow.set({
                    index: oldValue.index,
                    content: withNewValue(oldValue.content, newValue, props.columnKey, props.columns),
                    origValue: oldValue.origValue
                });
            }}
            columnKey={props.columnKey} columnData={props.columnData}
            // Edited - use the dynamic value, not edited, use the static value
            row={props.editable ? props.editedRow.value!.content : props.row}
            editable={props.editable}/>
    </DataCell>;
}

function withNewValue<T extends RowObj, K extends keyof Columns<T>>
(oldTableState: T, newValue: T[K], changedColumnKey: K, columns: Columns<T>): T {
    const newState: T = ({...oldTableState, [changedColumnKey]: newValue})
    // Make sure the new state doesn't result in a value existing that is not one of the available options.
    // NOTE: this only works for ONE level of dependency. e.g. if one field depends on another.
    // it doesn't work well when one field depends on another which again depends on another (two levels of dependency).
    //K extends TsKey, V, NK extends TsKey, NV
    return mapRecord(newState, k => k,
        (newStateKey: K, newStateValue: T[K]) => {
            const columnMetadata = columns[newStateKey]
            if (isOptionColumn(columnMetadata) && typeof newStateValue === "string") {
                const options = columnMetadata.options(newState);
                if (options !== undefined && !options.includes(newStateValue)) {
                    // If the current value is not in the available option, use the default (first) options
                    return options[0];
                }
            }
            return newStateValue;
        }) as T;
}

function EditableTableCellImpl<T extends RowObj, K extends keyof T>(
    props: {
        columnKey: K, columnData: ColumnMetadata<T, T[K]>, row: T, editable: boolean,
        onValueChange: OnChange<T[K]>, editedRow: EditedRow<T> | undefined
    }
) {
    const cellValue = props.row[props.columnKey];
    const change = props.onValueChange;
    const editable = props.editable;
    const screen = useScreenSize();
    const validation = getValidation(props.columnData, isNewRow(props.row, props.editedRow), props.row, props.editedRow?.origValue?.[props.columnKey]);

    switch (typeof cellValue) {
        case "boolean":
            return <AdaptiveCheck value={cellValue} onChange={change as unknown as OnChange<boolean>}
                                  editable={editable}/>
        case "string":
            if (isOptionColumn(props.columnData)) {
                return <AdaptiveAutocompleteText label={props.columnData.label}
                                                 options={props.columnData.options(props.row)}
                                                 onChange={change as unknown as OnChange<string>} value={cellValue}
                                                 editable={editable}/>

            } else {
                return <AdaptiveText
                    validation={validation as unknown as Validation<string>}
                    label={getLabel(props.columnData)}
                    onChange={change as unknown as OnChange<string>}
                    value={cellValue}
                    editable={editable}/>
            }
        case "object":
            if (cellValue instanceof Date) {
                return <AdaptiveDateInput
                    validation={validation as unknown as DateValidation}
                    compact={screen.isPhone} value={cellValue}
                    onChange={change as unknown as OnChange<Date>}
                    editable={editable}/>
            } else {
                throw new Error(`Cell rendering for value ${cellValue} is not implemented`)
            }
        default:
            throw new Error(`Cell rendering for value ${cellValue} is not implemented`)
    }
}


