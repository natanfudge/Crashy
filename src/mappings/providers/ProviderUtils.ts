/*
Credit to https://github.com/wagyourtail/wagyourtail.xyz/blob/master/views/sections/Projects/MinecraftMappingViewer/App/app.ts
 */
// type ReleaseVersion = `${number}.${number}` | `${number}.${number}.${number}`;
// type Snapshot = `${number}w${number}${"a"|"b"|"c"|"d"|"e"}` | `${ReleaseVersion}-pre${number}` | `${ReleaseVersion}-rc${number}`;
// type MCVersionSlug =  ReleaseVersion | Snapshot;
import pako from "pako";
import {strFromU8, unzip, Unzipped} from "fflate";

export type MCVersionSlug = string;

export const NO_CORS_BYPASS = "/Projects/CORS-Bypass/App";



// export function mcVersionCompare(a: MCVersionSlug, b: MCVersionSlug) {
//     if (a === b) return 0;
//     // @ts-ignore
//     for (const e of versionSelect.children) {
//         if (e.value === a) return 1;
//         if (e.value === b) return -1;
//     }
//     throw Error("MC version not in list.");
// }
//
// export function isOlderMcVersion(target: MCVersionSlug, compareTo: MCVersionSlug): boolean {
//     return mcVersionCompare(target, compareTo) === -1;
// }
//
// export function isSameOrOlderMcVersion(target: MCVersionSlug, compareTo: MCVersionSlug): boolean {
//     return mcVersionCompare(target, compareTo) < 1;
// }
//
// export function isSameOrNewerMcVersion(target: MCVersionSlug, compareTo: MCVersionSlug): boolean {
//     return mcVersionCompare(target, compareTo) > -1;
// }

export function profiler(thing: string) {
    // currently no-op
}

export function profilerDel(thing: string) {
    // currently no-op
}


export async function extractFromZip(response: Response, path: string): Promise<string | undefined> {
    const byteArray = new Uint8Array(await response.arrayBuffer())
    const unzipped = await new Promise<Unzipped>((resolve,reject) => {
        unzip(byteArray, (err,unzipped) =>{
            if(err !== null) reject(err);
            else resolve(unzipped);
        })
    });

    const mappingsFileU8 = unzipped[path]
    return strFromU8(mappingsFileU8);
}
export async function extractTinyMappings(response: Response): Promise<string> {
    return (await extractFromZip(response,"mappings/mappings.tiny"))!
}


export  function withDotNotation(string: string): string {
    return string.replace(/\//g, ".")
}
