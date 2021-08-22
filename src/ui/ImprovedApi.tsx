import React from "react";
import {MenuItem, Paper, PropTypes, Typography} from "@material-ui/core";
import {Variant as ThemeVariant} from "@material-ui/core/styles/createTypography";
import {deflattenStyle, ParentProps} from "./improvedapi/Element";


// export function Center(props: ParentComponentProps) {
//     const {children, style, ...otherProps} = props;
//     return <div style={{display: "flex", justifyContent: "center", ...style}} {...otherProps}>
//         {children}
//     </div>
// }


type Variant = ThemeVariant | 'srOnly';

export interface TextThemeProps extends ParentProps {
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
    return <Typography {...deflattenStyle(props)}/>
}

export interface TextProps extends Omit<TextThemeProps, 'children'> {
    text: string
}

export function Text(props: TextProps) {
    const {text, ...otherProps} = props;
    return <TextTheme {...otherProps}>{text}</TextTheme>
}


type Require<T, K extends keyof T> = T & Required<Pick<T, K>>;

export function CButton(props: Require<ParentProps, 'onClick'>) {
    const {children, style: {padding, ...paperStyles} = {}, ...paperProps} = props

    const button = <Paper style={paperStyles} {...paperProps}>
        <MenuItem style={{padding: padding}}>
            {children}
        </MenuItem>
    </Paper>

    const anchorRef = React.useRef<HTMLDivElement>(null);
    // if (props.popper === undefined) {
    return button
    // } else {
    //     return <div>
    //         <div ref={anchorRef}>
    //             {button}
    //         </div>
    //         {React.cloneElement(props.popper, {anchorEl: anchorRef.current})}
    //     </div>
    // }
}