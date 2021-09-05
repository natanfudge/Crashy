import React, {useEffect, useState} from 'react';
import '../App.css';
import {Button, createTheme, CssBaseline, MuiThemeProvider, TextField} from "@material-ui/core";
import {grey, red} from "@material-ui/core/colors";
import {CrashReportUi} from "./CrashReportUi";
import {Text} from "./improvedapi/Text";
import {parseCrashReportRich} from "../model/CrashReportEnricher";
import {Column} from "./improvedapi/Flex";
import {Wrap} from "./improvedapi/Core";
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import {CloudUpload} from "@material-ui/icons";


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
    return <Column padding = {{bottom: 20}} alignItems={"center"} height={"max"} style = {{}}>
        <Text text={"Crashy"} variant={"h1"}/>

        <Wrap padding={10} width={"max"} flexGrow={1}>
            <TextField  InputLabelProps={{
                color: "secondary"
            }} value={log} onChange={value => setLog(value.target.value)} multiline
                       label={"Paste a crash log"} variant={"filled"}
                       style={{width: "100%", height: "100%", }}
            />
        </Wrap>


        <Button disabled={log === ""} size={"large"} variant={"contained"} color="primary" startIcon={
            <CloudUpload style = {{ height:"60px", width:"auto"}}/>
        }>
            <Text text={"Upload Crash"} variant={"h4"}/>
        </Button>

    </Column>

}

function CrashyUi() {
    if (window.location.pathname === "/") {
        return CrashyHome();
    } else {
        return CrashyCrashUi();
    }
}

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

//todo: add nice error messages when there is a failure parsing
function App() {
    const outerTheme = createTheme({
        palette: {
            type: 'dark',
            secondary: {
                main: red[500],
            },
            text: {
                secondary: grey[600]
            }
        },
    });

    return (
        // @ts-ignore
        <MuiThemeProvider theme={outerTheme}>
            <CssBaseline/>
            {CrashyUi()}
        </MuiThemeProvider>
    )
}


export default App;
