import {Spacer, Wrap} from "fudge-commons/lib/src/simple/SimpleDiv";
import {nameOfSection, Section, sectionsEqual, SectionState} from "../../../utils/Section";
import {Surface} from "fudge-commons/lib/src/simple/Surface";
import {ActiveColor, OnBackgroundColor} from "../../Colors";
import {Button, ButtonGroup, Typography} from "@mui/material";
import {Row} from "fudge-commons/lib/src/simple/Flex";


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
    return <Button sx={{backgroundColor: props.active ?ActiveColor : undefined}} key={props.name} variant={"text"}
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