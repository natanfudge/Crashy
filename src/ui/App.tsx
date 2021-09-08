import React, {useEffect, useState} from 'react';
import '../App.css';

import {CrashReportUi} from "./CrashReportUi";
import {Text} from "./improvedapi/Text";
import {parseCrashReportRich} from "../model/CrashReportEnricher";
import {Column, Row} from "./improvedapi/Flex";
import {CDivider, Wrap} from "./improvedapi/Core";
import {grey, red} from "@mui/material/colors";
import {Button, createTheme, CssBaseline, TextField, Typography} from "@mui/material";
import {CloudUpload} from "@mui/icons-material";
import {ThemeProvider} from '@mui/material/styles';
import {Surface} from "./improvedapi/Material";


//TODO: track when the app crashes for users
export const clickableColor = "rgb(0, 173, 239)"
export const errorColor = "rgb(234,8,8)"
export const fadedOutColor = grey[600]
export const slightlyPronouncedColor = "#323232"

interface GetResponse {
    body: string
    code: number
}

function httpGetCallback(url: string, onDone: (response: GetResponse) => void) {
    const xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState === 4) {
            onDone({body: xmlHttp.responseText, code: xmlHttp.status});
        }
    }
    xmlHttp.open("GET", url, true); // true for asynchronous
    xmlHttp.send(null);
}

async function httpGet(url: string): Promise<GetResponse> {
    return new Promise(resolve => httpGetCallback(url, (response) => resolve(response)));
}

type CrashLogResponse = string | GetCrashError

enum GetCrashError {
    NoSuchCrashId
}

const localTesting = false;

async function getCrash(id: string): Promise<CrashLogResponse> {
    const domain = localTesting ? "localhost:5001/crashy-9dd87/europe-west1" : "europe-west1-crashy-9dd87.cloudfunctions.net";
    const response = await httpGet(`https://${domain}/getCrash/${id}`);
    if (response.code === 200) {
        return response.body;
    } else if (response.code === 404) {
        return GetCrashError.NoSuchCrashId
    } else {
        throw new Error("Unexpected status code: " + response.code)
    }
}

function CrashyHome() {
    const [log, setLog] = React.useState("");
    return <Surface height={"max"}>
        <Column padding={{bottom: 20}} alignItems={"center"} height={"max"} style={{}}>
            <Typography fontFamily={"serif"} variant={"h1"}>
                Crashy
            </Typography>
            {/*<Text text={""} variant={"h1"}/>*/}

            <Wrap padding={10} width={"max"} flexGrow={1}>
                <TextField value={log} onChange={value => setLog(value.target.value)} multiline
                           label={"Paste a crash log"} variant={"filled"}
                           style={{width: "100%", height: "100%",}}
                />
            </Wrap>


            <Button disabled={log === ""} size={"large"} variant={"contained"} color="primary" startIcon={
                <CloudUpload style={{height: "60px", width: "auto"}}/>
            }>
                <Text text={"Upload Crash"} variant={"h4"}/>
            </Button>

        </Column>
    </Surface>

}

function CrashyUi() {
    if (window.location.pathname === "/") {
        return CrashyHome();
    } else {
        return CrashyCrashUi();
    }
}
//TODO: fix up section dividers and color.

//5r4hREoRA4GO5CdOVfhP
function CrashyCrashUi() {
    const [crash, setCrash] = useState<CrashLogResponse | undefined>(undefined)
    const id = window.location.pathname.slice(1)
    useEffect(() => {
        getCrash(id).then(res => setCrash(res));
    }, [id])
    if (crash === undefined) {
        return <Text text={"Loading..."}/>
    } else if (crash) {
        return <CrashReportUi report={parseCrashReportRich(crash)}/>
    } else {
        return <Text text={"No such crash ID"}/>
    }

}

export const primaryColor = "#90caf9"

//todo: add nice error messages when there is a failure parsing
function App() {
    const outerTheme = createTheme({
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
    });

    return (
        // @ts-ignore
        <ThemeProvider theme={outerTheme}>
            <CssBaseline/>
            {/*<div style={{display: "flex", flexDirection: "column"}}>*/}
            {/*<div style = {{display:"flex", flexDirection: "column"}}>*/}
            {/*    <div style = {{display: "flex", flexDirection: "row"}}>*/}
            {/*        <div style={{width: "150px"}}/>*/}
            {/*            This can be any lengthsdfasdfasdfawsdfasdfasfawefawefawefwelengthsdfasdfasdfawsdfasdfasfawefawefawefwe*/}
            {/*        <div style={{width: "150px"}}/>*/}
            {/*    </div>*/}
            {/*    <div style = {{backgroundColor: "red", height: "10px", width: "500px"}}/>*/}
            {/*</div>*/}
        {/*<div>*/}

        {/*    <div style = {{display : "flex", flexDirection : "row", width: "max-content"}}>*/}
        {/*        <div style = {{maxWidth: "150px", minWidth: "100%"}}/>*/}
        {/*        asdfasdfasdf*/}
        {/*        <div style = {{maxWidth: "150px", minWidth: "100%"}}/>*/}
        {/*    </div>*/}
        {/*    <div style = {{backgroundColor: "red", height: "10px"}}/>*/}
        {/*</div>*/}
            {/*</div>*/}
            {/*    <CDivider width={"max"}/>*/}
            {/*</div>*/}
            {/*<AppBar color={"primary"} position = "static">*/}
            {/*    <Toolbar variant = "dense">*/}
            {/*        <Text align={"center"} variant="h3" text={"Minecraft Crash Report"}/>*/}
            {/*    </Toolbar>*/}

            {/*</AppBar>*/}
            {/*<AppBar position="static" >*/}
            {/*    <Toolbar>*/}
            {/*        <Typography variant="h6" color="inherit" component="div">*/}
            {/*            Minecraft Crash Report*/}
            {/*        </Typography>*/}
            {/*    </Toolbar>*/}
            {/*</AppBar>*/}
            {CrashyUi()}
        </ThemeProvider>
    )
}


export default App;
