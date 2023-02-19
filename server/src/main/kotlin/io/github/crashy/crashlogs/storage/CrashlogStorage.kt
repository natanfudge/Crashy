package io.github.crashy.crashlogs.storage

import io.github.crashy.Crashy
import io.github.crashy.crashlogs.*
import io.github.crashy.utils.*
import io.github.natanfudge.logs.LogContext
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Deferred
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.sync.Mutex
import kotlinx.coroutines.sync.withLock
import kotlinx.serialization.ExperimentalSerializationApi
import software.amazon.awssdk.regions.Region
import software.amazon.awssdk.services.s3.S3AsyncClient
import software.amazon.awssdk.services.s3.model.S3Exception
import software.amazon.awssdk.services.s3.model.Tier
import java.nio.file.Path
import java.util.concurrent.ConcurrentHashMap
import kotlin.io.path.createDirectories


class CrashlogStorage(
    appDataDir: Path,
    private val bucketName: String,
    clock: NowDefinition,
    private val deleteFromS3OnFetch: Boolean
) : AutoCloseable {
    private val s3 = S3AsyncClient.builder().region(Region.EU_CENTRAL_1).build()
    private val cache = CrashlogCache(parentDir = appDataDir.resolve("cache").createDirectories(), clock)

    fun store(id: CrashlogId, log: CrashlogEntry) {
        cache.store(id, log)
    }

    context(LogContext)
    suspend fun peek(id: CrashlogId): PeekCrashlogResult {
        // First try to get it from the locally stored logs
        val cachedResult = cache.peek(id)
        if (cachedResult != null) return PeekCrashlogResult.Success(cachedResult)
        // Then try to get it from the S3 storage
        return when (val s3Result = getFromS3(id)) {
            GetCrashlogResult.Archived -> PeekCrashlogResult.Archived
            GetCrashlogResult.DoesNotExist -> PeekCrashlogResult.DoesNotExist
            is GetCrashlogResult.Success -> PeekCrashlogResult.Success(s3Result.log.metadata)
        }
    }

    context (LogContext)
    suspend fun getLog(id: CrashlogId): GetCrashlogResult {
        // First try to get it from the locally stored logs
        val cachedResult = cache.get(id)
        if (cachedResult != null) return GetCrashlogResult.Success(cachedResult)
        // Then try to get it from the S3 storage
        return getFromS3(id)
    }

    private suspend fun getFromS3(id: CrashlogId): GetCrashlogResult  {
        val s3Key = id.s3Key()
        when (val s3Result = s3.getObjectSuspend(bucket = bucketName, key = s3Key)) {
            is AnyGetObjectResponse.Success -> return pullLogFromS3(s3Result, id, s3Key)
            AnyGetObjectResponse.NoSuchKey -> return GetCrashlogResult.DoesNotExist
            AnyGetObjectResponse.InvalidObjectState -> return restoreCrashlog(s3Key)
            is AnyGetObjectResponse.UnexpectedError -> throw s3Result.e
        }

    }

    private suspend fun restoreCrashlog(s3Key: String): GetCrashlogResult.Archived {
        try {
            s3.restoreObjectSuspend {
                bucket(bucketName)
                key(s3Key)
                restoreRequest { r ->
                    r.days(10)
                        .glacierJobParameters {
                            it.tier(Tier.STANDARD)
                        }
                }
            }
            val x = 2
        } catch (e: S3Exception) {
            if (e.awsErrorDetails().errorCode() != "RestoreAlreadyInProgress") throw e
            val x = 2
        }
        return GetCrashlogResult.Archived
    }

    @OptIn(ExperimentalSerializationApi::class)
    private suspend fun pullLogFromS3(
        s3Result: AnyGetObjectResponse.Success,
        id: CrashlogId,
        s3Key: String
    ): GetCrashlogResult.Success {
        // We found the crashlog in the S3. Now we store it in the cache and delete it from the S3 to save on storage costs.
        val body = s3Result.bytes.asByteArrayUnsafe() ?: error("Could not get crashlog body")

        val crashlog = Crashy.protobuf.decodeFromByteArray(CrashlogEntry.serializer(), body)
        cache.store(id, crashlog)
        if (deleteFromS3OnFetch) {
            // Don't want to delete real logs when testing locally
            s3.deleteObjectSuspend {
                bucket(bucketName)
                key(s3Key)
            }
        }


        return GetCrashlogResult.Success(crashlog)
    }

    context(LogContext)
    fun delete(id: CrashlogId, key: DeletionKey): DeleteCrashResult {
        // Technically the entry could only exist on the S3, but if the user requested to delete the crash he had
        // to have viewed it just now, which means he pulled it out of the S3 into the cache.
        return cache.delete(id, key)
    }

    context(LogContext)
    @OptIn(ExperimentalSerializationApi::class)
    suspend fun evictOld() {
        cache.evictOld { id, log ->
            // Once objects are evicted from the cache, we store them on the S3.
            s3.putObjectSuspend(Crashy.protobuf.encodeToByteArray(CrashlogEntry.serializer(), log)) {
                bucket(bucketName)
                key(id.s3Key())
            }

        }
    }

    override fun close() {
        s3.close()
    }
}

sealed interface GetCrashlogResult {
    class Success(val log: CrashlogEntry) : GetCrashlogResult
    object DoesNotExist : GetCrashlogResult {
        override fun toString(): String = "GetCrashlogResponse.DoesNotExist"
    }

    object Archived : GetCrashlogResult {
        override fun toString(): String = "GetCrashlogResponse.Archived"
    }
}

sealed interface PeekCrashlogResult {
    class Success(val metadata: CrashlogMetadata) : PeekCrashlogResult
    object DoesNotExist : PeekCrashlogResult {
        override fun toString(): String = "GetCrashlogResponse.DoesNotExist"
    }

    object Archived : PeekCrashlogResult {
        override fun toString(): String = "GetCrashlogResponse.Archived"
    }
}






