import {Column, Row} from "./improvedapi/Flex";
import {CDivider} from "./improvedapi/Core";
import React from "react";
import {Text} from "./improvedapi/Text";
import {clickableColor} from "./App";
import {RichCrashReportSection} from "../model/RichCrashReport";

export function SectionNavigation(props: {
    sections: string[],
    activeSection: number, onActiveSectionChanged: (section: number) => void
}) {
    // const sections = ["Section 1", "SS", "Very Long Section", "Section 4"]

    return <Column>
        <Row alignSelf={"end"}>
            <CDivider height={"auto"} width={1}/>
            <Column alignItems={"stretch"} width={"max-content"}>
                {props.sections.map((section, index) =>
                    <SectionButton name={section} key={section} active={props.activeSection === index}
                                   onClick={() => props.onActiveSectionChanged(index)}/>
                )}
            </Column>
        </Row>

    </Column>

}

function SectionButton(props: { name: string, active: boolean, onClick: () => void }) {
    return <Row className={"hoverable"} flexBasis={0} flexGrow={1} flexShrink={1} onClick={props.onClick}
                padding={{top: 5, bottom: 5, right: 5, left: props.active ? 5 : 8}}>
        {props.active && <CDivider height={"auto"} width={3}/>}
        <Text text={props.name} variant={"h5"} padding={5} color={clickableColor}/>
    </Row>
}