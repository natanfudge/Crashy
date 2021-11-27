import React, {Suspense} from 'react';
import '../App.css';

import {createTheme, CssBaseline, LinearProgress, Link} from "@mui/material";
import {ThemeProvider} from '@mui/material/styles';
import {CrashyTheme} from "./Colors";
import {
    CrashyCrashReportPage,
    GetCrashAttempt,
    InvalidCrashAttempt,
    isCrashAttemptValid,
    useCrash
} from "./crashreport/CrashReportPage";
import {ErrorBoundary} from "./utils/ErrorBoundary";
import {Text, TextTheme} from "./utils/improvedapi/Text";
import {CrashyNewIssueUrl} from "./utils/Crashy";
import {getUrlCrashId, getUrlIsRaw} from "../utils/PageUrl";
import {GetCrashError, GetCrashResponse} from "../server/CrashyServer";
import {NoSuchCrashScreen} from "./crashreport/invalid/NoSuchCrashScreen";
import {CrashErroredScreen} from "./crashreport/invalid/CrashErroredScreen";


const CrashyHome = React.lazy(() => import("./home/CrashyHome"))

//4ceKUQTeDaE47bLymRcy
//UviVselptZNZBxe9Govx
//g1VhToB8Si79hK9TTrLi:PruTPL
//2c2vAe5oUVgiNck3NfXU:K80Eid
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
    if (getUrlIsRaw()) {
        return <CrashyRawUi/>
    } else if (window.location.pathname === "/") {
        return <Suspense fallback={<LinearProgress/>}>
            <CrashyHome/>
        </Suspense>
    } else {
        return <CrashyCrashReportPage/>;
    }
}

//TODO: ok, plan D. store in cookies and intentionally hide it from the user. we have no choice.


function CrashyRawUi() {
    const crash = useCrash();
    if (isCrashAttemptValid(crash)) {
        return <Text padding={3} text={crash} whiteSpace={"pre"}/>
    } else {
        return <InvalidCrashAttempt attempt={crash}/>
    }
}
function CrashyUiFallback() {
    return <TextTheme>
        Something went terribly wrong displaying this page. Please <Link href={CrashyNewIssueUrl}>Report this to
        Crashy</Link>.
    </TextTheme>
}

//Fabric:  HU4yNEW0d3xNpnEkgmwu
//Forge: dOvaYXRVEh7N6Mufkoxu


