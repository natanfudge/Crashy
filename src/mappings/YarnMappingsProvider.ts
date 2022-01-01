import {httpGet} from "../utils/Http";
import {HttpStatusCode} from "../../functions/src/utils";
import {Mappings} from "./Mappings";
import pako from "pako";
import {StringMap} from "crash-parser/src/model/CrashReport";

export interface YarnBuild {
    gameVersion: string;
    separator: string;
    build: number;
    maven: string;
    version: string;
    stable: boolean;
}

const YarnApiEntrypoint = "https://meta.fabricmc.net/v2/versions/yarn/"
const YarnMaven = "https://maven.fabricmc.net/net/fabricmc/yarn/"

export async function getYarnBuilds(minecraftVersion: string): Promise<YarnBuild[]> {
    const response = await httpGet({url: YarnApiEntrypoint + minecraftVersion});
    if (response.status !== HttpStatusCode.OK) {
        throw new Error(`Failed to get yarn versions for ${minecraftVersion}`);
    }
    return JSON.parse(await response.text());
}

export async function getYarnMappings(build: string): Promise<Mappings> {
    const encodedYarnVersion = encodeURIComponent(build);
    const artifactUrl = `${YarnMaven}${encodedYarnVersion}/yarn-${encodedYarnVersion}-tiny.gz`;
    const artifact = await httpGet({url: artifactUrl});
    const mappingsString = await extract(artifact);
    return parseTinyV1(mappingsString);
}

async function extract(response: Response): Promise<string> {
    const byteArray = new Uint8Array(await response.arrayBuffer())
    return pako.inflate(byteArray, {to: 'string'})
}

function parseTinyV1(input: string): Mappings {
    const classes: StringMap = {}
    const fields: StringMap = {}
    const methods: StringMap = {}

    let foundHeader = false;
    let namespace: Record<string, number> = {};

    for (const value of input.split("\n")) {
        const split = value.split("\t")
        //Reads the header to find the coloum of the mapping format
        if (!foundHeader) {
            if (split[0] !== 'v1') {
                throw "Unsupported mapping format"
            }
            foundHeader = true;
            for (let i = 1; i < split.length; i++) {
                namespace[split[i]] = i - 1
            }
            continue
        }

        switch (split[0]) {
            case "CLASS":
                classes[split[namespace.intermediary + 1]] = split[namespace.named + 1]
                break
            case "FIELD":
                fields[split[namespace.intermediary + 3]] = split[namespace.named + 3]
                break
            case "METHOD":
                methods[split[namespace.intermediary + 3]] = split[namespace.named + 3]
                break
            default:
            //Nope
        }
    }

    return {
        methods, classes, fields
    }
}