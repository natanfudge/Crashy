import {Mod} from "parser/src/model/RichCrashReport";
import {Column, Row} from "./improvedapi/Flex";
import {Text} from "./improvedapi/Text";
import {CDivider, Spacer, Wrap} from "./improvedapi/Core";
import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import {Typography} from "@mui/material";
import {MoreInfoButton} from "./Utils";

export function ModListUi({mods}: { mods: Mod[] }) {
    const modsPrioritizingSuspectedMods = mods.sort((modA, modB) => {
            if ((modA.isSuspected && modB.isSuspected) || (!modA.isSuspected && !modB.isSuspected)) {
                // If both suspected / neither suspected, sort alphabetically.
                return modA.name.localeCompare(modB.name);
            } else if (modA.isSuspected && !modB.isSuspected) return -1; // Prioritize mod A
            else if (!modA.isSuspected && modB.isSuspected) return 1;// Prioritize mod B
            else return 0; // Neither mod is suspected
        }
    )


    return <Column margin={{top: 20}} width={"max"}>
        <Column width={300} alignSelf={"center"}>
            <Text text={"Mods"} variant={"h4"} alignSelf={"center"}/>
            <CDivider width={"max"}/>
        </Column>
        <LazyColumn data={modsPrioritizingSuspectedMods}
                    childProvider={(mod) => <ModUi mod={mod} key={mod.id}/>}/>

    </Column>
}

//TODO: maybe improve this to calculate height AOT (would require reimplementing InfiniteScroll I think)
function LazyColumn<T>({data, childProvider}: { data: T[], childProvider: (item: T, index: number) => JSX.Element }) {
    const batchSize = 20;
    const [activeAmount, setActiveAmount] = React.useState(batchSize)
    const hasMore = activeAmount < data.length;

    const active = data.slice(0, activeAmount);

    return <InfiniteScroll dataLength={activeAmount}
                           next={() => setActiveAmount(Math.min(activeAmount + batchSize, data.length))}
                           hasMore={hasMore}
                           loader={<h4>Loading...</h4>}
    >
        {active.map((item, index) => (childProvider(item, index)))}
    </InfiniteScroll>
}

function ModUi({mod}: { mod: Mod }) {
    const metadata = mod.forgeMetadata
    return <Row>
        <Typography variant={"h6"} alignSelf={"start"} fontWeight={"bold"} color={mod.isSuspected ? "red" : undefined}>
            {mod.name + " " + mod.version + (mod.isSuspected ? " - may have caused crash" : "")}
        </Typography>

        <Wrap alignSelf={"center"}>
            <MoreInfoButton>
                <Column padding={10}>
                    <Text text={"ID: " + mod.id}
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