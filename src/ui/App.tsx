import React, {ErrorInfo, Suspense, useEffect} from 'react';
import '../App.css';

import {createTheme, CssBaseline, LinearProgress, Link, Typography} from "@mui/material";
import {ThemeProvider} from '@mui/material/styles';
import {CrashyTheme} from "./Colors";
import {CrashyCrashReportPage, InvalidCrashAttempt, isCrashAttemptValid, useCrash} from "./crashreport/CrashReportPage";
import {CrashyNewIssueUrl} from "./utils/Crashy";
import {Text, TextTheme} from "fudge-commons/lib/src/simple/Text";
import {getUrlIsRaw} from "../utils/PageUrl";
import {WithChild} from "../../fudge-commons/src/simple/SimpleElementProps";
import {Wrap} from "fudge-commons/lib/src/simple/SimpleDiv";
import {ErrorBoundary} from "fudge-commons/lib/src/components/ErrorBoundary";


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
        {/*<Wrap>*/}
        {/*    <Text text={"ff"}/>*/}
        {/*</Wrap>*/}

        <ErrorBoundary fallback={<CrashyUiFallback/>}>
            <Typography>
                asdf
            </Typography>
                {/*<CrashyUi/>*/}
        </ErrorBoundary>
    </ThemeProvider>
}

export interface ErrorBoundaryProps extends WithChild {
    fallback: JSX.Element
}
export interface ErrorBoundaryState {
    hasError: boolean;
}
export class ErrorBoundary2 extends React.Component<ErrorBoundaryProps,ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    // eslint-disable-next-line class-methods-use-this
    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // You can also log the error to an error reporting service
        //    logErrorToMyService(error, errorInfo);
        // return { hasError: true };
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return this.props.fallback;
        }

        return this.props.children;
    }
}

function CrashyUi() {

    if (getUrlIsRaw()) {
        return <CrashyRawUi/>
    } else if (window.location.pathname === "/") {
        return <Typography>
            asdf
        </Typography>
        // return <Suspense fallback={<LinearProgress/>}>
        //     <CrashyHome/>
        // </Suspense>
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


