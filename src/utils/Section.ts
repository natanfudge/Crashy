import {isObj} from "crash-parser/src/util/Utils";

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
    Mods, StackTrace, ForgeInfo
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