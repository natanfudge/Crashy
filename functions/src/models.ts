import {firestore} from "firebase-admin";
import Timestamp = firestore.Timestamp;

export interface Crash {
    uploadDate: Timestamp,
    lastRead: Timestamp,
    log: Buffer,
    key: string
}

export interface UploadCrashResponse {
    crashId: string
    key: string
    crashUrl: string
}

export interface GetCrashRequest {
    url: string
}

export interface DeleteCrashRequest {
    crashId: string
    key: string
}

