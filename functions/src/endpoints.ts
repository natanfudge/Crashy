import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import {firestore} from "firebase-admin";
import {generateCrashKey, getCrashValidationErrors, HttpStatusCode} from "./utils";
import {Crash, DeleteCrashRequest, GetCrashRequest, UploadCrashResponse} from "./models";
import Timestamp = firestore.Timestamp;
import DocumentReference = firestore.DocumentReference;
import DocumentData = firestore.DocumentData;

const maxSize = 100_000;

export async function uploadCrash(req: functions.Request, res: functions.Response) : Promise<void> {
    if (req.headers["content-encoding"] === "gzip") {
        res.status(HttpStatusCode.UnsupportedMediaType).send("Don't specify gzip as the content-encoding. This trips up the server.");
        return;
    }
    if (req.headers["content-type"] !== "application/gzip") {
        res.status(HttpStatusCode.UnsupportedMediaType).send("log must be compressed using gzip");
        return;
    }

    const body: Buffer = req.body;

    if (body.length > maxSize) {
        res.status(HttpStatusCode.PayloadTooLarge).send("Crash Log too large");
        return;
    }

    const error = await getCrashValidationErrors(body);
    if (error) {
        res.status(HttpStatusCode.BadRequest).send("Could not parse crash log. Error message: " + error.message);
        return;
    }

    const uploadDate = Timestamp.now();
    const key = generateCrashKey();

    const writtenObject: Crash = {
        uploadDate: uploadDate,
        lastRead: uploadDate,
        log: body,
        key: key
    };
    const writeResult = await admin.firestore().collection("crashes").add(writtenObject);
    console.log("Wrote crash log with id " + writeResult.id + ` of about ${body.length / 1000}KB`);

    const response: UploadCrashResponse = {
        crashId: writeResult.id,
        crashUrl: `https://crashy.net/${writeResult.id}`,
        key: key
    };
    res.json(response);
}

export async function getCrashDocument(id: string): Promise<DocumentReference<DocumentData>> {
    return admin.firestore().doc(`crashes/${id}`);
}

export async function getCrashFromDb(document: DocumentReference<DocumentData>): Promise<Crash | undefined> {
    return (await document.get()).data() as Promise<Crash | undefined>;
}

export async function getCrash(req: functions.Request & GetCrashRequest, res: functions.Response) : Promise<void> {
    const url = req.url;
    if (!url || url === "" || url === "/") {
        res.status(HttpStatusCode.BadRequest).send("No crashlog ID specified");
        return;
    }

    const id = url.slice(1);

    const crashDocument = await getCrashDocument(id);
    const crash = await getCrashFromDb(crashDocument);

    if (!crash) {
        res.status(HttpStatusCode.NotFound).send(`No crashlog with id ${id}`);
        return;
    }

    res.setHeader("Content-Encoding", "gzip");
    res.setHeader("Content-Type", "application/gzip");
    res.setHeader("Last-Modified", crash.uploadDate.toDate().toUTCString());
    res.setHeader("Cache-Control", "public, max-age=604800, immutable");

    // const log = crash["log"];
    res.send(crash.log);

    const newCrash: Crash = {
        ...crash,
        lastRead: Timestamp.now(),
    };

    //  Update the last read time only after responding because this operation might be slow
    await crashDocument.set(newCrash);
}

export async function deleteCrash(req: functions.Request, res: functions.Response) : Promise<void> {
    const query: DeleteCrashRequest = req.query as unknown as DeleteCrashRequest;
    const {crashId, key} = query;

    if (crashId === undefined) {
        res.status(HttpStatusCode.BadRequest).send("No crash id specified");
        return;
    }
    if (key === undefined) {
        res.status(HttpStatusCode.BadRequest).send("No crash key specified");
        return;
    }

    const crashDocument = await getCrashDocument(crashId);
    const crash = await getCrashFromDb(crashDocument);

    if (!crash) {
        res.status(HttpStatusCode.NotFound).send(`No crashlog with id ${crashId}`);
        return;
    }

    if (crash.key !== key) {
        res.status(HttpStatusCode.Unauthorized).send("Incorrect crash key");
        return;
    }

    await crashDocument.delete();
    res.send();
}