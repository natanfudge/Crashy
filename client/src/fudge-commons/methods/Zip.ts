import {gzip, strFromU8, strToU8, unzip, Unzipped} from "fflate";

export async function extractFromZipAtPath(zip: ArrayBuffer, path: string): Promise<string> {
    return strFromU8((await extractFromZip(zip))[path])
}
export async function extractFromZip(zip: ArrayBuffer): Promise<Unzipped> {
    const byteArray = new Uint8Array(zip)
    return await new Promise<Unzipped>((resolve, reject) => {
        unzip(byteArray, (err, unzipped) => {
            if (err !== null) reject(err);
            else resolve(unzipped);
        })
    });
}

export async function gzipAsync(data: string): Promise<Uint8Array> {
    return new Promise((resolve, reject) => {
        gzip(strToU8(data), (error,zipped) => {
            if(error !== null) reject(error)
            else resolve(zipped);
        })
    })
}

