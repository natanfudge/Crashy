import {httpDelete, httpGet} from "./Utils";

export type CrashLogResponse = string | GetCrashError

export enum GetCrashError {
    NoSuchCrashId
}

 namespace HttpStatusCode {
    export const OK = 200;
    export const BadRequest = 400;
    export const Unauthorized = 401;
    export const NotFound = 404;
    export const PayloadTooLarge = 413;
    export const UnsupportedMediaType = 415;
}

export enum DeleteResult {
    IncorrectKey,
    Success,
    NoSuchCrashId
}

export namespace CrashyServer {
    const localTesting = false;
    const domain = localTesting ? "localhost:5001/crashy-9dd87/europe-west1" : "europe-west1-crashy-9dd87.cloudfunctions.net";

    export async function getCrash(id: string): Promise<CrashLogResponse> {
        const response = await httpGet(`https://${domain}/getCrash/${id}`);
        switch (response.code){
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
    export async function deleteCrash(id: string, code: string): Promise<DeleteResult> {
        const response = await httpDelete(`https://${domain}/deleteCrash/?crashId=${id}&key=${code}`,);
        switch (response.code) {
            case HttpStatusCode.OK:
                return DeleteResult.Success;
            case HttpStatusCode.Unauthorized:
                return DeleteResult.IncorrectKey;
            case HttpStatusCode.NotFound:
                return DeleteResult.NoSuchCrashId
            default:
                throw new Error("Unexpected status code: " + response.code)
        }
    }
}
