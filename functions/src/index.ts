import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as corsPackage from "cors";
import {parseCrashReportRich} from "./validation/CrashReportEnricher";
import * as Zlib from "zlib";
// cors.e
// import corsPackage from "cors";
//
// const cors = corsPackage({origin: true});
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//

admin.initializeApp();

const maxSize = 100_000;

const cors = corsPackage({origin: true});

exports.uploadCrash = functions.region("europe-west1").https.onRequest(async (req, res) => {
    cors(req, res, () => uploadCrash(req, res));
});

exports.getCrash = functions.region("europe-west1").https.onRequest(async (req, res) => {
    cors(req, res, async () => await getCrash(req, res));
});

async function getCrashValidationErrors(crash: Buffer): Promise<Error | undefined> {
    return new Promise((resolve) => {
        Zlib.unzip(crash, (err, unzipped) => {
            if (err !== null) {
                resolve(err);
                return;
            }

            try {
                parseCrashReportRich(unzipped.toString("utf8"));
            } catch (e) {
                resolve(e);
            }
            resolve(undefined);
        });
    });
}

async function uploadCrash(req: functions.Request, res: functions.Response) {
    if (req.headers["content-encoding"] === "gzip") {
        res.status(415).send("Don't specify gzip as the content-encoding. This trips up the server.");
        return;
    }
    if (req.headers["content-type"] !== "application/gzip") {
        res.status(415).send("log must be compressed using gzip");
        return;
    }

    const body: Buffer = req.body;

    if (body.length > maxSize) {
        res.status(413).send("Crash Log too large");
        return;
    }

    const error = await getCrashValidationErrors(body);
    if (error) {
        res.status(400).send("Could not parse crash log. Error message: " + error.message);
    }

    console.log(`Writing about ${body.length / 1000}KB of log`);
    const uploadDate = new Date();
    const writeResult = await admin.firestore().collection("crashes").add({
        uploadDate: uploadDate,
        lastRead: uploadDate,
        log: body
    });
    console.log("Wrote crash log with id " + writeResult.id);

    res.json({
        crashId: writeResult.id,
        crashUrl: `https://crashy.net/${writeResult.id}`
    });
}

async function getCrash(req: functions.Request, res: functions.Response) {
    if (!req.url || req.url === "" || req.url === "/") {
        res.status(400).send("No crashlog ID specified");
        return;
    }

    const id = req.url.slice(1);

    const document = admin.firestore().doc(`crashes/${id}`);
    const data = (await document.get()).data();

    if (!data) {
        res.status(404).send(`No crashlog with id ${id}`);
        return;
    }

    res.setHeader("Content-Encoding", "gzip");
    res.setHeader("Content-Type", "application/gzip");
    res.setHeader("Last-Modified", data["uploadDate"].toDate().toUTCString());
    res.setHeader("Cache-Control", "public, max-age=604800, immutable");

    const log = data["log"];
    res.send(log);

    //  Update the last read time only after responding because this operation might be slow
    await document.set({
        lastRead: new Date(),
        ...data
    });
}
