import {Gradient} from "./improvedapi/Text";
import {ThemeOptions} from "@mui/material";
import {grey, red} from "@mui/material/colors";

export const primaryColor = "#90caf9"
export const crashyTitleColor : Gradient = {
    direction: "to bottom",
    firstColor: "#65ff00",
    midpointPercent: 60,
    secondColor: {color: "#463323", endPercent: 70}
}

export const clickableColor = "rgb(0, 173, 239)"
export const errorColor = "rgb(234,8,8)"
export const fadedOutColor = grey[600]
export const slightlyPronouncedColor = "#323232"

export const CrashyTheme : ThemeOptions = {
    palette: {
        mode: "dark",
        primary: {
            main: primaryColor
        },
        // type: 'dark',
        secondary: {
            main: red[500],
        },
        text: {
            secondary: grey[600]
        },
        background: {
            // default: "#1d1515"
        }
    },
}