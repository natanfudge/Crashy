package io.github.crashy.crashlogs

import aws.smithy.kotlin.runtime.content.ByteStream
import aws.smithy.kotlin.runtime.content.toByteArray
import io.github.crashy.utils.UUIDSerializer
import io.github.crashy.utils.readNBytes
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json
import java.nio.file.Path
import java.util.*
import kotlin.io.path.appendBytes
import kotlin.io.path.nameWithoutExtension
import kotlin.io.path.readBytes
import kotlin.io.path.writeBytes
import kotlin.random.Random

@Serializable
inline class DeletionKey private constructor(private val value: String) {
    companion object {
        //TODO: see how much this is and hardcode it
        val ByteAmount = generate().toByteArray().size

        const val Length = 6
        private const val characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
        fun generate() = DeletionKey(buildString {
            repeat(Length) {
                append(characters.random())
            }
        })

        fun fromByteArray(array: ByteArray) = DeletionKey(array.toString(charset = Charsets.US_ASCII))
    }

    // We only use ascii values so using ascii here is fine, which also means the amount of bytes is constant
    fun toByteArray() = value.toByteArray(charset = Charsets.US_ASCII)
}

val CrashyJson = Json


@Serializable
inline class CrashlogId private constructor(@Serializable(with = UUIDSerializer::class) val value: UUID) {
    companion object {
        fun fromFileName(path: Path) = CrashlogId(UUID.fromString(path.nameWithoutExtension))
        fun generate() = CrashlogId(UUID.randomUUID())

        fun fromString(string: String) = CrashlogId(UUID.fromString(string))
    }
}


interface CrashlogEntry {
    fun copyLog(): ByteArray
    val deletionKey: DeletionKey
    fun writeToFile(path: Path)

    class ContiguousArrayBacked(val bytes: ByteArray) : CrashlogEntry {
        override fun writeToFile(path: Path) {
            path.writeBytes(bytes)
        }

        override fun copyLog(): ByteArray = bytes.copyOfRange(DeletionKey.ByteAmount, bytes.size)

        override val deletionKey: DeletionKey = DeletionKey.fromByteArray(bytes.copyOfRange(0, DeletionKey.ByteAmount))
    }

    private class SplitBacked(override val deletionKey: DeletionKey, val log: ByteArray) : CrashlogEntry {
        override fun writeToFile(path: Path) {
            path.writeBytes(deletionKey.toByteArray())
            path.appendBytes(log)
        }

        override fun copyLog(): ByteArray = log
    }

    companion object {
        fun read(path: Path): CrashlogEntry.ContiguousArrayBacked {
            return ContiguousArrayBacked(path.readBytes())
        }

        suspend fun read(byteStream: ByteStream): CrashlogEntry.ContiguousArrayBacked {
            return ContiguousArrayBacked(byteStream.toByteArray())
        }

        fun create(compressedLog: ByteArray, deletionKey: DeletionKey): CrashlogEntry =
            SplitBacked(deletionKey, compressedLog)

        fun createRandom() = create(Random.nextBytes(100), DeletionKey.generate())

        fun peekDeletionKey(path: Path): DeletionKey {
            return DeletionKey.fromByteArray(path.readNBytes(DeletionKey.Length))
        }
    }


}

enum class DeleteCrashResult {
    Success,
    NoSuchId,
    IncorrectDeletionKey
}
