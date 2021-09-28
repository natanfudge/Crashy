import {Row} from "./utils/improvedapi/Flex";
import {Spacer, Wrap} from "./utils/improvedapi/Core";
import React from "react";
import {Button, ButtonGroup, Typography} from "@mui/material";
import {Surface} from "./utils/improvedapi/Material";


export function SectionNavigation(props: {
    sections: string[],
    activeSection: number, onActiveSectionChanged: (section: number) => void
}) {

    return <Surface width={"fit-content"} margin={{right: 10}} height={"fit-content"}>
        <ButtonGroup orientation={"vertical"} variant={"contained"}>
            {props.sections.map((section, index) => SectionButton({
                    name: section, active: props.activeSection === index,
                    onClick: () => props.onActiveSectionChanged(index)
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
                <Typography variant="h6" color={"white"} padding="5px">
                    {props.name}
                </Typography>
            </Wrap>
            <Spacer flexGrow={1}/>
        </Row>
    </Button>
}