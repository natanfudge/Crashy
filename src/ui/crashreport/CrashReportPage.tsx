import React, {Fragment, useEffect, useState} from "react";
import {LinearProgress} from "@mui/material";
import {CrashyServer, GetCrashError, GetCrashResponse, isSuccessfulGetCrashResponse} from "../../server/CrashyServer";
import {parseCrashReportRich} from "crash-parser/src/parser/CrashReportEnricher";
import {CrashyAppBar} from "./appbar/CrashyAppBar";
import {ValidCrashReportUi} from "./valid/ValidCrashReportUi";
import {NoSuchCrashScreen} from "./invalid/NoSuchCrashScreen";
import {CrashErroredScreen} from "./invalid/CrashErroredScreen";
import {Wrap} from "../utils/simple/SimpleDiv";
import {getUrlCrashId, getUrlNoCache} from "../../utils/PageUrl";
import {getCookieDeleted} from "../../utils/Cookies";
import {DynamicallyUnderlinedText} from "../App";
import {TextTheme} from "../utils/simple/Text";
import {SimpleDivider} from "../utils/simple/SimpleDivider";
import {RichCrashReport} from "crash-parser/src/model/RichCrashReport";


export function CrashyCrashReportPage() {
    const crash = useCrash();

    return <Fragment>
        <CrashyAppBar crash={crash}/>
        <Wrap position="absolute" height="max" width="max" padding={{top: 60}}>
            <CrashReportPageContent crash={crash}/>
        </Wrap>
    </Fragment>
}

export type GetCrashAttempt = RichCrashReport | undefined | Error | GetCrashError

export function useCrash(): GetCrashAttempt {
    const [crash, setCrash] = useState<GetCrashAttempt>(undefined)
    useEffect(() => void CrashyServer.getCrash(getUrlCrashId()!, getUrlNoCache())
        .then(res => setCrash(isSuccessfulGetCrashResponse(res) ? parseCrashReportRich(res) : res)).catch(e => setCrash(e)))
    return crash;
}

function CrashReportPageContent({crash}: { crash: GetCrashAttempt }) {
    if (isCrashAttemptValid(crash)) {
        document.title = crash.title
        return <ValidCrashReportUi report={crash}/>
    } else {
        return <InvalidCrashAttempt attempt={crash}/>
    }
}

export function isCrashAttemptValid(attempt: GetCrashAttempt): attempt is RichCrashReport {
    return !getCookieDeleted() && attempt !== undefined && attempt !== GetCrashError.NoSuchCrashId && !(attempt instanceof Error);
}

export function InvalidCrashAttempt({attempt}: { attempt: Exclude<GetCrashAttempt, string> }) {
    if (getCookieDeleted() || attempt === GetCrashError.NoSuchCrashId) {
        return <NoSuchCrashScreen/>
    } else if (attempt === undefined) {
        return <LinearProgress/>
    } else {
        return <CrashErroredScreen/>
    }
}








