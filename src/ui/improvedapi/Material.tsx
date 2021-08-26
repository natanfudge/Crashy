import {deflattenStyle, ManyChildParentProps, SingleChildParentProps} from "./Element";
import {Paper} from "@material-ui/core";
import React from "react";

export const Surface = React.forwardRef((props: SingleChildParentProps, ref) => {
    // return React.forwardRef((_,ref) => {
    //     return <Paper ref={ref} {...deflattenStyle(props)}/>
    // })
    return <Paper ref={ref} {...deflattenStyle(props)}/>
});