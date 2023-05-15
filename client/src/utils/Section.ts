import {LoaderType, RichCrashReport} from "../crash/model/RichCrashReport";
import {isObj} from "fudge-lib/dist/methods/Typescript";


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
    Mods, StackTrace, ForgeInfo, JvmInfo
}

function isRealReportSection(section: Section): section is RealReportSection {
    return isObj(section) && "index" in section;
}

export function nameOfSection(section: Section): string {
    if (section === SpecialSection.Mods) {
        return "Mods"
    } else if (section === SpecialSection.StackTrace) {
        return "Stack Trace"
    } else if (section === SpecialSection.ForgeInfo) {
        return "Extra Forge Info"
    } else if (section === SpecialSection.JvmInfo) {
        return "JVM Details"
    } else {
        return section.name;
    }
}

export function sectionsEqual(section1: Section, section2: Section): boolean {
    if (isRealReportSection(section1)) {
        return isRealReportSection(section2) && section1.index === section2.index;
    } else {
        return section1 === section2;
    }
}

export function sectionNavigationOf(report: RichCrashReport): Section[] {
    const sections: Section[] = [SpecialSection.StackTrace];
    if (report.mods !== undefined) sections.push(SpecialSection.Mods);

    report.sections.forEach((section, i) => sections.push({name: section.name, index: i}));
    if (report.context.loader.type === LoaderType.Forge) sections.push(SpecialSection.ForgeInfo);
    if (report.stackTrace.details !== undefined) sections.push(SpecialSection.JvmInfo);
    return sections;
}