import * as Mui from "@mui/material";
import React from "react";
import {deflattenStyle} from "./SimpleImpl";
import {ElementProps} from "./SimpleElementProps";

/**
 * These props can be potentially added:
 */
//export interface DividerTypeMap<P = {}, D extends React.ElementType = 'hr'> {
//   props: P & {
//     /**
//      * Absolutely position the element.
//      * @default false
//      */
//     absolute?: boolean;
//     /**
//      * The content of the component.
//      */
//     children?: React.ReactNode;
//     /**
//      * Override or extend the styles applied to the component.
//      */
//     classes?: Partial<DividerClasses>;
//     /**
//      * If `true`, a vertical divider will have the correct height when used in flex container.
//      * (By default, a vertical divider will have a calculated height of `0px` if it is the child of a flex container.)
//      * @default false
//      */
//     flexItem?: boolean;
//     /**
//      * If `true`, the divider will have a lighter color.
//      * @default false
//      */
//     light?: boolean;
//     /**
//      * The component orientation.
//      * @default 'horizontal'
//      */
//     orientation?: 'horizontal' | 'vertical';
//     /**
//      * The system prop that allows defining system overrides as well as additional CSS styles.
//      */
//     sx?: SxProps<Theme>;
//     /**
//      * The text alignment.
//      * @default 'center'
//      */
//     textAlign?: 'center' | 'right' | 'left';
//     /**
//      * The variant to use.
//      * @default 'fullWidth'
//      */
//     variant?: OverridableStringUnion<
//       'fullWidth' | 'inset' | 'middle',
//       DividerPropsVariantOverrides
//     >;
//   };
//   defaultComponent: D;
// }

/**
 * Simple Material-UI Divider <br>
 * {@link https://mui.com/components/dividers/}
 */
export function SimpleDivider(props: ElementProps) {
    return <Mui.Divider  {...deflattenStyle(props)}/>
}