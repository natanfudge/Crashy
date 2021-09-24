import React, { Suspense } from 'react';
import '../App.css';

import {createTheme, CssBaseline, LinearProgress} from "@mui/material";
import {ThemeProvider} from '@mui/material/styles';
import {CrashyTheme} from "./Colors";
import {Row} from "./improvedapi/Flex";
import {Text} from "./improvedapi/Text";
import {CrashyCrashReportPage} from "./CrashyCrashReport";
import {getCurrentCrashId} from "./PageUrl";
import {Spacer} from "./improvedapi/Core";
import {NewExpansion, useExpansion, WithExpansions} from "./improvedapi/Expansion";
import {CButton} from "./improvedapi/Material";


const CrashyHome = React.lazy(() => import("./CrashyHome"))




export default function App() {
    console.log("Apooo")
    const outerTheme = createTheme(CrashyTheme);

    return (
        // @ts-ignore
        <ThemeProvider theme={outerTheme}>
            <CssBaseline/>
            {/*<Wtf/>*/}
            <WithExpansions>
                <ExpansionTest/>
            </WithExpansions>

            {/*<div>*/}

            {/*</div>*/}

            {/*{CrashyUi()}*/}
         </ThemeProvider>
    )
}


function ExpansionTest() {
    console.log("Foo")
    const expansionState = useExpansion();
    return <div /*style = {{height: "100%", width: "100%"}}*/>
        {/*<Row he>*/}

        {/*</Row>*/}
        <Row>
            <Spacer height={300} width={500} backgroundColor={"red"}/>
            <CButton onClick={() => expansionState.toggle()}>
                <Text text={"show/hide"}/>
            </CButton>
        </Row>
        <NewExpansion controller={expansionState} onDismiss={() => {
        }}>
            <Spacer style={{zIndex: 30, position: "absolute"}} height={200} width={200} backgroundColor={"blue"}/>
        </NewExpansion>
    </div>
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


//Fabric:  befth2S6e4NfzIxFieDs
//Forge: X


