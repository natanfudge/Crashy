import {Mod} from "../model/RichCrashReport";
import {Column, Row} from "./improvedapi/Flex";
import {Text} from "./improvedapi/Text";
import {CDivider, Spacer, Wrap} from "./improvedapi/Core";
import {MoreInfoButton} from "./StackTraceUi";
import React from "react";
import {errorColor} from "./App";

export function ModListUi(mods: Mod[]) {
    const modsPrioritizingSuspectedMods = mods.sort((modA, modB) => {
            if (modA.isSuspected && modB.isSuspected) return 0;
            else if (modA.isSuspected && !modB.isSuspected) return -1;
            else if (!modA.isSuspected && modB.isSuspected) return 1;
            else return 0; // Neither mod is suspected
        }
    )
    return <Column margin={{top: 20}} width={"max"}>
        <Column width={300} alignSelf={"center"}>
            <Text text={"Mods"} variant={"h4"} alignSelf={"center"}/>
            <CDivider width={"max"}/>
        </Column>
        {modsPrioritizingSuspectedMods.map(mod => ModUi(mod))}
    </Column>
}

function ModUi(mod: Mod) {
    const metadata = mod.forgeMetadata
    return <Row>
        <Text color={mod.isSuspected ? "red" : undefined}
              text={mod.name + " " + mod.version + (mod.isSuspected ? " - may have caused crash" : "")} variant={"h6"}
              isBold={mod.isSuspected}
              alignSelf={"start"}/>
        <Wrap alignSelf={"center"}>
            <MoreInfoButton>
                <Column padding={10}>
                    <Text text={mod.id}
                          alignSelf={"center"}/>
                    <Spacer height={5}/>
                    {metadata?.file && <Text text={"File: " + metadata.file}/>}
                    {metadata?.signature && <Text text={"Signature: " + metadata.signature}/>}
                    {metadata?.completeness && <Text text={metadata.completeness}/>}
                </Column>

            </MoreInfoButton>
        </Wrap>

    </Row>;
}