import * as functions from "firebase-functions";
import axios from "axios";

/**
 * We have a new uploadCrash endpoint to redirect old users of the API to the new API
 */

const betaBuild = true;
const domain = betaBuild ? "beta.crashy.net" : "crashy.net";
//TODO:  I think I want to upload to both old and new at first.
export const uploadCrashNew = functions.region("europe-west1").https.onRequest(async (request, response) => {
    const newResponse = await axios.post(`https://${domain}/uploadCrash`, request.body, {headers: {"content-encoding": "gzip"}})
    const newResponseBody = newResponse.data as NewUploadCrashResponse

    const legacyResponse: LegacyUploadCrashResponse = {
        crashId: newResponseBody.crashId,
        crashUrl: newResponseBody.crashyUrl,
        key: newResponseBody.deletionKey
    }
    response.send(JSON.stringify(legacyResponse));
});

interface LegacyUploadCrashResponse {
    crashId: string
    key: string
    crashUrl: string
}

interface NewUploadCrashResponse {
    crashId: string
    deletionKey: string
    crashyUrl: string
}