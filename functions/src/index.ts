import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as corsPackage from "cors";
import {Request, Response} from "firebase-functions";
import {deleteCrash, getCrash, uploadCrash} from "./PublicEndpoints";
import {downloadDatabaseOverview} from "./PrivateEndpoints";

admin.initializeApp();

const cors = corsPackage({origin: true});

function endpoint(code: (req: Request, res: Response) => void) {
    return functions.region("europe-west1").https.onRequest(async (req, res) => {
        cors(req, res, () => code(req, res));
    });
}

exports.uploadCrash = endpoint(uploadCrash);
exports.getCrash = endpoint(getCrash);
exports.deleteCrash = endpoint(deleteCrash);
exports.downloadDatabaseOverview = endpoint(downloadDatabaseOverview)