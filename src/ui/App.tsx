import React, {Suspense, useEffect, useState} from 'react';
import '../App.css';

import {CrashReportUi} from "./CrashReportUi";
import {Text} from "./improvedapi/Text";
import {parseCrashReportRich} from "../model/CrashReportEnricher";
import {createTheme, CssBaseline} from "@mui/material";
import {ThemeProvider} from '@mui/material/styles';
import {CrashyTheme} from "./Colors";
import {CrashLogResponse, getCrash} from "./Server";

const CrashyHome = React.lazy(() => import("./CrashyHome"))


//TODO: proper loading indicator when downloading crash
function App() {
    const outerTheme = createTheme(CrashyTheme);

    return (
        // @ts-ignore
        <ThemeProvider theme={outerTheme}>
            <CssBaseline/>
            {CrashyUi()}
        </ThemeProvider>
    )
}

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
        const parsed = parseCrashReportRich(crash)
        document.title = parsed.title
        return <CrashReportUi report={parsed}/>
    } else {
        return <Text text={"No such crash ID"}/>
    }

}


export default App;
