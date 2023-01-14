import {Mod} from "../../../crash/model/RichCrashReport";
import {FormControlLabel, FormGroup, Switch} from "@mui/material";
import {SimpleDivider} from "../../../fudge-commons/simple/SimpleDivider";
import {Column, Row} from "../../../fudge-commons/simple/Flex";
import {Text, TextTheme} from "../../../fudge-commons/simple/Text";
import {Spacer} from "../../../fudge-commons/simple/SimpleDiv";
import {LazyColumn} from "../../../fudge-commons/components/LazyColumn";
import {useState} from "react";
import {useScreenSize} from "../../../fudge-commons/methods/Gui";
import {getUserPreferences, setUserPreferences} from "../../../utils/Preferences";


export function ModListUi({mods}: { mods: Mod[] }) {
    const screenSize = useScreenSize()
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


    const [idsEnabled, setIdsEnabled] = useState(getUserPreferences().showModIds === "true");
    const [versionsEnabled, setVersionsEnabled] = useState(getUserPreferences().showModVersions === "true" ?? !screenSize.isPhone);


    const [firstHalfOfMods, secondHalfOfMods] = screenSize.isPhone ? [modsPrioritizingSuspectedMods, []] :
        modsPrioritizingSuspectedMods.splitBy((_, i) => i < mods.length / 2)

    return <Column margin={{top: 20}} width={"max"}>
        <Column>

            <Row>
                <Spacer maxWidth={20} flexGrow={1}/>
                <Text text={"Mods"} variant={"h4"} alignSelf={"center"}/>
                <Spacer flexGrow={1}/>
                <FormGroup>
                    <FormControlLabel control={
                        <Switch checked={idsEnabled} onChange={e => {
                            setIdsEnabled(e.target.checked);
                            setUserPreferences({showModIds: e.target.checked ? "true" : "false"})
                        }}/>
                    } label="Show Mod IDs"/>
                    <FormControlLabel control={
                        <Switch checked={versionsEnabled} onChange={e => {
                            setVersionsEnabled(e.target.checked);
                            setUserPreferences({showModVersions: e.target.checked ? "true" : "false"})
                        }}/>
                    } label="Show Versions"/>
                </FormGroup>
            </Row>

            <SimpleDivider width={"max"}/>
        </Column>
        <Row>
            <LazyColumn data={firstHalfOfMods}
                        childProvider={mod => <ModUi mod={mod} key={mod.id} showIds={idsEnabled}
                                                     showVersions={versionsEnabled}/>}/>
            <LazyColumn data={secondHalfOfMods}
                        childProvider={mod => <ModUi mod={mod} key={mod.id} showIds={idsEnabled}
                                                     showVersions={versionsEnabled}/>}/>
        </Row>


    </Column>
}

//         <LazyColumn data={partitionedMods}
//                     childProvider={
//                         mods => <Row>
//                             {mods.map(mod => <ModUi mod={mod} key={mod.id} showIds={idsEnabled}
//                                                     showVersions={versionsEnabled}/>)}
//                         </Row>
//                     }/>


function ModUi({mod, showIds, showVersions}: { mod: Mod, showIds: boolean, showVersions: boolean }) {
    return <TextTheme padding={{horizontal: 10}} wordBreak={"break-all"} variant={"h6"} alignSelf={"start"}
                      color={mod.isSuspected ? "red" : undefined}>
        <b>{mod.name + (showVersions ? (" " + mod.version) : "") + (mod.isSuspected ? " - may have caused crash" : "")}</b>
        {showIds && <span style={{fontSize: 14, whiteSpace: "pre", wordBreak: "break-all"}}> ({mod.id})</span>}

    </TextTheme>

}

function modStringLength(mod: Mod, showVersions: boolean, showIds: boolean): number {
    const string = mod.name + (showVersions ? (" " + mod.version) : "")
        + (mod.isSuspected ? " - may have caused crash" : "") + (showIds ? mod.id : "")
    return string.length
}