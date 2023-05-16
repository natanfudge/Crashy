import {Mod} from "../../../crash/model/RichCrashReport";
import {FormControlLabel, FormGroup, Switch} from "@mui/material";
import {SimpleDivider} from "../../../fudge-commons/simple/SimpleDivider";
import {Column, Row} from "../../../fudge-commons/simple/Flex";
import {Text, TextTheme} from "../../../fudge-commons/simple/Text";
import {Spacer} from "../../../fudge-commons/simple/SimpleDiv";
import {LazyColumn} from "../../../fudge-commons/components/LazyColumn";
import {Fragment, useState} from "react";
import {useScreenSize} from "fudge-lib/dist/methods/Gui";
import {getUserPreferences, setUserPreferences} from "../../../utils/Preferences";
import styled from "@emotion/styled";


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
            {/*<Column>*/}
                <ModText>
                    {/*First Mod <br/>*/}
                    {/*Second Mod*/}
                    {firstHalfOfMods.map(mod => <ModUi mod={mod} key={mod.id} showIds={idsEnabled} showVersions={versionsEnabled}/>)}
                </ModText>
                <ModText>
                    {secondHalfOfMods.map(mod => <ModUi mod={mod} key={mod.id} showIds={idsEnabled} showVersions={versionsEnabled}/>)}
                </ModText>

            {/*</Column>*/}
            {/*<LazyColumn data={firstHalfOfMods}*/}
            {/*            childProvider={mod => <ModUi mod={mod} key={mod.id} showIds={idsEnabled}*/}
            {/*                                         showVersions={versionsEnabled}/>}/>*/}
            {/*<LazyColumn data={secondHalfOfMods}*/}
            {/*            childProvider={mod => <ModUi mod={mod} key={mod.id} showIds={idsEnabled}*/}
            {/*                                         showVersions={versionsEnabled}/>}/>*/}
        </Row>


    </Column>
}

const ModText = styled.h6`
  margin: 0;
  font-family: "Roboto", "Helvetica", "Arial", sans-serif;
  font-weight: 500;
  font-size: 1.25rem;
  line-height: 1.6;
  letter-spacing: 0.0075em;
  padding-left: 10px;
  padding-right: 10px;
  word-break: break-all;
  align-self: start;
  max-width: 100%;
  //overflow: auto;
  //white-space: nowrap;
`

const ModIdText = styled.span`
  font-size: 14px;
  white-space: pre;
  word-break: break-all;
`

function ModUi({mod, showIds, showVersions}: { mod: Mod, showIds: boolean, showVersions: boolean }) {
    if (mod.isSuspected) {
        return <span style ={{color: "red"}}>
            <ListedModContent mod={mod} showIds={showIds} showVersions={showVersions}/>
        </span>
    } else {
        return <Fragment>
            <ListedModContent mod={mod} showIds={showIds} showVersions={showVersions}/>
        </Fragment>
    }
    // return <Fragment /*style = {{color: mod.isSuspected ? "red" : undefined}}*/>
    //     <b>{mod.name + (showVersions ? (" " + mod.version) : "") + (mod.isSuspected ? " - may have caused crash" : "")}</b>
    //     {showIds && <ModIdText> ({mod.id})</ModIdText>}
    //     <br/>
    // </Fragment>
}


function ListedModContent({mod, showIds, showVersions}: { mod: Mod, showIds: boolean, showVersions: boolean }) {
    return <Fragment>
        <b>{mod.name + (showVersions ? (" " + mod.version) : "") + (mod.isSuspected ? " - may have caused crash" : "")}</b>
        {showIds && <ModIdText> ({mod.id})</ModIdText>}
        <br/>
    </Fragment>
}