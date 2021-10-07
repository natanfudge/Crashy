// import {deflate, inflate} from "zlib";

import {httpDelete, httpGet, httpPost} from "./utils/Http";
import {TestBuggyParseCrash} from "../../parser/src/test/TestBuggyParseCrash";
import {TestCrashReel} from "../../parser/src/test/TestCrashReel";

namespace HttpStatusCode {
    export const OK = 200;
    export const BadRequest = 400;
    export const Unauthorized = 401;
    export const NotFound = 404;
    export const PayloadTooLarge = 413;
    export const UnsupportedMediaType = 415;
}

export type GetCrashResponse = string | GetCrashError

export function isSuccessfulGetCrashResponse(crash: GetCrashResponse | undefined) : crash is string {
    return typeof crash === "string";
}

export enum GetCrashError {
    NoSuchCrashId
}

export enum DeleteCrashResponse {
    IncorrectKey,
    Success,
    NoSuchCrashId
}

export type UploadCrashResponse = UploadCrashError | UploadCrashSuccess

export interface UploadCrashSuccess {
    crashId: string
    key: string
    crashUrl: string
}

export type UploadCrashError = "Too Large" | "Invalid Crash"

// export function isUploadCrashError(obj: UploadCrashResponse) : obj is UploadCrashError {
//     return typeof obj === "string"
// }

export namespace CrashyServer {
    const localTesting = false;
    const domain = localTesting ? "localhost:5001/crashy-9dd87/europe-west1" : "europe-west1-crashy-9dd87.cloudfunctions.net";
    const http = localTesting ? "http" : "https"
    const urlPrefix = `${http}://${domain}`

    export async function getCrash(id: string, noCache: boolean): Promise<GetCrashResponse> {
        const response = await httpGet({url: `${urlPrefix}/getCrash/${id}`, noCache});
        switch (response.code) {
            case HttpStatusCode.OK:
                return response.body;
            case HttpStatusCode.NotFound:
                return GetCrashError.NoSuchCrashId
            default:
                throw new Error("Unexpected status code: " + response.code)
        }
    }

    /**
     * Returns true if code is correct and deletion is successful
     */
    export async function deleteCrash(id: string, code: string): Promise<DeleteCrashResponse> {
        const response = await httpDelete({
            url: `${urlPrefix}/deleteCrash`, parameters: {crashId: id, key: code}
        })
        switch (response.code) {
            case HttpStatusCode.OK:
                return DeleteCrashResponse.Success;
            case HttpStatusCode.Unauthorized:
                return DeleteCrashResponse.IncorrectKey;
            case HttpStatusCode.NotFound:
                return DeleteCrashResponse.NoSuchCrashId
            default:
                throw new Error("Unexpected status code: " + response.code)
        }
    }

    export async function uploadCrash(compressedCrash: Uint8Array): Promise<UploadCrashResponse> {

        const response = await httpPost({
                url: `${urlPrefix}/uploadCrash`,
                body: compressedCrash,
                headers: {"content-type": "application/gzip"}
            }
        )

        switch (response.code) {
            case HttpStatusCode.OK:
                // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                return JSON.parse(response.body);
            case HttpStatusCode.BadRequest:
                return "Invalid Crash";
            case HttpStatusCode.PayloadTooLarge:
                return "Too Large"
            default:
                throw new Error("Unexpected status code: " + response.code)
        }
    }
}
