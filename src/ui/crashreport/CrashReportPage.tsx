import React, {Fragment, useEffect, useState} from "react";
import {LinearProgress} from "@mui/material";
import {CrashyServer, GetCrashError, isSuccessfulGetCrashResponse} from "../../server/CrashyServer";
import {parseCrashReportRich} from "crash-parser/src/parser/CrashReportEnricher";
import {CrashyAppBar} from "./appbar/CrashyAppBar";
import {ValidCrashReportUi} from "./valid/ValidCrashReportUi";
import {NoSuchCrashScreen} from "./invalid/NoSuchCrashScreen";
import {CrashErroredScreen} from "./invalid/CrashErroredScreen";
import {Wrap} from "../utils/simple/SimpleDiv";
import {getUrlCrashId, getUrlNoCache} from "../../utils/PageUrl";
import {getCookieDeleted} from "../../utils/Cookies";
import {RichCrashReport} from "crash-parser/src/model/RichCrashReport";
import {useScreenSize} from "../../utils/Gui";


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

export interface SectionState {
    activeSection: Section,
    onActiveSectionChanged: (section: Section) => void
}

export interface RealReportSection {
    index: number
    name: string
}

export type Section = RealReportSection | SpecialSection

export enum SpecialSection {
    Mods, StackTrace
}

export function nameOfSection(section: Section): string {
    if (section === SpecialSection.Mods) {
        return "Mods"
    } else if (section === SpecialSection.StackTrace) {
        return "Stack Trace"
    } else {
        return section.name;
    }
}

export function sectionsEqual(section1: Section, section2: Section): boolean {
    if (section1 === SpecialSection.Mods) {
        return section2 === SpecialSection.Mods
    } else if (section1 === SpecialSection.StackTrace) {
        return section2 === SpecialSection.StackTrace
    } else {
        return !(section2 === SpecialSection.Mods || section2 === SpecialSection.StackTrace) && section1.index === section2.index;
    }
}


export function useCrash(): GetCrashAttempt {
    const [crash, setCrash] = useState<GetCrashAttempt>(undefined)
    useEffect(() => void CrashyServer.getCrash(getUrlCrashId()!, getUrlNoCache())
        .then(res => setCrash(isSuccessfulGetCrashResponse(res) ? parseCrashReportRich(res) : res)).catch(e => setCrash(e)))
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
        return <CrashErroredScreen/>
    }
}








