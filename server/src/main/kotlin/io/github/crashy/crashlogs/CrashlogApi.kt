package io.github.crashy.crashlogs

import io.github.crashy.crashlogs.storage.CrashlogStorage
import io.github.crashy.crashlogs.storage.GetCrashlogResult
import io.ktor.http.*
import kotlinx.serialization.Serializable


typealias UploadCrashlogRequest = ByteArray

sealed interface UploadCrashlogResponse : Response {

    @Serializable
    data class Success(
        /**
         * The now-created ID of the newly uploaded crash.
         */
        val id: CrashlogId,
        /**
         * A secret 6-character key that can be used to delete the crash from the servers.
         */
        val deletionKey: DeletionKey,
        /**
         * A crashy.net url that displays the crash that was just uploaded.
         */
        val crashyUrl: String
    ) : UploadCrashlogResponse {
        override fun responseString() = CrashyJson.encodeToString(serializer(), this)
        override val statusCode: HttpStatusCode get() = HttpStatusCode.OK
    }

    /**
     *The compressed size of the crash is too large (>100KB). We don't allow this to avoid overloading the server/storage.
     */
    object CrashTooLargeError : UploadCrashlogResponse {
        override fun responseString() = "Too Large"
        override val statusCode: HttpStatusCode = HttpStatusCode.PayloadTooLarge
    }

    /**
     * Too many crashes were uploaded in the last day (>1MB). We don't allow this to avoid overloading the server/storage.
     */
    object RateLimitedError : UploadCrashlogResponse {
        override fun responseString(): String = "Rate Limited"
        override val statusCode: HttpStatusCode = HttpStatusCode.TooManyRequests
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


class CrashlogApi(private val logs: CrashlogStorage) {
    private val uploadLimiter = UploadLimiter()
    fun uploadCrash(request: UploadCrashlogRequest, ip: String): UploadCrashlogResponse {
        if (request.size > MaxCrashSize) return UploadCrashlogResponse.CrashTooLargeError
        if (!uploadLimiter.requestUpload(ip, request.size)) return UploadCrashlogResponse.RateLimitedError

        val id = CrashlogId.generate()
        val key = DeletionKey.generate()
        logs.store(id = id, log = CrashlogEntry.create(request, key))

        return UploadCrashlogResponse.Success(id, deletionKey = key, crashyUrl = "https://crashy.net/${id.value}")
    }

    /**
     * Used for testing only
     */
    suspend fun getCrash(id: GetCrashRequest): ByteArray {
        return when (val result = logs.get(id)) {
            GetCrashlogResult.Archived -> result.toString().toByteArray()
            GetCrashlogResult.DoesNotExist -> result.toString().toByteArray()
            is GetCrashlogResult.Success -> result.log.copyLog()
        }
    }

    fun deleteCrash(request: DeleteCrashlogRequest): DeleteCrashResult {
        return logs.delete(request.id, request.key)
    }
}

