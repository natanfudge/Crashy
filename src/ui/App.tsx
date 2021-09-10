import React, {lazy, useEffect, useState} from 'react';
import '../App.css';

import {CrashReportUi} from "./CrashReportUi";
import {Text} from "./improvedapi/Text";
import {parseCrashReportRich} from "../model/CrashReportEnricher";
import {grey, red} from "@mui/material/colors";
import {createTheme, CssBaseline} from "@mui/material";
import {ThemeProvider} from '@mui/material/styles';
import { Suspense } from 'react';


export const clickableColor = "rgb(0, 173, 239)"
export const errorColor = "rgb(234,8,8)"
export const fadedOutColor = grey[600]
export const slightlyPronouncedColor = "#323232"

interface GetResponse {
    body: string
    code: number
}

//TODO: test forge trace
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


const CrashyHome = lazy(() => import("./CrashyHome"))

function CrashyUi() {
    if (window.location.pathname === "/") {
        //todo: better loading indicator
        return <Suspense fallback={<Text text={"Loading..."}/>}>
            {/*TODO: this doesn't seem to be working*/}
            <CrashyHome/>
        </Suspense>
    } else {
        return CrashyCrashUi();
    }
}

//TODO: optimize size

//Fabric: 5r4hREoRA4GO5CdOVfhP
//Forge: QB2IckABRxmlovsVw683
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

//TODO: proper loading indicator when downloading crash
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
            {CrashyUi()}
        </ThemeProvider>
    )
}


export default App;
