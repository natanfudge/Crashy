import {strFromU8, unzip, Unzipped} from "fflate";

export async function extractFromZip(zip: ArrayBuffer, path: string): Promise<string> {
    const byteArray = new Uint8Array(zip)
    const unzipped = await new Promise<Unzipped>((resolve,reject) => {
        unzip(byteArray, (err,unzipped) =>{
            if(err !== null) reject(err);
            else resolve(unzipped);
        })
    });

    const mappingsFileU8 = unzipped[path]
    return strFromU8(mappingsFileU8);
}
