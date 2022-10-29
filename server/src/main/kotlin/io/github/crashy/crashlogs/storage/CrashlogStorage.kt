package io.github.crashy.crashlogs.storage

import aws.sdk.kotlin.services.s3.S3Client
import aws.sdk.kotlin.services.s3.deleteObject
import aws.sdk.kotlin.services.s3.model.GetObjectRequest
import aws.sdk.kotlin.services.s3.model.InvalidObjectState
import aws.sdk.kotlin.services.s3.model.NoSuchKey
import aws.sdk.kotlin.services.s3.putObject
import aws.smithy.kotlin.runtime.content.ByteStream
import io.github.crashy.crashlogs.CrashlogEntry
import io.github.crashy.crashlogs.CrashlogId
import io.github.crashy.crashlogs.DeleteCrashResult
import io.github.crashy.crashlogs.DeletionKey
import java.nio.file.Path
import kotlin.io.path.createDirectories


class CrashlogStorage private constructor(
    private val s3: S3Client,
    runDir: Path,
    private val bucketName: String,
    clock: NowDefinition
) : AutoCloseable {
    companion object {
        suspend fun create(bucket: String, clock: NowDefinition, runDir: Path): CrashlogStorage {
            val client = S3Client.fromEnvironment {
                region = "eu-central-1"
            }
            return CrashlogStorage(client, runDir, bucket, clock)
        }
    }

    private val cache = CrashlogCache(parentDir = runDir.resolve("cache").createDirectories(), clock)

    fun store(id: CrashlogId, log: CrashlogEntry) {
        cache.store(id, log)
    }

    suspend fun get(id: CrashlogId): GetCrashlogResponse {
        // First try to get it from the locally stored logs
        val cachedResult = cache.get(id)
        if (cachedResult != null) return GetCrashlogResponse.Success(cachedResult)
        // Then try to get it from the S3 storage
        try {
            val s3Key = id.s3Key()
            val s3Result = try {
                s3.getObject {
                    this.ifNoneMatch
                    bucket = bucketName
                    key = s3Key
                }
            } catch (e: NoSuchKey) {
                return GetCrashlogResponse.DoesNotExist
            }

            // We found the crashlog in the S3. Now we store it in the cache and delete it from the S3 to save on storage costs.
            val body = s3Result.body ?: error("Could not get crashlog body")

            val crashlog = CrashlogEntry.read(body)
            cache.store(id, crashlog)
            s3.deleteObject {
                bucket = bucketName
                key = s3Key
            }

            return GetCrashlogResponse.Success(crashlog)
        } catch (e: InvalidObjectState) {
            //TODO: implement restoration
            return GetCrashlogResponse.Archived
        }
    }

    fun delete(id: CrashlogId, key: DeletionKey): DeleteCrashResult {
        // Technically the entry could only exist on the S3, but if the user requested to delete the crash he had
        // to have viewed it just now, which means he pulled it out of the S3 into the cache.
        return cache.delete(id, key)
    }

    suspend fun evictOld() {
        cache.evictOld { id, log ->
            // Once objects are evicted from the cache, we store them on the S3.
            s3.putObject {
                bucket = bucketName
                key = id.s3Key()
                body = ByteStream.fromBytes(log.bytes)
            }
        }
    }

    override fun close() {
        s3.close()
    }
}

sealed interface GetCrashlogResponse {
    class Success(val log: CrashlogEntry) : GetCrashlogResponse
    object DoesNotExist : GetCrashlogResponse {
        override fun toString(): String = "GetCrashlogResponse.DoesNotExist"
    }

    object Archived : GetCrashlogResponse {
        override fun toString(): String = "GetCrashlogResponse.Archived"
    }
}

private fun CrashlogId.s3Key() = value.toString()
//private fun CompressedCrashlog.toByteStream() = ByteStream.fromBytes(bytes)

// Fix up the weird s3 kotlin api
private suspend fun S3Client.getObject(requestBuilder: GetObjectRequest.Builder.() -> Unit) =
    getObject(GetObjectRequest { requestBuilder() }) { it }