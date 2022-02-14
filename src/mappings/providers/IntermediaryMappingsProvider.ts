import {extractTinyMappings, profiler, profilerDel} from "./ProviderUtils";
import {parseTinyFile} from "./TinyMappings";
import {Mappings} from "crash-parser/src/util/common/Mappings";
import {AllowAllMappings, MappingsFilter} from "crash-parser/src/util/common/MappingsFilter";

export async function getIntermediaryMappings(mcVersion: string, filter: MappingsFilter): Promise<Mappings> {
    profiler("Downloading Yarn Intermediary Mappings");
    const res = await fetch(`https://maven.fabricmc.net/net/fabricmc/intermediary/${mcVersion}/intermediary-${mcVersion}-v2.jar`);
    profilerDel("Downloading Yarn Intermediary Mappings");
    const mappings = await extractTinyMappings(res);
    return parseTinyFile(mappings, filter);
}

