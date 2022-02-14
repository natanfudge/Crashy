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

export interface GetSrgMappingsRequest {
    mcVersion: string
}

// Record: unmappedClassName: string, mappedAndMethods: ClassMappingsEntry
export type GetSrgMappingsResponse = Record<string, ClassMappingsEntry>

export interface ClassMappingsEntry {
    // Mapped Class name (shortened to save space)
    c: string
    // Method entries (shortened to save space)
    m: MethodEntry[]
}

// Unmapped, mapped, unmapped descriptor
export type MethodEntry = [string, string, string]
