import {deflattenStyle, ParentProps} from "./Element";
import {Paper} from "@material-ui/core";

export function Surface(props: ParentProps) {
    return <Paper {...deflattenStyle(props)}/>
}