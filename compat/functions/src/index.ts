import * as functions from "firebase-functions";
import axios from "axios";
import {defineString} from "firebase-functions/params";

// Secret passcode allowing the firebase function that exists for backward compatibility to bypass the rate limits
const firebasePass = defineString("CRASHY_FIREBASE_PASS");

/**
 * We have a new uploadCrash endpoint to redirect old users of the API to the new API
 */

const betaBuild = false;
const domain = betaBuild ? "beta.crashy.net" : "crashy.net";
export const uploadCrash = functions.region("europe-west1").https.onRequest(async (request, response) => {
    const newResponse = await axios.post(`https://${domain}/uploadCrash`, request.body, {headers: {"content-encoding": "gzip", "firebase-pass" : firebasePass.value()}})
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