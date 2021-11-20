import React, {Fragment, useEffect, useState} from "react";
import {Wrap} from "../utils/improvedapi/Core";
import {LinearProgress} from "@mui/material";
import {CrashyServer, GetCrashError, GetCrashResponse} from "../../server/CrashyServer";
import {parseCrashReportRich} from "../../../parser/src/parser/CrashReportEnricher";
import {CrashyAppBar} from "./appbar/CrashyAppBar";
import {getUrlCrashId, getUrlNoCache} from "../../utils/PageUrl";
import {ValidCrashReportUi} from "./valid/ValidCrashReportUi";
import {NoSuchCrashScreen} from "./invalid/NoSuchCrashScreen";
import {CrashErroredScreen} from "./invalid/CrashErroredScreen";


export function CrashyCrashReportPage() {
    const [crash, setCrash] = useState<GetCrashResponse | undefined | Error>(undefined)
    //TODO: ok, plan D. store in cookies and intentionally hide it from the user. we have no choice.
    useEffect(() => void CrashyServer.getCrash(getUrlCrashId()!, getUrlNoCache()).then(res => setCrash(res)).catch(e => setCrash(e)))

    return <Fragment>
        <CrashyAppBar crash={crash}/>
        <Wrap style={{position: "absolute"}} height={"max"} width={"max"} padding={{top: 60}}>
            <CrashReportPageContent crash={crash}/>
        </Wrap>
    </Fragment>
}

function CrashReportPageContent({crash}: { crash: GetCrashResponse | undefined | Error }) {
    if (crash === undefined) {
        return <LinearProgress/>
    } else if (crash === GetCrashError.NoSuchCrashId) {
        return <NoSuchCrashScreen/>
    } else if (crash instanceof Error) {
        return <CrashErroredScreen/>
    } else {
        const parsed = parseCrashReportRich(crash)
        document.title = parsed.title
        return <ValidCrashReportUi report={parsed}/>
    }
}










