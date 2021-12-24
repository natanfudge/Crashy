import {Mod} from "crash-parser/src/model/RichCrashReport";
import {Column, Row} from "../../utils/simple/Flex";
import {Text, TextTheme} from "../../utils/simple/Text";
import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import {Typography} from "@mui/material";
import {MoreInfoButton} from "../../utils/Crashy";
import {Spacer, Wrap} from "../../utils/simple/SimpleDiv";
import {SimpleDivider} from "../../utils/simple/SimpleDivider";
import {LazyColumn} from "../../utils/LazyColumn";


export function ModListUi({mods}: { mods: Mod[] }) {
    const modsPrioritizingSuspectedMods = mods.sort((modA, modB) => {
            // noinspection JSRemoveUnnecessaryParentheses
            if ((modA.isSuspected && modB.isSuspected) || (!modA.isSuspected && !modB.isSuspected)) {
                // If both suspected / neither suspected, sort alphabetically.
                return modA.name.localeCompare(modB.name);
            } else if (modA.isSuspected && !modB.isSuspected) return -1;
            // Prioritize mod A
            else if (!modA.isSuspected && modB.isSuspected) return 1;
            // Prioritize mod B
            else return 0;
            // Neither mod is suspected
        }
    )


    return <Column margin={{top: 20}} width={"max"}>
        <Column width={300} alignSelf={"center"}>
            <Text text={"Mods"} variant={"h4"} alignSelf={"center"}/>
            <SimpleDivider width={"max"}/>
        </Column>
        <LazyColumn data={modsPrioritizingSuspectedMods}
                    childProvider={mod => <ModUi mod={mod} key={mod.id}/>}/>

    </Column>
}



function ModUi({mod}: { mod: Mod }) {
    return <Row>
        <TextTheme wordBreak={"break-all"} variant={"h6"} alignSelf={"start"} color={mod.isSuspected ? "red" : undefined}>
            <b>{mod.name + " " + mod.version + (mod.isSuspected ? " - may have caused crash" : "")}</b>
            <span style={{fontSize: 14, whiteSpace: "pre", wordBreak: "break-all"}}> ({mod.id})</span>
        </TextTheme>
    </Row>;
}