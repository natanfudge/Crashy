import React, {CSSProperties, MouseEventHandler} from "react";
import {MenuItem, Paper, PropTypes, Typography} from "@material-ui/core";
import {Variant as ThemeVariant} from "@material-ui/core/styles/createTypography";

export interface ComponentProps {
    style?: CSSProperties
    onClick?: MouseEventHandler<HTMLDivElement>
    //TODO: currently only works for CButton
    popper?: React.ReactElement<any, any>
    // reference?: React.Ref<HTMLDivElement>
}

export interface ParentComponentProps extends ComponentProps {
    children: React.ReactNode
}

export function Center(props: ParentComponentProps) {
    return <div style={{display: "flex", justifyContent: "center"}}>
        {props.children}
    </div>
}

type Variant = ThemeVariant | 'srOnly';

export interface TextThemeProps extends ComponentProps, ParentComponentProps {
    align?: PropTypes.Alignment;
    color?:
        | 'initial'
        | 'inherit'
        | 'primary'
        | 'secondary'
        | 'textPrimary'
        | 'textSecondary'
        | 'error';
    display?: 'initial' | 'block' | 'inline';
    gutterBottom?: boolean;
    noWrap?: boolean;
    paragraph?: boolean;
    variant?: Variant | 'inherit';
    variantMapping?: Partial<Record<Variant, string>>;
}

export function TextTheme(props: TextThemeProps) {
    // const typographyProps
    return <Typography {...props}/>
}

export interface TextProps extends Omit<TextThemeProps, 'children'> {
    text: String
}

export function Text(props: TextProps) {
    return <TextTheme {...props}>
        {props.text}
    </TextTheme>
}

export function Column(props: ParentComponentProps) {
    return <div {...props}/>
}

type Require<T, K extends keyof T> = T & Required<Pick<T, K>>;

export function CButton(props: Require<ParentComponentProps, 'onClick'>) {
    const {children, style: {padding, ...paperStyles} = {}, ...paperProps} = props

    const button = <Paper style={paperStyles} {...paperProps}>
        <MenuItem style = {{padding: padding}}>
            {children}
        </MenuItem>
    </Paper>

    const anchorRef = React.useRef<HTMLDivElement>(null);
    if (props.popper === undefined) {
        return button
    } else {
        return <div>
            <div ref={anchorRef}>
                {button}
            </div>
            {React.cloneElement(props.popper, {anchorEl: anchorRef.current})}
        </div>
    }
}