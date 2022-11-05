package io.github.crashy.crashlogs

import com.aayushatharva.brotli4j.decoder.Decoder
import com.aayushatharva.brotli4j.decoder.DecoderJNI.Status.DONE
import com.aayushatharva.brotli4j.encoder.Encoder
import io.github.crashy.utils.UUIDSerializer
import io.github.crashy.utils.randomString
import io.ktor.http.*
import kotlinx.serialization.Serializable
import org.jetbrains.annotations.TestOnly
import java.nio.file.Path
import java.util.*
import kotlin.io.path.nameWithoutExtension
import kotlin.io.path.readBytes
import kotlin.io.path.writeBytes
import kotlin.math.min
import kotlin.random.Random

@JvmInline
@Serializable
value class DeletionKey private constructor(private val value: String) {
    override fun toString(): String = value

    companion object {
        private const val Length = 6
        fun generate() = DeletionKey(randomString(Length))
    }
}


@JvmInline
@Serializable
value class CrashlogId private constructor(@Serializable(with = UUIDSerializer::class) val value: UUID) {
    override fun toString(): String = value.toString()

    companion object {
        fun fromFileName(path: Path) = CrashlogId(UUID.fromString(path.nameWithoutExtension))
        fun generate() = CrashlogId(UUID.randomUUID())

        fun fromString(string: String) = CrashlogId(UUID.fromString(string))
    }
}

@Serializable
data class CrashlogMetadata(val deletionKey: DeletionKey, val header: CrashlogHeader)

@Serializable
data class CrashlogHeader(val title: String, val exceptionDescription: String)

/**
 * We only use brotli compression
 */
@JvmInline
@Serializable
value class CompressedLog private constructor(@get:TestOnly val bytes: ByteArray) {
    companion object {
        fun createRandom() = CompressedLog(Random.nextBytes(100))
        fun readFromFile(file: Path) = CompressedLog(file.readBytes())

        fun compress(bytes: ByteArray) = CompressedLog(Encoder.compress(bytes))
    }

    fun writeToFile(file: Path) {
        file.writeBytes(bytes)
    }

    fun decompress(): UncompressedLog {
        val result = Decoder.decompress(bytes)
        when (result.resultStatus) {
            DONE -> return UncompressedLog(result.decompressedData)
            else -> throw IllegalArgumentException("Failed to decompress log: ${result.resultStatus}")
        }
    }
}

@JvmInline
value class UncompressedLog(private val log: ByteArray) {
    fun compress(): CompressedLog {
        return CompressedLog.compress(log)
    }

    val size get() = log.size
    fun decodeToString() = log.decodeToString()
    fun peek(bytes: Int) = log.copyOfRange(0, min(bytes, size)).decodeToString()
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
