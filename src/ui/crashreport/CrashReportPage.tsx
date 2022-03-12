import React, {Fragment, useEffect, useState} from "react";
import {LinearProgress} from "@mui/material";
import {CrashyServer, GetCrashError, isSuccessfulGetCrashResponse} from "../../server/CrashyServer";
import {Wrap} from "fudge-commons/simple/SimpleDiv";
import {Section, SectionState, SpecialSection} from "../../utils/Section";
import {NoSuchCrashScreen} from "./invalid/NoSuchCrashScreen";
import {CrashErroredScreen} from "./invalid/CrashErroredScreen";
import {getCookieDeleted} from "../../utils/Cookies";
import {getUrlCrashId, getUrlNoCache} from "../../utils/PageUrl";
import {RichCrashReport} from "../../crash/model/RichCrashReport";
import {useScreenSize} from "fudge-commons/methods/Gui";
import {parseCrashReportRich} from "../../crash/parser/CrashReportEnricher";
import {CrashyAppBar} from "./appbar/CrashyAppBar";
import {ValidCrashReportUi} from "./valid/ValidCrashReportUi";


export function CrashyCrashReportPage() {
    const crash = useCrash();
    const [activeSection, setActiveSection] = React.useState<Section>(SpecialSection.StackTrace)
    const screen = useScreenSize();

    const sectionState: SectionState = {activeSection, onActiveSectionChanged: setActiveSection}

    return <Fragment>
        <CrashyAppBar crash={crash} screen={screen} sectionState={sectionState}/>
        <Wrap position="absolute" height="max" width="max" padding={{top: screen.isPhone ? 0 : 60}}>
            <CrashReportPageContent sectionState={sectionState} crash={crash}/>
        </Wrap>
    </Fragment>
}

export type GetCrashAttempt = RichCrashReport | undefined | Error | GetCrashError

export interface CrashProps {
    crash: GetCrashAttempt
    sectionState: SectionState
}


export function useCrash(): GetCrashAttempt {
    const [crash, setCrash] = useState<GetCrashAttempt>(undefined)
    useEffect(() => void CrashyServer.getCrash(getUrlCrashId()!, getUrlNoCache())
        .then(res => setCrash(isSuccessfulGetCrashResponse(res) ? parseCrashReportRich(res) : res)).catch(e => setCrash(e))
    ,[]
    )
    return crash;
}

function CrashReportPageContent({crash, sectionState}: CrashProps) {
    if (isCrashAttemptValid(crash)) {
        document.title = crash.title
        return <ValidCrashReportUi sectionState={sectionState} report={crash}/>
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
        // console.log("ALO")
        console.error(attempt)
        return <CrashErroredScreen/>
    }
}








