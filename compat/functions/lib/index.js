"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadCrash = void 0;
const functions = require("firebase-functions");
const axios_1 = require("axios");
/**
 * We have a new uploadCrash endpoint to redirect old users of the API to the new API
 */
const betaBuild = false;
const domain = betaBuild ? "beta.crashy.net" : "crashy.net";
exports.uploadCrash = functions.region("europe-west1").https.onRequest(async (request, response) => {
    const newResponse = await axios_1.default.post(`https://${domain}/uploadCrash`, request.body, { headers: { "content-encoding": "gzip" } });
    const newResponseBody = newResponse.data;
    const legacyResponse = {
        crashId: newResponseBody.crashId,
        crashUrl: newResponseBody.crashyUrl,
        key: newResponseBody.deletionKey
    };
    response.send(JSON.stringify(legacyResponse));
});
//# sourceMappingURL=index.js.map