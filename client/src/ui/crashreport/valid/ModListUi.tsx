import {Mod} from "../../../crash/model/RichCrashReport";
import {FormControlLabel, FormGroup, Switch} from "@mui/material";
import {SimpleDivider} from "../../../fudge-commons/simple/SimpleDivider";
import {Column, Row} from "../../../fudge-commons/simple/Flex";
import {Text} from "../../../fudge-commons/simple/Text";
import {Spacer} from "../../../fudge-commons/simple/SimpleDiv";
import {Fragment, useState} from "react";
import styled from "@emotion/styled";
import {useScreenSize} from "../../../fudge-lib/methods/Gui";
import {usePersistentState} from "../../../fudge-lib/state/PersistentState";
import {State} from "../../../fudge-lib/state/State";

interface ModDisplayPreferences {
    id: boolean
    version: boolean
    filename: boolean
}



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

    const displayPreferences = usePersistentState<ModDisplayPreferences>(
        "mod-display-preferences",{id: false, filename: false, version: false}
    )

    // const [idsEnabled, setIdsEnabled] = useState(getUserPreferences().showModIds === "true");
    // const [versionsEnabled, setVersionsEnabled] = useState(getUserPreferences().showModVersions === "true" ?? !screenSize.isPhone);
    // const [filenamesEnabled, setFilenamesEnabled] = useState(getUserPreferences().showModVersions === "true" ?? !screenSize.isPhone);


    const [firstHalfOfMods, secondHalfOfMods] = screenSize.isPhone ? [modsPrioritizingSuspectedMods, []] :
        modsPrioritizingSuspectedMods.splitBy((_, i) => i < mods.length / 2)

    const filenamesExist = !mods.isEmpty() && mods[0].forgeMetadata !== undefined

    return <Column margin={{top: 20}} width={"max"}>
        <Column>

            <Row>
                <Spacer maxWidth={20} flexGrow={1}/>
                <Text text={"Mods"} variant={"h4"} alignSelf={"center"}/>
                <Spacer flexGrow={1}/>
                <FormGroup>
                    <LabeledSwitch state={displayPreferences.field("id")} label={"Show Mod Ids"}/>
                    <LabeledSwitch state={displayPreferences.field("version")} label={"Show Versions"}/>
                    {filenamesExist && <LabeledSwitch state={displayPreferences.field("filename")} label={"Show File Names"}/>}
                </FormGroup>
            </Row>

            <SimpleDivider width={"max"}/>
        </Column>
        <Row>
            <ModText>
                {firstHalfOfMods.map(mod => <ModUi mod={mod} key={mod.id} {...displayPreferences.value}/>)}
            </ModText>
            <ModText>
                {secondHalfOfMods.map(mod => <ModUi mod={mod} key={mod.id} {...displayPreferences.value}/>)}
            </ModText>
        </Row>


    </Column>
}

function LabeledSwitch(props: {state: State<boolean>, label: string}) {
    return <FormControlLabel control={
        <Switch checked={props.state.value} onChange={e => {
            props.state.setValue(e.target.checked)
        }}/>
    } label={props.label}/>
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
`

const ModIdText = styled.span`
  font-size: 14px;
  white-space: pre;
  word-break: break-all;
`

interface ModDisplayConfig extends ModDisplayPreferences{
    mod: Mod
}

function ModUi(props: ModDisplayConfig) {
    if (props.mod.isSuspected) {
        return <span style={{color: "red"}}>
            <ListedModContent {...props}/>
        </span>
    } else {
        return <Fragment>
            <ListedModContent {...props}/>
        </Fragment>
    }
}


function ListedModContent({mod, id, version, filename}: ModDisplayConfig) {
    return <Fragment>
        <b>{mod.name + (version ? (" " + mod.version) : "") + (mod.isSuspected ? " - may have caused crash" : "")}</b>
        {id && <ModIdText> ({mod.id})</ModIdText>}
        {filename && mod.forgeMetadata !== undefined && <ModIdText> from {mod.forgeMetadata.file}</ModIdText>}
        <br/>
    </Fragment>
}