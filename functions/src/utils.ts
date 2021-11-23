import * as Zlib from "zlib";
import {parseCrashReportRich} from "crash-parser/src/parser/CrashReportEnricher";

export async function getCrashValidationErrors(crash: Buffer): Promise<Error | undefined> {
    return new Promise((resolve) => {
        Zlib.gunzip(crash, (err, unzipped) => {
            if (err !== null) {
                resolve(err);
                return;
            }

            try {
                parseCrashReportRich(unzipped.toString("utf8"));
            } catch (e) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                resolve(e);
            }
            resolve(undefined);
        });
    });
}


export function generateCrashKey(): string {
    let result = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    for (let i = 0; i < 6; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace HttpStatusCode {
    export const BadRequest = 400;
    export const Unauthorized = 401;
    export const NotFound = 404;
    export const PayloadTooLarge = 413;
    export const UnsupportedMediaType = 415;
}