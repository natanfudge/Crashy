import {Data, DeflateFunctionOptions} from "pako";
import {gzip, strToU8} from "fflate";

export async function gzipAsync(data: string): Promise<Uint8Array> {
    return new Promise((resolve, reject) => {
        gzip(strToU8(data), (error,zipped) => {
            if(error !== null) reject(error)
            else resolve(zipped);
        })
    })
}

