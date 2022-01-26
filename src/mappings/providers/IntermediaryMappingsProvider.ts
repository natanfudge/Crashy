import {extractMappings, profiler, profilerDel} from "./ProviderUtils";
import {Mappings} from "../Mappings";
import {parseTinyFile} from "./TinyMappings";

export async function getIntermediaryMappings(mcVersion: string): Promise<Mappings> {
    profiler("Downloading Yarn Intermediary Mappings");
    const res = await fetch(`https://maven.fabricmc.net/net/fabricmc/intermediary/${mcVersion}/intermediary-${mcVersion}-v2.jar`);
    profilerDel("Downloading Yarn Intermediary Mappings");
    const mappings = await extractMappings(res);

    return loadIntermediaryMappings(mappings);
}

async function loadIntermediaryMappings(int_mappings: string): Promise<Mappings> {
    profiler("Parsing Intermediary Mappings");
    const retval = parseTinyFile(int_mappings);
    profilerDel("Parsing Intermediary Mappings");
    return retval;
}
