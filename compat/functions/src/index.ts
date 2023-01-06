import * as functions from "firebase-functions/v2";

/**
 * We have a new uploadCrash endpoint to redirect old users of the API to the new API
 */

const betaBuild = true;
const domain = betaBuild ? "beta.crashy.net" : "crashy.net";
//TODO:  I think I want to upload to both old and new at first.
//TODO: use v2 functions https://firebase.google.com/docs/functions/beta/get-started
export const uploadcrashnew = functions.https.onRequest({region: "europe-west1"}, async (request, response) => {

    const newResponse = await fetch(`https://${domain}/uploadCrash`, {body: request.body})
    const newResponseBody = JSON.parse(await newResponse.text()) as NewUploadCrashResponse

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