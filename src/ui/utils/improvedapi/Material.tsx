import { ClickCallback, deflattenStyle, ElementProps, ManyChildParentProps, SingleChildParentProps } from "./Element";
import { AppBar, Button, FormHelperTextProps, IconButton, InputBaseProps, InputLabelProps, Paper, SelectProps, TextField, TextFieldPropsSizeOverrides, Theme } from "@mui/material";
import React from "react";

export function Surface(props: SingleChildParentProps) {
    return <Paper {...deflattenStyle(props)} />
}

export interface CIconButtonProps extends SingleChildParentProps {
    // icon: JSX.Element
    onClick: ClickCallback
}

export function CIconButton(props: CIconButtonProps) {
    // const {icon, ...otherProps} = props
    return <IconButton {...deflattenStyle(props)} />
}

export interface CTextFieldProps extends ElementProps {
    /**
     * This prop helps users to fill forms faster, especially on mobile devices.
     * The name can be confusing, as it's more like an autofill.
     * You can learn more about it [following the specification](https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#autofill).
     */
    autoComplete?: string;
    /**
     * If `true`, the `input` element is focused during the first mount.
     * @default false
     */
    autoFocus?: boolean;
    /**
     * @ignore
     */
    children?: React.ReactNode;
    /**
     * The color of the component. It supports those theme colors that make sense for this component.
     * @default 'primary'
     */
    color?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning',
    /**
     * The default value. Use when the component is not controlled.
     */
    defaultValue?: unknown;
    /**
     * If `true`, the component is disabled.
     * @default false
     */
    disabled?: boolean;
    /**
     * If `true`, the label is displayed in an error state.
     * @default false
     */
    error?: boolean;
    /**
     * Props applied to the [`FormHelperText`](/api/form-helper-text/) element.
     */
    FormHelperTextProps?: Partial<FormHelperTextProps>;
    /**
     * If `true`, the input will take up the full width of its container.
     * @default false
     */
    fullWidth?: boolean;
    /**
     * The helper text content.
     */
    helperText?: React.ReactNode;
    /**
     * The id of the `input` element.
     * Use this prop to make `label` and `helperText` accessible for screen readers.
     */
    id?: string;
    /**
     * Props applied to the [`InputLabel`](/api/input-label/) element.
     */
    InputLabelProps?: Partial<InputLabelProps>;
    /**
     * [Attributes](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#Attributes) applied to the `input` element.
     */
    inputProps?: InputBaseProps['inputProps'];
    /**
     * Pass a ref to the `input` element.
     */
    inputRef?: React.Ref<any>;
    /**
     * The label content.
     */
    label?: React.ReactNode;
    /**
     * If `true`, a `textarea` element is rendered instead of an input.
     * @default false
     */
    multiline?: boolean;
    /**
     * Name attribute of the `input` element.
     */
    name?: string;
    onBlur?: InputBaseProps['onBlur'];
    //    onFocus?: StandardInputProps['onFocus'];
    /**
     * The short hint displayed in the `input` before the user enters a value.
     */
    placeholder?: string;
    /**
     * If `true`, the label is displayed as required and the `input` element is required.
     * @default false
     */
    required?: boolean;
    /**
     * Number of rows to display when multiline option is set to true.
     */
    rows?: string | number;
    /**
     * Maximum number of rows to display when multiline option is set to true.
     */
    maxRows?: string | number;
    /**
     * Minimum number of rows to display when multiline option is set to true.
     */
    minRows?: string | number;
    /**
     * Render a [`Select`](/api/select/) element while passing the Input element to `Select` as `input` parameter.
     * If this option is set you must pass the options of the select as children.
     * @default false
     */
    select?: boolean;
    /**
     * Props applied to the [`Select`](/api/select/) element.
     */
    SelectProps?: Partial<SelectProps>;
    /**
     * The size of the component.
     */
    size?: 'small' | 'medium';

    /**
     * Type of the `input` element. It should be [a valid HTML5 input type](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#Form_%3Cinput%3E_types).
     */
    type?: React.InputHTMLAttributes<unknown>['type'];
    /**
     * The value of the `input` element, required for a controlled component.
     */
    value?: unknown;
    onValueChanged: (value: string) => void;
    variant?: "outlined" | "filled" | "standard"
}

export function CTextField(props: CTextFieldProps) {
    const { onValueChanged, ...otherProps } = props;
    return <TextField
        onChange={e => onValueChanged(e.target.value)}
        {...deflattenStyle(otherProps)} />
}

export interface CButtonProps extends SingleChildParentProps {
    onClick: ClickCallback
    variant?: 'text' | 'outlined' | 'contained'
    disabled?: boolean

}

export function CButton(props: CButtonProps) {
    return <Button {...deflattenStyle(props)} />
}

export function CAppBar(props: ManyChildParentProps) {
    const { style, ...otherProps } = deflattenStyle(props);
    return <AppBar {...otherProps} style={{ display: "flex", flexDirection: "row", ...style }} />
}
