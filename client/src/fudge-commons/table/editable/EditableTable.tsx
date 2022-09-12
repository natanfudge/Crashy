import {IconButton, Paper, Table, TableBody, TableContainer, TableHead, TableRow} from "@mui/material";
import {Add} from "@mui/icons-material";
import {useScreenSize} from "../../methods/Gui";
import {Require} from "../../types/Basic";
import {Column} from "../../simple/Flex";
import {TableMutations} from "../TableData";
import {DateValidation, TableValidation} from "./Validation";
import {EditableRowBody} from "./EditableTableImpl";
import {columnIsShown, EditedRow, getLabel, tableKeyCompare} from "./Utility";
import {HeaderCell} from "./StyledComponents";
import {addNewRow} from "./CRUD";
import {recordFilter, recordToArray} from "../../methods/Javascript";
import {useObjState} from "../../types/React";

export type RowObj = object

export interface EditableTableProps<T extends RowObj> {
    columns: Columns<T>
    rows: T[],
    /**
     * Id is used for default ordering of rows
     */
    rowMutator: TableMutations<T>
    initialValue: T
}

export type Columns<T extends RowObj> = Record<keyof T, ColumnMetadata<T, any>>

// String: all options are applicable (TextField)
// OptionColumn: some options are applicable (AutocompleteTextField)
export type ColumnMetadata<T extends RowObj, C> = string | ComplexColumn<T, C>

export interface ComplexColumn<T extends RowObj, C> {
    label: string
    /**
     * There should only be one layer of dependency between columns, i.e. column1's options may depend on column2's,
     * but making column3 further depend on column2 is two layers of dependency and is not allowed.
     * column3 depending on column4 for example in that case would be ok (because column4 doesn't depend on anything)
     */
    options?: (currentValue: T) => string[]
    show?: (isEditing: boolean) => boolean;
    /**
     * When validating dates, ONLY use DateValidation!
     */
    validator?: C extends Date ? DateValidation : TableValidation<C, T>
}

export type OptionColumn<T extends RowObj, C> = Require<ComplexColumn<T, C>, "options">


/**
 * <T> must not have nullable fields
 * Users of this table MUST validate that two rows don't have the same ID!!! - Use ComplexColumn#validator
 */
export function EditableTable<T extends RowObj>(props: EditableTableProps<T>) {
    const editedRow = useObjState<EditedRow<T>>(undefined);

    const isEditing = editedRow.value !== undefined;
    const screen = useScreenSize();
    const portraitEditLayout = isEditing && screen.isPhone;

    const shownColumns = recordFilter(props.columns, (k, v) =>
        columnIsShown(v, isEditing))

    const sortedRows = props.rows.sort(
        (r1, r2) => tableKeyCompare(props.rowMutator.getId(r1), props.rowMutator.getId(r2))
    )

    const sortedProps = {
        ...props,
        rows: sortedRows
    }

    return <Column>
        <TableContainer component={Paper} sx={{width: "fit-content", alignSelf: "center"}}>
            <Table>
                {/*The headers are displayed differently in portraitEditLayout*/}
                {!portraitEditLayout && <TableHead>
                    <TableRow sx={{backgroundColor: "primary.main"}}>
                        <HeaderCell sx={{backgroundColor: "background.default", border: 0}}/>
                        {recordToArray(shownColumns, (key, label) => <HeaderCell key={key}>
                            {getLabel(label)}
                        </HeaderCell>)}
                    </TableRow>
                </TableHead>}
                <TableBody>
                    <EditableRowBody {...sortedProps} editedRow={editedRow}/>
                </TableBody>
            </Table>
        </TableContainer>
        {!portraitEditLayout && <AddRowButton onAdd={() => {
            addNewRow(editedRow, sortedProps);
        }}/>}
    </Column>
}

export function AddRowButton(props: { onAdd: () => void }) {
    return <IconButton sx={{
        marginTop: 1,
        width: "fit-content",
        alignSelf: "center",
        bgcolor: "primary.main",
        color: "primary.contrastText"
    }} onClick={props.onAdd}>
        <Add/>
    </IconButton>
}