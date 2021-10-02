import React, {Suspense} from 'react';
import '../App.css';

import {createTheme, CssBaseline, LinearProgress} from "@mui/material";
import {ThemeProvider} from '@mui/material/styles';
import {CrashyTheme} from "./Colors";
import {CrashyCrashReportPage} from "./CrashyCrashReport";


const CrashyHome = React.lazy(() => import("./CrashyHome"))

//4ceKUQTeDaE47bLymRcy
//UviVselptZNZBxe9Govx
//g1VhToB8Si79hK9TTrLi:PruTPL
//2c2vAe5oUVgiNck3NfXU:K80Eid
export default function App() {
    const outerTheme = createTheme(CrashyTheme);

    return <ThemeProvider theme={outerTheme}>
        <CssBaseline/>
        {CrashyUi()}
    </ThemeProvider>

}

function CrashyUi() {
    if (window.location.pathname === "/") {
        return <Suspense fallback={<LinearProgress/>}>
            <CrashyHome/>
        </Suspense>
    } else {
        return <CrashyCrashReportPage/>;
    }
}


//Fabric:  HU4yNEW0d3xNpnEkgmwu
//Forge: X


