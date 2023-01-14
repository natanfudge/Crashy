package io.github.crashy.crashlogs.api

import io.github.crashy.Crashy
import io.github.crashy.crashlogs.CrashlogEntry
import io.github.crashy.crashlogs.CrashlogId
import io.github.crashy.crashlogs.DeletionKey
import io.github.crashy.crashlogs.UncompressedLog
import io.ktor.http.*
import io.ktor.server.http.*
import kotlinx.serialization.Serializable

typealias UploadCrashlogRequest = UncompressedLog
typealias GetCrashRequest = CrashlogId

@Serializable
data class DeleteCrashlogRequest(val id: CrashlogId, val key: DeletionKey)


sealed interface UploadCrashResponse : StringResponse {

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
        override val string get() = Crashy.json.encodeToString(serializer(), this)
        override val statusCode: HttpStatusCode get() = HttpStatusCode.OK
        override val contentType get() = ContentType.Application.Json
    }

    /**
     *The compressed size of the crash is too large (>100KB). We don't allow this to avoid overloading the server/storage.
     */
    object CrashTooLargeError : UploadCrashResponse,
        StringResponse by textResponse("Too Large", HttpStatusCode.PayloadTooLarge)

    object MalformedCrashError : UploadCrashResponse,
        StringResponse by textResponse("Invalid Crash", HttpStatusCode.BadRequest)

    /**
     * Too many crashes were uploaded in the last day (>1MB). We don't allow this to avoid overloading the server/storage.
     */
    object RateLimitedError : UploadCrashResponse,
        StringResponse by textResponse("Rate Limited", HttpStatusCode.TooManyRequests)
}


sealed interface GetCrashResponse : Response {
    object Archived : GetCrashResponse, Response by textResponse("Archived", HttpStatusCode.OK)
    object DoesNotExist : GetCrashResponse, Response by textResponse("Does Not Exist", HttpStatusCode.NotFound)
    class Success(log: CrashlogEntry) : GetCrashResponse {
        override val bytes: ByteArray = log.compressedLog.bytes
        override val statusCode: HttpStatusCode = HttpStatusCode.OK
        override val encoding: Encoding = Encoding.Brotli
        override val contentType = ContentType.Text.Plain
        override val extraHeaders: Map<String, String> = mapOf(
            "Last-Modified" to log.metadata.uploadDate.toHttpDateString(),
            "Cache-Control" to "public, max-age=6048000, immutable"
        )
    }
}
