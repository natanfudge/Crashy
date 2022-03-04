import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import {firestore} from "firebase-admin";
import {generateCrashKey, getCrashValidationErrors, HttpStatusCode} from "./utils";
import {Crash, DeleteCrashRequest, GetCrashRequest, GetSrgMappingsRequest, UploadCrashResponse} from "./models";
import {EndpointResult} from "./index";
import {getSrgMappingsImpl} from "./SrgUtils";
import Timestamp = firestore.Timestamp;
import DocumentReference = firestore.DocumentReference;
import DocumentData = firestore.DocumentData;
import {mappingFilterForMappables} from "crashy-common/lib/src/util/mappings/MappingsFilter";
import {HashSet} from "crashy-common/lib/src/collections/hashmap/HashSet";
// import {get} from "http";
// import {} from "axios"

const maxSize = 100_000;

export async function uploadCrash(req: functions.Request): Promise<EndpointResult> {
    if (req.headers["content-encoding"] === "gzip") {
        return {
            status: HttpStatusCode.UnsupportedMediaType,
            body: "Don't specify gzip as the content-encoding. This trips up the server."
        }
    }
    if (req.headers["content-type"] !== "application/gzip") {
        return {
            status: HttpStatusCode.UnsupportedMediaType,
            body: "log must be compressed using gzip"
        }
    }

    const body: Buffer = req.body;

    if (body.length > maxSize) {
        return {
            status: HttpStatusCode.PayloadTooLarge,
            body: "Crash Log too large"
        }
    }

    const error = await getCrashValidationErrors(body);
    if (error !== undefined) {
        return {
            status: HttpStatusCode.BadRequest,
            body: "Could not parse crash log. Error message: " + error.message
        }
    }

    const uploadDate = Timestamp.now();
    const key = generateCrashKey();

    const writtenObject: Crash = {
        uploadDate,
        lastRead: uploadDate,
        log: body,
        key
    };
    const writeResult = await admin.firestore().collection("crashes").add(writtenObject);
    console.log("Wrote crash log with id " + writeResult.id + ` of about ${body.length / 1000}KB`);

    const response: UploadCrashResponse = {
        crashId: writeResult.id,
        crashUrl: `https://crashy.net/${writeResult.id}?code=${key}`,
        key
    };

    return {
        status: HttpStatusCode.Ok,
        body: JSON.stringify(response)
    }
}

export async function getCrashDocument(id: string): Promise<DocumentReference<DocumentData>> {
    return admin.firestore().doc(`crashes/${id}`);
}

export async function getCrashFromDocument(document: DocumentReference<DocumentData>): Promise<Crash | undefined> {
    return (await document.get()).data() as Promise<Crash | undefined>;
}

export async function getCrash(req: functions.Request & GetCrashRequest): Promise<EndpointResult> {
    const url = req.url;
    if (url === undefined || url === "" || url === "/") {
        return {
            status: HttpStatusCode.BadRequest,
            body: "No crashlog ID specified"
        };
    }

    const id = url.slice(1);

    const crashDocument = await getCrashDocument(id);
    const crash = await getCrashFromDocument(crashDocument);

    if (crash === undefined) {
        return {
            status: HttpStatusCode.NotFound,
            body: `No crashlog with id ${id}`
        }
    }

    return {
        status: HttpStatusCode.Ok,
        body: crash.log,
        headers: {
            "Content-Encoding": "gzip",
            "Content-Type": "application/gzip",
            "Last-Modified": crash.uploadDate.toDate().toUTCString(),
            "Cache-Control": "public, max-age=604800, immutable"
        },
        runAfter: async () => {
            const newCrash: Crash = {
                ...crash,
                lastRead: Timestamp.now(),
            };

            //  Update the last read time only after responding because this operation might be slow
            await crashDocument.set(newCrash);
        }
    }

}

export async function deleteCrash(req: functions.Request): Promise<EndpointResult> {
    const query: DeleteCrashRequest = req.query as unknown as DeleteCrashRequest;
    const {crashId, key} = query;

    if (crashId === undefined) {
        functions.logger.warn("Attempt to delete crash with no crash ID")
        return {
            status: HttpStatusCode.BadRequest,
            body: "No crash id specified"
        }
    }
    if (key === undefined) {
        functions.logger.warn("Attempt to delete crash with no crash code")
        return {
            status: HttpStatusCode.BadRequest,
            body: "No crash key specified"
        }
    }

    const crashDocument = await getCrashDocument(crashId);
    const crash = await getCrashFromDocument(crashDocument);

    if (crash === undefined) {
        functions.logger.warn("Attempt to delete crash that doesn't exist: " + crashId)
        return {
            status: HttpStatusCode.NotFound,
            body: `No crashlog with id ${crashId}`
        }
    }

    if (crash.key !== key) {
        functions.logger.info(`Attempt to delete crash with incorrect code: ${key} (correct code: ${crash.key}).`)
        return {
            status: HttpStatusCode.Unauthorized,
            body: "Incorrect crash key"
        }
    }

    await crashDocument.delete();
    return {
        status: HttpStatusCode.Ok,
        body: undefined
    }
}

//TODO: cache mappings to improve performance
export async function getSrgMappings(req: functions.Request): Promise<EndpointResult> {
    const {mcVersion, relevantMappables} = req.body as GetSrgMappingsRequest;
    const {
        ok,
        value
    } = await getSrgMappingsImpl(mcVersion, mappingFilterForMappables(HashSet.from(relevantMappables), false))
    if (ok) {
        return {
            status: HttpStatusCode.Ok,
            body: JSON.stringify(value)
        }
    } else {
        return {
            status: value.status,
            body: `Got error when trying to fetch SRG mappings from Forge server: ${value.message}`
        }
    }
}

