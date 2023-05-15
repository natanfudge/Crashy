import {Mappings} from "../Mappings";
import {MappingsFilter} from "../MappingsFilter";
import {isOlderThan1_12_2} from "./ProviderUtils";
import {extractFromZip} from "fudge-lib/dist/methods/Zip";
import {strFromU8} from "fflate";
import {CrashyServer, HttpStatusCode} from "../../server/CrashyServer";
import {HashSet} from "fudge-lib/dist/collections/hashmap/HashSet";
import {MappingsBuilder} from "../MappingsBuilder";
import {DescriptoredMethod, JavaClass, SimpleMethod} from "../../crash/model/Mappable";
import {StringMap} from "../../crash/model/CrashReport";
import {httpGet} from "fudge-lib/dist/methods/Http";


const mcpSupportedMcVersions = HashSet.of(
    '1.14.2', '1.14.3', '1.14',
    '1.15',   '1.12',   '1.15.1',
    '1.14.4', '1.11',   '1.8',
    '1.7.10', '1.10.2', '1.9',
    '1.13.1', '1.14.1', '1.8.8',
    '1.8.9',  '1.9.4',  '1.13.2',
    '1.13'
)

export function mcpSupportsMcVersion(version: string): boolean {
    return mcpSupportedMcVersions.contains(version)
}

/**
 * MCP mappings only provide method mappings and only use the method name (no class name) for mapping because srg method names are unique.
 * Because of this we need to use a separate approach to map from srg to mcp.
 */
class McpMappings implements Mappings {
    private readonly methodsMappings: StringMap
    constructor(methodMappings: StringMap) {
        this.methodsMappings = methodMappings;
    }
    mapClass(className: JavaClass, reverse: boolean): JavaClass {
        // MCP doesn't map class names
        return className;
    }

    mapDescriptoredMethod(descriptoredMethod: DescriptoredMethod, reverse: boolean): DescriptoredMethod {
        return descriptoredMethod.withMethodName(this.map(descriptoredMethod.method))
    }

    mapSimpleMethod(method: SimpleMethod, reverse: boolean): DescriptoredMethod {
        return method.withUnmappedName(this.map(method))
            .withDescriptor("()V") // MCP doesn't support descriptors so we make up some BS descriptor
    }

    private map(method: SimpleMethod): string {
        return this.methodsMappings[method.getUnmappedMethodName()] ?? method.getUnmappedFullName()
    }
}

export async function getMcpMappings(mcVersion: string, build: string, filter: MappingsFilter): Promise<Mappings | undefined> {
    // Download mappings
    const mappings = await CrashyServer.getMcp(mcVersion,build)

    // Parse mappings
    const lines = mappings.split("\n")
    // Ignore header
    lines.shift()
    const entries: StringMap = {}
    for(const line of lines){
        const [srgName,mcpName] = line.split(",")
        if(filter.needMethodByName(srgName)){
            entries[srgName] = mcpName
        }
    }
    // console.log("Mappings", mappings)
    return new McpMappings(entries)
}


export async function getMcpBuilds(mcVersion: string): Promise<number[] | undefined> {
    if(!mcpSupportsMcVersion(mcVersion)) {
        throw new Error("Mcp shouldn't be an option for unsupported MC versions (in this case: " + mcVersion + ")")
    }

    const url = "https://maven.minecraftforge.net/de/oceanlabs/mcp/versions.json"
    const res = await httpGet({url});
    const parsed = JSON.parse(await res.text());

    const values = parsed[mcVersion]!

    // Stable builds are good enough
    return values["stable"] as number[];
}