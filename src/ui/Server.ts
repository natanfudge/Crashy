import {httpGet} from "./Utils";

export type CrashLogResponse = string | GetCrashError

export enum GetCrashError {
    NoSuchCrashId
}

const localTesting = false;

export async function getCrash(id: string): Promise<CrashLogResponse> {
    const domain = localTesting ? "localhost:5001/crashy-9dd87/europe-west1" : "europe-west1-crashy-9dd87.cloudfunctions.net";
    const response = await httpGet(`https://${domain}/getCrash/${id}`);
    if (response.code === 200) {
        return response.body;
    } else if (response.code === 404) {
        return GetCrashError.NoSuchCrashId
    } else {
        throw new Error("Unexpected status code: " + response.code)
    }
}