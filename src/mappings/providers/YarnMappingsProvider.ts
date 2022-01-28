import {extractTinyMappings, profiler, profilerDel} from "./ProviderUtils";
import {Mappings} from "../Mappings";
import {parseTinyFile} from "./TinyMappings";
import {httpGet} from "../../utils/Http";
import {HttpStatusCode} from "../../server/CrashyServer";

export async function getYarnMappings2(build: string): Promise<Mappings> {
    profiler("Downloading Yarn Mappings");
    const domain = "https://maven.fabricmc.net"
    const res = await fetch(`${domain}/net/fabricmc/yarn/${build}/yarn-${build}-v2.jar`);

    profilerDel("Downloading Yarn Mappings");

    const unzipped = await extractTinyMappings(res);
    return loadYarnMappings(unzipped);
}

async function loadYarnMappings(rawMappings: string): Promise<Mappings> {
    profiler("Parsing Yarn Mappings");

    const retval = await parseTinyFile(rawMappings);

    profilerDel("Parsing Yarn Mappings");
    return retval;
}


export interface YarnBuild {
    gameVersion: string;
    separator: string;
    build: number;
    maven: string;
    version: string;
    stable: boolean;
}

const YarnApiEntrypoint = "https://meta.fabricmc.net/v2/versions/yarn/"

export async function getYarnBuilds(minecraftVersion: string): Promise<YarnBuild[]> {
    const response = await httpGet({url: YarnApiEntrypoint + minecraftVersion});
    if (response.status !== HttpStatusCode.OK) {
        throw new Error(`Failed to get yarn versions for ${minecraftVersion}`);
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return JSON.parse(await response.text());
}