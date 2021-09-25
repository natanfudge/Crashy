import React, {Suspense} from 'react';
import '../App.css';

import {createTheme, CssBaseline, LinearProgress} from "@mui/material";
import {ThemeProvider} from '@mui/material/styles';
import {CrashyTheme} from "./Colors";
import {Expansion, useExpansion} from "./improvedapi/Expansion";
import {Row} from "./improvedapi/Flex";
import {Spacer} from "./improvedapi/Core";
import {CButton} from "./improvedapi/Material";
import {Text} from "./improvedapi/Text";
import {CrashyCrashReportPage} from "./CrashyCrashReport";

const CrashyHome = React.lazy(() => import("./CrashyHome"))




//
// // const CrashyHome = React.lazy(() => import("./CrashyHome"))
//
// // function Halo() {
// //     return <Spacer width={500} height={500} backgroundColor={"blue"}/>
// // }
//
//
// export function AppReloadable() {
//     console.log("Apooo")
//     return <Wtf/>
//         // @ts-ignore
//         // <ThemeProvider theme={outerTheme}>
//         //     <CssBaseline/>
//     //         {/*<Wtf/>*/}
//     //         {/*<WithExpansions>*/}
//     //         {/*    <ExpansionTest/>*/}
//     //         {/*</WithExpansions>*/}
//     //
//     //         {/*<div>*/}
//     //
//     //         {/*</div>*/}
//     //
//     //         {/*{CrashyUi()}*/}
//     //     // </ThemeProvider>
//     // )
// }
//
// function Wtf() {
//     return <Row>
//         <Text text={"ewf"}/>
//     </Row>
// }
//
// function ExpansionTest() {
//     console.log("Foo")
//     const expansionState = useExpansion();
//     return <div /*style = {{height: "100%", width: "100%"}}*/>
//         {/*<Row he>*/}
//
//         {/*</Row>*/}
//         <Row>
//             <Spacer height={600} width={500} backgroundColor={"red"}/>
//             <CButton onClick={() => expansionState.toggle()}>
//                 <Text text={"show/hide"}/>
//             </CButton>
//         </Row>
//         <NewExpansion controller={expansionState} onDismiss={() => {
//         }}>
//             <Spacer style={{zIndex: 30, position: "absolute"}} height={200} width={200} backgroundColor={"blue"}/>
//         </NewExpansion>
//     </div>
// }

export interface CrashId {
    value: string
    noCache: boolean
}

// export const NO_CACHE_PAGE_PARAMETER = "nocache"
// export const PAGE_PARAMETER = "?"

// export function getCurrentCrashId(): CrashId {
//     const id = window.location.pathname.slice(1);
//     const noCache = window.location.search.slice(1);
//     return {
//         value: id,
//         noCache: noCache === NO_CACHE_PAGE_PARAMETER
//     };
// }
//
// function CrashyUi() {
//     if (window.location.pathname === "/") {
//         return <Suspense fallback={<LinearProgress/>}>
//             {/*<Halo/>*/}
//             <CrashyHome/>
//         </Suspense>
//     } else {
//         return <CrashyCrashReportPage crashId={getCurrentCrashId()}/>;
//     }
// }


//Fabric:  befth2S6e4NfzIxFieDs
//Forge: X


