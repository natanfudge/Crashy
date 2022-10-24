package io.github.crashy.crashlogs

import io.github.crashy.crashlogs.storage.CrashlogId
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json


typealias UploadCrashlogRequest = ByteArray

@Serializable
inline class DeletionKey private constructor(val value: String) {
    companion object {
        const val Length = 6
        private val characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
        fun generate() = buildString {
            repeat(Length) {
                append(characters.random())
            }
        }
    }
}
val CrashyJson = Json
sealed interface UploadCrashlogResponse {
    fun responseString(): String
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
        ): UploadCrashlogResponse {
        override fun responseString() = CrashyJson.encodeToString(serializer(), this)
    }
//    "Too Large" | "Invalid Crash"
    /**
     *The compressed size of the crash is too large (>100KB). We don't allow this to avoid overloading the server/storage.
     */
    object CrashTooLargeError: UploadCrashlogResponse {
        override fun responseString() = "Too Large"
    }

    /**
     * The crash is in an invalid format. We don't allow storing just any text, because that's not the purpose of Crashy.
     */
    object InvalidCrashError: UploadCrashlogResponse {
        override fun responseString(): String  = "Invalid Crash"
    }
}



class CrashlogApi {
    fun uploadCrash(request: UploadCrashlogRequest): UploadCrashlogResponse {

    }
}

