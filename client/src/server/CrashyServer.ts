// import {deflate, inflate} from "zlib";


import {httpGet, httpPost} from "fudge-lib/dist/methods/Http";
import {VeryLongTraceCrash} from "../test/testlogs/VeryLongTraceCrash";

export namespace HttpStatusCode {
    export const OK = 200;
    export const BadRequest = 400;
    export const Unauthorized = 401;
    export const NotFound = 404;
    export const PayloadTooLarge = 413;
    export const UnsupportedMediaType = 415;
}

export type GetCrashResponse = string | GetCrashError

export function isSuccessfulGetCrashResponse(crash: GetCrashResponse | undefined | Error): crash is string {
    return typeof crash === "string";
}

export enum GetCrashError {
    NoSuchCrashId,
    Archived
}

export enum DeleteCrashResponse {
    IncorrectKey,
    Success,
    NoSuchCrashId
}

export type UploadCrashResponse = UploadCrashError | UploadCrashSuccess

export interface UploadCrashSuccess {
    crashId: string
    deletionKey: string
    crashUrl: string
}

export type UploadCrashError = "Too Large" | "Invalid Crash"


export namespace CrashyServer {
    const origin = typeof window !== "undefined" ? window.location.origin : "http://localhost:80";
    const crashyOrigin = origin.startsWith("http://localhost") ? "http://localhost:80" : origin;

    export async function getCrash(id: string): Promise<GetCrashResponse> {
        return VeryLongTraceCrash
        // if (id === "debug") return TestVerifyErrorCrash;
        // if (id === "toomanymods") return WayTooManyModsCrash;
        // return testFabricCrashReport;
        // return SeeminglyInnocentCrashTest.replaceAll("    ", "\t")
        // Fast path in case the server identified that this crash log doesn't exist and served this page with invalid crash url already
        if (document.title === "Invalid Crash Url") return GetCrashError.NoSuchCrashId;
        if (document.title === "Archived Crash") return GetCrashError.Archived
        const response = await httpGet({url: `${crashyOrigin}/${id}/raw.txt`});
        switch (response.status) {
            case HttpStatusCode.OK: {
                const text = await response.text()
                if (text === "Archived") return GetCrashError.Archived
                return text;
            }
            case HttpStatusCode.NotFound:
                return GetCrashError.NoSuchCrashId
            default:
                throw await requestError(response)
        }
    }

    /**
     * Returns true if code is correct and deletion is successful
     */
    export async function deleteCrash(id: string, code: string): Promise<DeleteCrashResponse> {
        const response = await httpPost({
            body: JSON.stringify({id: id, key: code}),
            url: `${crashyOrigin}/deleteCrash`
        })
        switch (response.status) {
            case HttpStatusCode.OK:
                return DeleteCrashResponse.Success;
            case HttpStatusCode.Unauthorized:
                return DeleteCrashResponse.IncorrectKey;
            case HttpStatusCode.NotFound:
                return DeleteCrashResponse.NoSuchCrashId
            default:
                throw await requestError(response)
        }
    }

    export async function uploadCrash(compressedCrash: Uint8Array): Promise<UploadCrashResponse> {
        const response = await httpPost({
                url: `${crashyOrigin}/uploadCrash`,
                body: compressedCrash,
                headers: {"content-type": "text/plain", "content-encoding": "gzip"}
            }
        )

        switch (response.status) {
            case HttpStatusCode.OK:
                // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                return JSON.parse(await response.text());
            case HttpStatusCode.BadRequest:
                return "Invalid Crash";
            case HttpStatusCode.PayloadTooLarge:
                return "Too Large"
            default:
                throw await requestError(response)
        }
    }

    export async function getTsrg(mcVersion: string): Promise<string> {
        const response = await httpGet({
            url: `${crashyOrigin}/getTsrg/${mcVersion}.tsrg`
        })
        if (response.status !== HttpStatusCode.OK) {
            throw await requestError(response)
        } else {
            return response.text()
        }
    }

    export async function getMcp(mcVersion: string, build: string): Promise<string> {
        const response = await httpGet({
            url: `${crashyOrigin}/getMcp/${mcVersion}/${build}.csv`
        })
        if (response.status !== HttpStatusCode.OK) {
            throw await requestError(response)
        } else {
            return response.text()
        }
    }

    async function requestError(response: Response): Promise<Error> {
        return new Error(`Unexpected status code: ${response.status} (text = ${await response.text()})`)
    }
}
