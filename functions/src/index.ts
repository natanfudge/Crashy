import * as functions from "firebase-functions";
import {Request} from "firebase-functions";
import * as admin from "firebase-admin";
import * as corsPackage from "cors";
import {deleteCrash, getCrash, uploadCrash} from "./PublicEndpoints";
import {downloadDatabaseOverview} from "./PrivateEndpoints";
import {HttpStatusCode} from "./utils";

admin.initializeApp();

const cors = corsPackage({origin: true});

export interface Result {
    body: string | Buffer | undefined;
    status: HttpStatusCode
    runAfter?: () => void
    headers?: Record<string, string>
}

function endpoint(code: (req: Request) => Promise<Result>) {
    return functions.region("europe-west1").https.onRequest(async (req, res) => {
        cors(req, res, async () => {
            const {body, status, runAfter, headers} = await code(req);
            if (headers !== undefined) {
                // eslint-disable-next-line guard-for-in
                for (const key in headers) {
                    const value = headers[key];
                    res.setHeader(key, value);
                }
            }
            res.status(status).send(body);
            runAfter?.();
        });
    });
}

exports.uploadCrash = endpoint(uploadCrash);
exports.getCrash = endpoint(getCrash);
exports.deleteCrash = endpoint(deleteCrash);
exports.downloadDatabaseOverview = endpoint(downloadDatabaseOverview)
exports.getSrgMappings = endpoint()
