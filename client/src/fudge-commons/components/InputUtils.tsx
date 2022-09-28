import React, {Fragment} from "react";
import {Autocomplete, Checkbox, TextField} from "@mui/material";
import {DatePicker, LocalizationProvider} from "@mui/lab";
import DateAdapter from "@mui/lab/AdapterDateFns";
import {Check, Close} from "@mui/icons-material";
import {DateValidation, Validation} from "../table/editable/Validation";
import {OnChange} from "../types/React";
import {DayDate} from "../collections/DayDate";

const MinTextFieldWidth = 200;
const fontSize = 10;

export function AdaptiveAutocompleteText(props: AutocompleteTextFieldProps & { editable: boolean }) {
    const {editable, ...textFieldProps} = props;
    if (editable) {
        return <AutocompleteTextField {...textFieldProps}/>
    } else {
        return <Fragment>
            {props.value}
        </Fragment>
    }
}


interface AutocompleteTextFieldProps {
    label: string,
    options: string[],
    onChange: (newValue: string) => void,
    value: string
}

export function AutocompleteTextField(props: AutocompleteTextFieldProps) {
    const [inputValue, setInputValue] = React.useState<string>("");

    return <Autocomplete
        autoComplete
        autoHighlight
        value={props.value}
        onChange={(e, newValue) => {
            if (newValue !== null) props.onChange(newValue)
        }}
        inputValue={inputValue}
        onInputChange={(event, newInputValue) => {
            setInputValue(newInputValue);
        }}
        renderInput={(params) =>
            <TextField

                sx={{width: Math.max(MinTextFieldWidth, fontSize * props.value.length + 80)}} variant={"outlined"}
                label={props.label}
                {...params}
            />
        }
        options={props.options}/>;
}

export function AdaptiveText(props: TextFieldProps & { editable: boolean }) {
    const {editable, ...textFieldProps} = props;
    if (editable) {
        return <NormalizedWidthTextField {...textFieldProps}/>
    } else {
        return <Fragment>
            {props.value}
        </Fragment>
    }
}

interface TextFieldProps {
    label: string,
    onChange: (newValue: string) => void,
    value: string
    validation: Validation<string> | undefined
}

export function NormalizedWidthTextField(props: TextFieldProps) {
    const isValid = props.validation === undefined || props.validation.isValid(props.value)
    return <TextField sx={{width: Math.max(MinTextFieldWidth, fontSize * props.value.length + 5)}}
                      value={props.value} onChange={e => props.onChange(e.target.value)}
                      label={props.label}
                      error={!isValid} helperText={isValid ? undefined : props.validation!.errorText}
    />
}


export function AdaptiveDateInput(props: DateProps & { editable: boolean, compact: boolean }) {
    if (props.editable) {
        const {editable, compact, ...dateProps} = props;
        return <DateInput {...dateProps}/>
    } else {
        const day = DayDate.fromDate(props.value)
        return <Fragment>
            {props.compact ? day.toDayMonth() : day.toString()}
        </Fragment>
    }
}

export interface DateProps {
    value: Date;
    onChange: (newDay: Date) => void
    validation: DateValidation | undefined
}

export function DateInput(props: DateProps) {
    // isNewRow/row doesn't matter in validation here
    const valid = props.validation === undefined || props.validation.isValid(props.value);
    return (
        <LocalizationProvider dateAdapter={DateAdapter}>
            <DatePicker
                label="תאריך"
                inputFormat="dd/MM/yyyy"
                value={props.value}
                onChange={(d: Date | null) => {
                    if (d !== null) props.onChange(d)
                }}
                maxDate={props.validation?.maxDate}
                minDate={props.validation?.minDate}
                // @ts-ignore
                renderInput={(params) => <TextField helperText={valid ? undefined : props.validation!.errorText}
                                                    sx={{width: "150px"}} {...params} />}
            />
        </LocalizationProvider>
    );
}

export function AdaptiveCheck(props: { value: boolean, onChange: OnChange<boolean>, editable: boolean }) {
    if (props.editable) {
        return <Checkbox checked={props.value}
                         onChange={e => props.onChange(e.target.checked)}/>
    } else {
        return props.value ? <Check/> : <Close/>
    }
}