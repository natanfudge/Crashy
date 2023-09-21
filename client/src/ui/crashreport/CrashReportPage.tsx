import React, {Fragment, useEffect, useState} from "react";
import {LinearProgress} from "@mui/material";
import {CrashyServer, GetCrashError, isSuccessfulGetCrashResponse} from "../../server/CrashyServer";
import {Wrap} from "../../fudge-commons/simple/SimpleDiv";
import {Section, SectionState, SpecialSection} from "../../utils/Section";
import {CrashArchivedScreen, NoSuchCrashScreen} from "./invalid/NoSuchCrashScreen";
import {CrashErroredScreen} from "./invalid/CrashErroredScreen";
import {getCookieDeleted} from "../../utils/Cookies";
import {getUrlCrashId} from "../../utils/PageUrl";
import {getLoaderName, RichCrashReport} from "../../crash/model/RichCrashReport";
import {parseCrashReportRich} from "../../crash/parser/CrashReportEnricher";
import {CrashyAppBar} from "./appbar/CrashyAppBar";
import {ValidCrashReportUi} from "./valid/ValidCrashReportUi";
import {useScreenSize} from "../../fudge-lib/methods/Gui";


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

export type GetCrashNetworkAttempt = RichCrashReport | undefined | Error | GetCrashError
export type GetCrashAttempt = GetCrashNetworkAttempt | "Parsing Failed"


export interface CrashProps {
    crash: GetCrashAttempt
    sectionState: SectionState
}

export function useCrash(): GetCrashAttempt {
    const [crash, setCrash] = useState<GetCrashAttempt>(undefined)
    useEffect(() => void getCrash(setCrash), [])
    return crash;
}

async function getCrash(setCrash: (attempt: GetCrashAttempt) => void) {
    const response = await CrashyServer.getCrash(getUrlCrashId()!)
    try {
        setCrash(isSuccessfulGetCrashResponse(response) ? parseCrashReportRich(response) : response)
    } catch (e) {
        console.log(e)
        setCrash("Parsing Failed")
    }
}

function CrashReportPageContent({crash, sectionState}: CrashProps) {
    if (isCrashAttemptValid(crash)) {
        document.title = crash.title ?? getLoaderName(crash.context.loader.type) + " Crash"
        return <ValidCrashReportUi sectionState={sectionState} report={crash}/>
    } else {
        return <InvalidCrashAttempt attempt={crash}/>
    }
}

export function isCrashAttemptValid(attempt: GetCrashAttempt): attempt is RichCrashReport {
    return !getCookieDeleted() && attempt !== undefined && typeof attempt === "object" && "rawText" in attempt
}

export function InvalidCrashAttempt({attempt}: { attempt: Exclude<GetCrashAttempt, RichCrashReport> }) {
    if (getCookieDeleted() || attempt === GetCrashError.NoSuchCrashId) {
        return <NoSuchCrashScreen/>
    } else if (attempt === undefined) {
        return <LinearProgress/>
    } else if (attempt === GetCrashError.Archived) {
        return <CrashArchivedScreen/>
    } else if (attempt === "Parsing Failed") {
        return <CrashErroredScreen
            description={"Parsing Failed for this crash log, please submit this to Crashy at https://github.com/natanfudge/Crashy/issues/new (you can still view the log by adding /raw.txt to the url)"}/>
    } else {
        console.error(attempt)
        return <CrashErroredScreen
            description={"Something went wrong trying to get the crash log. Check your internet connection."}/>
    }

}








