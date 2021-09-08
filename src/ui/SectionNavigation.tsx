import {Row} from "./improvedapi/Flex";
import {CDivider, Spacer, Wrap} from "./improvedapi/Core";
import React from "react";
import {Button, ButtonGroup, Typography} from "@mui/material";
import {Surface} from "./improvedapi/Material";


export function SectionNavigation(props: {
    sections: string[],
    activeSection: number, onActiveSectionChanged: (section: number) => void
}) {
    // const sections = ["Section 1", "SS", "Very Long Section", "Section 4"]

    return <Surface width={"fit-content"} margin={{right: 10}} height={"fit-content"}>
        <ButtonGroup orientation={"vertical"} variant={"contained"}>
            {/*<Button variant={"text"} color={"primary"} key="one">One</Button>,*/}
            {/*<Button  variant={"text"} key="two">Two</Button>,*/}
            {/*<Button  variant={"text"} key="three">Three</Button>*/}
            {props.sections.map((section, index) => SectionButton({
                    name: section, active: props.activeSection === index,
                    onClick: () => props.onActiveSectionChanged(index)
                })
            )}

            {/*{props.sections.map((section, i) =>*/}
            {/*    <BS name = {props.sections[i]} active = {props.activeSection === i} onClick = {() => props.onActiveSectionChanged(i)}/>*/}
            {/*    // bs({name: , active : , onClick: })*/}
            {/*)}*/}
            {/*{)}*/}
            {/*{bs({name: props.sections[1], active : props.activeSection === 1, onClick: () => props.onActiveSectionChanged(1)})}*/}
            {/*{bs({name: props.sections[2], active : props.activeSection === 2, onClick: () => props.onActiveSectionChanged(2)})}*/}
            {/*{bs({onClick: () => props.onActiveSectionChanged(1)})}*/}
            {/*{bs({onClick: () => props.onActiveSectionChanged(2)})}*/}


            {/*<Button variant={"text"} onClick={() => props.onActiveSectionChanged(0)}  color={"primary"}>*/}
            {/*    asdf*/}
            {/*    /!*<Row padding={{left: props.active? 0: 12, right: 12}}>*!/*/}
            {/*    /!*    {props.active && <CDivider backgroundColor={"#ff4545"} height={"auto"} width={2} margin={{vertical: 3, horizontal: 5}}/>}*!/*/}
            {/*    /!*    <Typography padding = "5px">*!/*/}
            {/*    /!*        {props.name}*!/*/}
            {/*    /!*    </Typography>*!/*/}
            {/*    /!*</Row>*!/*/}
            {/*</Button>*/}
            {/*<Button variant={"text"} onClick={() => props.onActiveSectionChanged(1)}  color={"primary"}>*/}
            {/*    asdf*/}
            {/*    /!*<Row padding={{left: props.active? 0: 12, right: 12}}>*!/*/}
            {/*    /!*    {props.active && <CDivider backgroundColor={"#ff4545"} height={"auto"} width={2} margin={{vertical: 3, horizontal: 5}}/>}*!/*/}
            {/*    /!*    <Typography padding = "5px">*!/*/}
            {/*    /!*        {props.name}*!/*/}
            {/*    /!*    </Typography>*!/*/}
            {/*    /!*</Row>*!/*/}
            {/*</Button>*/}
            {/*<Button variant={"text"} onClick={() => props.onActiveSectionChanged(2)}  color={"primary"}>*/}
            {/*    asdf*/}
            {/*    /!*<Row padding={{left: props.active? 0: 12, right: 12}}>*!/*/}
            {/*    /!*    {props.active && <CDivider backgroundColor={"#ff4545"} height={"auto"} width={2} margin={{vertical: 3, horizontal: 5}}/>}*!/*/}
            {/*    /!*    <Typography padding = "5px">*!/*/}
            {/*    /!*        {props.name}*!/*/}
            {/*    /!*    </Typography>*!/*/}
            {/*    /!*</Row>*!/*/}
            {/*</Button>*/}
        </ButtonGroup>
        {/*<Column>*/}
        {/*    <Row alignSelf={"end"}>*/}
        {/*        <CDivider height={"auto"} width={1}/>*/}
        {/*        <Column  width={"max-content"}>*/}
        {/*            */}
        {/*        </Column>*/}
        {/*    </Row>*/}

        {/*</Column>*/}
    </Surface>

}



function SectionButton(props: { name: string, active: boolean, onClick: () => void }) {
    return <Button sx = {{backgroundColor: props.active? "#374550" : undefined}} key={props.name} variant={"text"} onClick={props.onClick} color={"primary"}>
        <Row padding={{ horizontal: 5}} width={"max"}>

            {/*When There is no divider, we put a spacer to keep the layout the same.*/}
            {/*{props.active &&*/}
            {/*<CDivider backgroundColor={"#1409ff"} height={"auto"} width={2} margin={{vertical: 3, horizontal: 5}}/>}*/}
            {/*{!props.active && <Spacer width={2} margin={{vertical: 3, horizontal: 5}}/>}*/}


            <Spacer flexGrow={1}/>
            <Wrap flexGrow={1}>
                <Typography variant="h6" color={"white"} padding="5px">
                    {props.name}
                </Typography>
            </Wrap>
            <Spacer flexGrow={1}/>
        </Row>
    </Button>
    // return <Row /*className={"hoverable"}*/ /*flexBasis={0} flexGrow={1} flexShrink={1}*/ onClick={props.onClick}
    //             padding={{top: 5, bottom: 5, right: 5, left: props.active ? 5 : 8}}>
    //
    //     <Button>
    //         <Typography padding={5} color={clickableColor}>
    //             {props.name}
    //         </Typography>
    //     </Button>
    //
    // </Row>
}