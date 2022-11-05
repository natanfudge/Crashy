package io.github.crashy.crashlogs

import io.github.crashy.CrashyJson
import io.github.crashy.utils.UUIDSerializer
import io.ktor.http.*
import kotlinx.serialization.Serializable
import kotlinx.serialization.decodeFromString
import java.nio.file.Path
import java.util.*
import kotlin.io.path.*

@Serializable
inline class DeletionKey private constructor(private val value: String) {
    override fun toString(): String = value

    companion object {
        private const val Length = 6
        private const val characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
        fun generate() = DeletionKey(buildString {
            repeat(Length) {
                append(characters.random())
            }
        })
    }
}




@Serializable
inline class CrashlogId private constructor(@Serializable(with = UUIDSerializer::class) val value: UUID) {
    override fun toString(): String = value.toString()

    companion object {
        fun fromFileName(path: Path) = CrashlogId(UUID.fromString(path.nameWithoutExtension))
        fun generate() = CrashlogId(UUID.randomUUID())

        fun fromString(string: String) = CrashlogId(UUID.fromString(string))
    }
}

@Serializable
data class CrashlogMetadata(val deletionKey: DeletionKey, val title: String)

/**
 * We only use brotli compression
 */
@Serializable
inline class CompressedLog private constructor(private val bytes: ByteArray) {
    companion object {
        fun readFromFile(file: Path) = CompressedLog(file.readBytes())
    }
    fun writeToFile(file:Path) {
        file.writeBytes(bytes)
    }
    fun decompress(): UncompressedLog {
        TODO()
    }
}

inline class UncompressedLog(private val log: ByteArray) {
    fun compress(): CompressedLog {
        TODO()
    }
    val size get() = log.size
    fun decodeToString() = log.decodeToString()
}

@Serializable
class CrashlogEntry(val compressedLog: CompressedLog, val metadata: CrashlogMetadata) {
    companion object
}

enum class DeleteCrashResult(override val statusCode: HttpStatusCode) : Response {
    Success(HttpStatusCode.OK),
    NoSuchId(HttpStatusCode.NotFound),
    IncorrectDeletionKey(HttpStatusCode.Unauthorized);

    override fun responseString() = name
}
