import {styled, TableCell, TableRow} from "@mui/material";

export const AlternatingColorTableRow = styled(TableRow)(({theme}) => ({
    // Remove border at the end
    "&:last-child td, &:last-child th": {border: 0},
    // Add alternating color
    "&:nth-of-type(odd)": {backgroundColor: theme.palette.action.hover}
}))
export const DataCell = styled(TableCell)({
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center"
})
export const HeaderCell = styled(DataCell)(({theme}) => ({
    fontWeight: "bold",
    color: theme.palette.primary.contrastText
}))