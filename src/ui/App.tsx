import React, {Suspense} from 'react';
import '../App.css';

import {CrashyCrashReportPage} from "./CrashyCrashReport";
import {createTheme, CssBaseline, LinearProgress} from "@mui/material";
import {ThemeProvider} from '@mui/material/styles';
import {CrashyTheme} from "./Colors";

const CrashyHome = React.lazy(() => import("./CrashyHome"))


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

export interface CrashId {
    value: string
    noCache: boolean
}

export const NO_CACHE_PAGE_PARAMETER = "nocache"
export const PAGE_PARAMETER = "?"

export function getCurrentCrashId() : CrashId{
    const id = window.location.pathname.slice(1);
    const noCache = window.location.search.slice(1);
    return {
        value: id,
        noCache: noCache === NO_CACHE_PAGE_PARAMETER
    };
}

function CrashyUi() {
    if (window.location.pathname === "/") {
        return <Suspense fallback={<LinearProgress/>}>
            <CrashyHome/>
        </Suspense>
    } else {
        return <CrashyCrashReportPage crashId={getCurrentCrashId()}/>;
    }
}

//Fabric: 5r4hREoRA4GO5CdOVfhP
//Forge: QB2IckABRxmlovsVw683


export default App;
