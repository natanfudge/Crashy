import * as functions from "firebase-functions";
import {HttpStatusCode} from "./utils";
import {firestore} from "firebase-admin";
import {Crash} from "./models";

// CONCLUSIONS FROM RESEARCH:
// Firestore store is not that expensive ($0.10/GB/Month)
// Firestore read/write costs are instead of database cpu costs
// Firebase action cost is $0.036/100,000 reads, $0.108/100,000 writes, $0.012/100,000 deletes
// There are ~1500 crashes stored, totalling to ~9MB of storage
// Merely accessing the reference of a document counts as a read. This means just calling listDocuments costs collection.size of reads. There is no way around this.
// The 0.06 shekel cost is just from having functions.

// Now the plan:
// Draw a graph of the current data so we can make better choices.
// Every X amount of time take all crashes that have been inactive for Y months, and move them into a separate collection 'deleted', that is much more compact (only the id is stored)
// When making a crash request, and the crash doesn't exist in the normal collection, check if it exists in the deleted collection and tell the client that.
// Also increment a counter whenever a crash is visited

// The business model is still an open question.

interface CrashEntry {
    lastRead: Date
    uploadDate: Date
    size: number
}

type DatabaseOverview = CrashEntry[]

interface DownloadDatabaseOverviewRequest {
    password: string
}


export async function downloadDatabaseOverview(req: functions.Request, res: functions.Response): Promise<void> {
    const request = req.query as unknown as DownloadDatabaseOverviewRequest;
    if (request.password !== functions.config()["roles"]["admin_password"]) {
        res.status(HttpStatusCode.Unauthorized).send("Unauthorized");
        return;
    }

    const snapshot = await firestore().collection("crashes").get()
    const overview: DatabaseOverview = snapshot.docs.map(doc => {
        const crash = doc.data() as Crash;
        return {
            lastRead: crash.lastRead.toDate(),
            uploadDate: crash.uploadDate.toDate(),
            size: crash.log.length
        }
    })
    res.json(overview);
}