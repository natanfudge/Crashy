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

//TODO: MOBILE:
// - When scrolling down the header ensmoldens to a 3-line button

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

function getWidth(ref: RefObject<Element>): number {
    return ref.current?.clientWidth ?? 0;
}

export function DynamicallyUnderlinedText(props: {
    text: string,
    largerBy: number
} & WithChild) {
    const leftSpaceRef = useRef<HTMLDivElement>(null);
    const rightSpaceRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLSpanElement>(null)
    const [width, setWidth] = useState(0);
    const [extraWidth, setExtraWidth] = useState(0);

    function recalculateWidth() {
        const leftWidth = getWidth(leftSpaceRef);
        setExtraWidth(leftWidth)
        const totalWidth = leftWidth + getWidth(rightSpaceRef) + getWidth(textRef);
        setWidth(totalWidth);
    }

    useEffect(() => {
        function handleResize() {
            recalculateWidth();
        }

        window.addEventListener('resize', handleResize)

        return () => window.removeEventListener('resize', handleResize)
    })

    useLayoutEffect(() => recalculateWidth(), [])

    return <Column width="max">
        <Row justifyContent={"center"}>
            <div ref={leftSpaceRef} style={{maxWidth: props.largerBy,flexGrow: 1}}/>
            <Text spanRef={textRef} variant={"h4"} fontStyle={"italic"} text={props.text}/>
            <div ref={rightSpaceRef} style={{maxWidth: props.largerBy, flexGrow: 1}}/>
        </Row>
        <Wrap alignSelf={"center"} style={{width: "100%"}} maxWidth={width}>
            {props.children}
        </Wrap>
    </Column>
}

function CrashyUi2() {
    return <DynamicallyUnderlinedText text={"Unexpected error"} largerBy={150}>
        <SimpleDivider  backgroundColor={"#9c1a1a"}/>
    </DynamicallyUnderlinedText>
    // return <div style={{display: "flex", flexDirection: "row"}}>
    //     <div style={{maxWidth: 500, width: "100%", height: 200, backgroundColor: "red"}}/>
    //     Hello Multiple words
    //     <div style={{maxWidth: 500, width: "100%", height: 200, backgroundColor: "red"}}/>
    // </div>
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

//TODO: investigate why everything is so zoomed in suddenly in the home UI, see what viewport stuff we had earlier.
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


