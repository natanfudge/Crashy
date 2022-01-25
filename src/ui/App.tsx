import React, {RefObject, Suspense, useEffect, useLayoutEffect, useRef, useState} from 'react';
import '../App.css';

import {createTheme, CssBaseline, LinearProgress, Link} from "@mui/material";
import {ThemeProvider} from '@mui/material/styles';
import {CrashyTheme} from "./Colors";
import {CrashyCrashReportPage, InvalidCrashAttempt, isCrashAttemptValid, useCrash} from "./crashreport/CrashReportPage";
import {ErrorBoundary} from "./utils/ErrorBoundary";
import {Text, TextTheme} from "./utils/simple/Text";
import {CrashyNewIssueUrl} from "./utils/Crashy";
import {getUrlIsRaw} from "../utils/PageUrl";
import {Wrap} from "./utils/simple/SimpleDiv";
import {Column, Row} from "./utils/simple/Flex";
import {WithChild} from "./utils/simple/SimpleElementProps";
import {SimpleDivider} from "./utils/simple/SimpleDivider";

const CrashyHome = React.lazy(() => import("./home/CrashyHome"))

//4ceKUQTeDaE47bLymRcy
//UviVselptZNZBxe9Govx
//g1VhToB8Si79hK9TTrLi:PruTPL
//2c2vAe5oUVgiNck3NfXU:K80Eid
//Verify Error: TgC7ZMXXXhHhTRnpoKw9

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

function CrashyRawUi() {
    const crash = useCrash();
    if (isCrashAttemptValid(crash)) {
        return <Text padding={3} text={crash.rawText} whiteSpace={"pre-wrap"} wordBreak={"break-word"}/>
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

//Fabric obfuscated:  le2GU0SUi6Zbl9VTYVby
//Fabric deobfuscated:  iMf0fA7WbKCsxDFnuzj0
//Forge: dOvaYXRVEh7N6Mufkoxu


