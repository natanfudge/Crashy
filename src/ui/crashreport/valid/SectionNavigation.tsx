import {Row} from "../../utils/simple/Flex";
import React from "react";
import {Button, ButtonGroup, Typography} from "@mui/material";
import {Spacer, Wrap} from "../../utils/simple/SimpleDiv";
import {Surface} from "../../utils/simple/Surface";
import {OnBackgroundColor} from "../../Colors";
import {nameOfSection, Section, sectionsEqual, SectionState} from "../CrashReportPage";


export function SectionNavigation({sections,sectionState}: {
    sections: Section[],
   sectionState: SectionState
}) {

    return <Surface width={"fit-content"} margin={{right: 10}} height={"fit-content"}>
        <ButtonGroup orientation={"vertical"} variant={"contained"}>
            {sections.map(section => SectionButton({
                    name: nameOfSection(section), active: sectionsEqual(section,sectionState.activeSection),
                    onClick: () => sectionState.onActiveSectionChanged(section)
                })
            )}

        </ButtonGroup>
    </Surface>

}


function SectionButton(props: { name: string, active: boolean, onClick: () => void }) {
    return <Button sx={{backgroundColor: props.active ? "#374550" : undefined}} key={props.name} variant={"text"}
                   onClick={props.onClick} color={"primary"}>
        <Row padding={{horizontal: 5}} width={"max"}>
            <Spacer flexGrow={1}/>
            <Wrap flexGrow={1}>
                <Typography variant="h6" color={OnBackgroundColor} padding="5px" maxWidth={208}>
                    {props.name}
                </Typography>
            </Wrap>
            <Spacer flexGrow={1}/>
        </Row>
    </Button>
}