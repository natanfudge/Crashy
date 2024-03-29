import {ButtonGroup} from "@mui/material";
import React from "react";
import {SimpleButton} from "../simple/SimpleButton";
import {Text} from "../simple/Text";
 const primaryColor = "#90caf9"
 const secondaryColor = "#65ff00"
 const ActiveColor = "#374550"
 const OnBackgroundColor = "#FFFFFF"
export function VisibleSelection({
                                     showAll,
                                     values,
                                     currentIndex,
                                     onValueChange
                                 }: { showAll: boolean, values: string[], currentIndex: number, onValueChange: (value: number) => void }) {

    if (values.length === 0) throw new Error("A selection must have at least one item")

    const actualValues = showAll ? values : [values[currentIndex]]
    return <ButtonGroup orientation="vertical" variant={"outlined"} style={{
        height: "fit-content",
        width: "fit-content",
        borderWidth: 2,
        borderColor: primaryColor,
        borderStyle: "solid",
        borderRadius: 7,
    }}>
        {actualValues.map((value, i) =>
            <VisibleSelectionButton last={i === actualValues.length - 1} key={i * 2 + 1} active={!showAll || i === currentIndex}
                                    onClick={() => onValueChange(i)}
                                    enabled = {showAll}
                                    text={value}/>)
        }
    </ButtonGroup>
}

//TODO: integrate colors with theme
function VisibleSelectionButton(props: { active: boolean, onClick: () => void, text: string, last: boolean, enabled: boolean }) {
    return <SimpleButton disabled={!props.enabled} style={{borderBottom: props.last ? undefined : `2px solid ${secondaryColor}`}}
                         backgroundColor={props.active ? ActiveColor : undefined}
                         onClick={props.onClick}>
        <Text color={OnBackgroundColor} text={props.text}/>
    </SimpleButton>
}