import {Mod} from "../../../crash/model/RichCrashReport";
import {FormControlLabel, FormGroup, Switch} from "@mui/material";
import {SimpleDivider} from "fudge-commons/lib/simple/SimpleDivider";
import {Column, Row} from "fudge-commons/lib/simple/Flex";
import {Text, TextTheme} from "fudge-commons/lib/simple/Text";
import {Spacer} from "fudge-commons/lib/simple/SimpleDiv";
import {LazyColumn} from "fudge-commons/lib/components/LazyColumn";
import {useState} from "react";


export function ModListUi({mods}: { mods: Mod[] }) {
    const modsPrioritizingSuspectedMods = mods.sort((modA, modB) => {
            // noinspection JSRemoveUnnecessaryParentheses
            if ((modA.isSuspected && modB.isSuspected) || (!modA.isSuspected && !modB.isSuspected)) {
                // If both suspected / neither suspected, sort alphabetically.
                return modA.name.localeCompare(modB.name);
            } else if (modA.isSuspected && !modB.isSuspected) {
                return -1;
            }// Prioritize mod A
            else if (!modA.isSuspected && modB.isSuspected) {
                return 1;
            }// Prioritize mod B
            else {
                return 0;
            }
            // Neither mod is suspected
        }
    )

    const [idsEnabled, setIdsEnabled] = useState(false);
    const [versionsEnabled, setVersionsEnabled] = useState(false);

    return <Column margin={{top: 20}} width={"max"}>
        <Column>

            <Row>
                <Spacer maxWidth={20} flexGrow={1}/>
                <Text text={"Mods"} variant={"h4"} alignSelf={"center"}/>
                <Spacer flexGrow={1}/>
                <FormGroup>
                    <FormControlLabel control={
                        <Switch checked={idsEnabled} onChange={e => setIdsEnabled(e.target.checked)}/>
                    } label="Show Mod IDs"/>
                    <FormControlLabel control={
                        <Switch checked={versionsEnabled} onChange={e => setVersionsEnabled(e.target.checked)}/>
                    } label="Show Versions"/>
                </FormGroup>
            </Row>

            <SimpleDivider width={"max"}/>
        </Column>
        <LazyColumn data={modsPrioritizingSuspectedMods}
                    childProvider={mod => <ModUi mod={mod} key={mod.id} showIds={idsEnabled}
                                                 showVersions={versionsEnabled}/>}/>

    </Column>
}


function ModUi({mod, showIds, showVersions}: { mod: Mod, showIds: boolean, showVersions: boolean }) {
    return <Row>
        <TextTheme wordBreak={"break-all"} variant={"h6"} alignSelf={"start"}
                   color={mod.isSuspected ? "red" : undefined}>
            <b>{mod.name + (showVersions ? (" " + mod.version) : "") + (mod.isSuspected ? " - may have caused crash" : "")}</b>
            {showIds && <span style={{fontSize: 14, whiteSpace: "pre", wordBreak: "break-all"}}> ({mod.id})</span>}

        </TextTheme>
    </Row>;
}