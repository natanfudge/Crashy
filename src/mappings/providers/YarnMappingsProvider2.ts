import {extractMappings, profiler, profilerDel, withDotNotation} from "./ProviderUtils";
import {ClassData} from "./ClassItem";
import {Mappings} from "../Mappings";
import {parseTinyFile} from "./TinyMappings";

export async function getYarnMappings2(build: string): Promise<Mappings> {
    profiler("Downloading Yarn Mappings");
    const domain = "https://maven.fabricmc.net"
    const res = await fetch(`${domain}/net/fabricmc/yarn/${build}/yarn-${build}-v2.jar`);

    profilerDel("Downloading Yarn Mappings");

    const unzipped = await extractMappings(res);
    return loadYarnMappings(unzipped);
}

async function loadYarnMappings(rawMappings: string): Promise<Mappings> {
    profiler("Parsing Yarn Mappings");

    const retval = await parseTinyFile(rawMappings);

    profilerDel("Parsing Yarn Mappings");
    return retval;
}



