import React, {Suspense, useEffect} from 'react';
import '../App.css';

import {createTheme, CssBaseline, LinearProgress, Link} from "@mui/material";
import {ThemeProvider} from '@mui/material/styles';
import {CrashyTheme} from "./Colors";
import {CrashyCrashReportPage, InvalidCrashAttempt, isCrashAttemptValid, useCrash} from "./crashreport/CrashReportPage";
import {ErrorBoundary} from "./utils/ErrorBoundary";
import {Text, TextTheme} from "./utils/simple/Text";
import {CrashyNewIssueUrl} from "./utils/Crashy";
import {getUrlIsRaw} from "../utils/PageUrl";
import {Column, Row} from "./utils/simple/Flex";
import {Spacer} from "./utils/simple/SimpleDiv";

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
//
// function CrashyUi2() {
//     // return <div>
//     //     <div  style={{float: "left", width: "400px", height: "150px", marginRight: "50px", backgroundColor: "#ff0000"}}>
//     //         {/*<Spacer margin={{right: 50}} width = {400} height={150} backgroundColor = "red"/>*/}
//     //     </div>
//     //     <p>But I must explain to you how all this mistaken idea of this mistaken idea of this mistaken idea of thxplain to you how all this mistaken idea of this mistaken idea of this mistaken idea of thxplain to you how all this mistaken idea of this mistaken idea of this mistaken idea of thxplain to you how all this mistaken idea of this mistaken idea of this mistaken idea of thxplain to you how all this mistaken idea of this mistaken idea of this mistaken idea of thxplain to you how all this mistaken idea of this mistaken idea of this mistaken idea of thxplain to you how all this mistaken idea of this mistaken idea of this mistaken idea of thxplain to you how all this mistaken idea of this mistaken idea of this mistaken idea of thxplain to you how all this mistaken idea of this mistaken idea of this mistaken idea of thxplain to you how all this mistaken idea of this mistaken idea of this mistaken idea of thxplain to you how all this mistaken idea of this mistaken idea of this mistaken idea of thxplain to you how all this mistaken idea of this mistaken idea of this mistaken idea of this mistaken idea of this mistaken idea of this mistaken idea of this mistaken idea of this mistaken idea of this mistaken idea of this mistaken idea of this mistaken idea of this mistaken idea of this mistaken idea of this mistaken idea of this mistaken idea of this mistaken idea of this mistaken idea of this mistaken idea of this mistaken idea of this mistaken idea of this mistaken idea of this mistaken idea of this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure. To take a trivial example, which of us ever undertakes laborious physical exercise, except to obtain some advantage from it? But who has any right to find fault with a man who chooses to enjoy a pleasure that has no annoying consequences, or one who avoids a pain that produces no resultant pleasure?</p>
//     // </div>
//     const text =
// "        Lorem ipsum dolor sit amet,um dolor sit amet,um dolor sit amet, ,um dolor sit amet,um dolor sit amet, ,um dolor sit amet,um dolor sit amet, ,um dolor sit amet,um dolor sit amet, co dolor sit amet, co dolor sit amet, consectetuasdfasefawefawefawefawefawefawefawefawf awef awef awef awef awef awef awr adique swef awef awef awef awef awr adique swef awef awef awef awef awr adique swef awef awef awef awef awr adique swef awef awef awef awef awr adique sint susat l nobis, quibusdam reprehenderit sunt vel, voluptates."
//
//     const breakpoint = 200;
//     const textPart1 = text.substring(0, breakpoint)
//     const textPart2 = text.substring(breakpoint)
//
//     return <Row>
//         <Text text={"Halo stuff"}/>
//         <div>
//             <Spacer flexGrow = {1}/>
//             <Spacer style={{float: "right"}} margin={{right: 50}} width = {400} height={150} backgroundColor = "red"/>
//             <Text padding={70} variant={"h5"} text = {text}/>
//         </div>
//         <Text text={"Halo stuff 123"}/>
//     </Row>
// }


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


