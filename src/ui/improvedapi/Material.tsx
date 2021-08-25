import {deflattenStyle, ManyChildParentProps, SingleChildParentProps} from "./Element";
import {Paper} from "@material-ui/core";

export function Surface(props: SingleChildParentProps) {
    return <Paper {...deflattenStyle(props)}/>
}