import {ThemeOptions} from "@mui/material";
import {grey} from "@mui/material/colors";
import {Gradient} from "../fudge-commons/simple/Color";

export const OnBackgroundColor = "#FFFFFF"
export const primaryColor = "#90caf9"
export const secondaryColor = "#65ff00"
export const crashyTitleColor: Gradient = {
    direction: "to bottom",
    firstColor: secondaryColor,
    midpointPercent: 60,
    secondColor: {color: "#463323", endPercent: 70}
}

export const clickableColor = "rgb(0, 173, 239)"
export const errorColor = "rgb(234,8,8)"
export const fadedOutColor = grey[600]
export const slightlyPronouncedColor = "#323232"
export const dialogBodyColor = "rgba(255, 255, 255, 0.7)"
export const AppbarColor = "#272727"
export const ActiveColor = "#374550"
export const NavigationDrawerColor = "#353535"

export const CrashyTheme: ThemeOptions = {
    palette: {
        mode: "dark",
        primary: {
            main: primaryColor
        },
        // type: 'dark',
        secondary: {
            main: secondaryColor,
        },
        text: {
            secondary: grey[600]
        },
        background: {
            // default: "#1d1515"
        },
        info: {
            main: OnBackgroundColor
        }
    },
}