import React, {Suspense, useEffect, useState} from 'react';
import '../App.css';

import {createTheme, CssBaseline, LinearProgress, Link} from "@mui/material";
import {ThemeProvider} from '@mui/material/styles';
import {CrashyTheme} from "./Colors";
import {CrashyCrashReportPage} from "./crashreport/CrashReportPage";
import {CrashyNewIssueUrl} from "./utils/Crashy";
import {TextTheme} from "../fudge-commons/simple/Text";
import {ErrorBoundary} from "../fudge-commons/components/ErrorBoundary";
import {createRoot} from "react-dom/client";


const CrashyHome = React.lazy(() => import("./home/CrashyHome"))

export default function App() {
    const outerTheme = createTheme(CrashyTheme);

    return <ThemeProvider theme={outerTheme}>
        <CssBaseline/>
        <ErrorBoundary fallback={<CrashyUiFallback/>}>
            <CrashyUi/>
        </ErrorBoundary>
    </ThemeProvider>
}

function CrashyUi() {
    const location = useLocation()
    if (location === "/") {
        return <Suspense fallback={<LinearProgress/>}>
            <CrashyHome/>
        </Suspense>
    } else {
        return <CrashyCrashReportPage/>;
    }
}

// Listen to onpopstate makes sure we update the page when the url changes.
function useLocation(): string {
    const [location, setLocation] = useState<string>(window.location.pathname)
    useEffect(() => {
        window.onpopstate = ((_) => {
            setLocation(window.location.pathname)
        })
    }, [])
    return location
}


function CrashyUiFallback() {
    return <TextTheme>
        Something went terribly wrong displaying this page. Please <Link href={CrashyNewIssueUrl}>Report this to
        Crashy</Link>.
    </TextTheme>
}



