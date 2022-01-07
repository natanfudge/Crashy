import {ButtonGroup} from "@mui/material";
import {ActiveColor, OnBackgroundColor, primaryColor, secondaryColor} from "../Colors";
import React from "react";
import {SimpleDivider} from "./simple/SimpleDivider";
import {SimpleButton} from "./simple/SimpleButton";
import {Text} from "./simple/Text";

export function VisibleSelection({
                                     showAll,
                                     values,
                                     currentIndex,
                                     onValueChange
                                 }: { showAll: boolean, values: string[], currentIndex: number, onValueChange: (value: number) => void }) {

    if (values.length === 0) throw new Error("A selection must have at least one item")

    console.log("Redraw")
    const actualValues = showAll ? values : [values[0]]
    return <ButtonGroup orientation="vertical" variant={"outlined"} style={{
        height: "fit-content",
        width: "fit-content",
        borderWidth: 2,
        borderColor: primaryColor,
        borderStyle: "solid",
        borderRadius: 7,
    }}>
        {actualValues.flatMap((value, i) => {
            const children = []
            if (i > 0) children.push(<SimpleDivider backgroundColor={secondaryColor} margin={{bottom: 0}}/>)
            children.push(<VisibleSelectionButton active={i === currentIndex} onClick={() => onValueChange(i)}
                                                  text={value}/>)
            return children;
        })}
    </ButtonGroup>
}


function VisibleSelectionButton(props: { active: boolean, onClick: () => void, text: string }) {
    return <SimpleButton style={{/*borderRadius: 7*/}} backgroundColor={props.active ? ActiveColor : undefined}
                         onClick={props.onClick}>
        <Text color={OnBackgroundColor} text={props.text}/>
    </SimpleButton>
}