package io.github.crashy.crashlogs

import io.github.crashy.CrashyJson
import io.github.crashy.crashlogs.storage.CrashlogStorage
import io.github.crashy.crashlogs.storage.GetCrashlogResult
import io.github.crashy.utils.decompressGzip
import io.ktor.http.*
import io.ktor.util.*
import io.ktor.util.Identity.decode
import io.ktor.utils.io.*
import io.netty.handler.codec.compression.BrotliDecoder
import kotlinx.coroutines.runBlocking
import kotlinx.serialization.Serializable


typealias UploadCrashlogRequest = ByteArray

sealed interface UploadCrashResponse : Response {

    @Serializable
    data class Success(
        /**
         * The now-created ID of the newly uploaded crash.
         */
        val crashId: CrashlogId,
        /**
         * A secret 6-character key that can be used to delete the crash from the servers.
         */
        val deletionKey: DeletionKey,
        /**
         * A crashy.net url that displays the crash that was just uploaded.
         */
        val crashyUrl: String
    ) : UploadCrashResponse {
        override fun responseString() = CrashyJson.encodeToString(serializer(), this)
        override val statusCode: HttpStatusCode get() = HttpStatusCode.OK
    }

    /**
     *The compressed size of the crash is too large (>100KB). We don't allow this to avoid overloading the server/storage.
     */
    object CrashTooLargeError : UploadCrashResponse,
        Response by response("Too Large", HttpStatusCode.PayloadTooLarge)

    /**
     * Too many crashes were uploaded in the last day (>1MB). We don't allow this to avoid overloading the server/storage.
     */
    object RateLimitedError : UploadCrashResponse,
        Response by response("Rate Limited", HttpStatusCode.TooManyRequests)
}


sealed interface GetCrashResponse : Response {
    object Archived : GetCrashResponse, Response by response("Archived", HttpStatusCode.Processing)
    object DoesNotExist : GetCrashResponse, Response by response("Does Not Exist", HttpStatusCode.NotFound)
    class Success(val log: ByteArray) : GetCrashResponse {
        override fun responseString(): String = log.decompressGzip().toString(Charsets.UTF_8)
        override val statusCode: HttpStatusCode = HttpStatusCode.OK

    }
}

private const val MaxCrashSize = 100_000

typealias GetCrashRequest = CrashlogId

@Serializable
data class DeleteCrashlogRequest(val id: CrashlogId, val key: DeletionKey)

interface Response {
    fun responseString(): String
    val statusCode: HttpStatusCode
}

fun response(string: String, code: HttpStatusCode) = object : Response {
    override val statusCode: HttpStatusCode = code
    override fun responseString(): String = string
}


class CrashlogApi(private val logs: CrashlogStorage) {
    private val uploadLimiter = UploadLimiter()
    fun uploadCrash(request: UploadCrashlogRequest, ip: String): UploadCrashResponse {
        if (request.size > MaxCrashSize) return UploadCrashResponse.CrashTooLargeError
        if (!uploadLimiter.requestUpload(ip, request.size)) return UploadCrashResponse.RateLimitedError

        println("Accepted size: ${request.size}")

        val id = CrashlogId.generate()
        val key = DeletionKey.generate()
        logs.store(id = id, log = CrashlogEntry.create(request, key))

        return UploadCrashResponse.Success(id, deletionKey = key, crashyUrl = "https://crashy.net/${id.value}")
    }

    /**
     * Used for testing only
     */
    suspend fun getCrash(id: GetCrashRequest): GetCrashResponse {
        return when (val result = logs.get(id)) {
            GetCrashlogResult.Archived -> GetCrashResponse.Archived
            GetCrashlogResult.DoesNotExist ->  GetCrashResponse.DoesNotExist
            is GetCrashlogResult.Success -> GetCrashResponse.Success(result.log.bytes)
        }
    }

    fun deleteCrash(request: DeleteCrashlogRequest): DeleteCrashResult {
        return logs.delete(request.id, request.key)
    }
}

