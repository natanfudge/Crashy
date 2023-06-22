package io.github.crashy.utils

import io.github.crashy.Crashy
import io.github.crashy.crashlogs.uUIDFromIdString
import kotlinx.coroutines.suspendCancellableCoroutine
import kotlinx.serialization.KSerializer
import kotlinx.serialization.Serializable
import kotlinx.serialization.builtins.serializer
import kotlinx.serialization.descriptors.SerialDescriptor
import kotlinx.serialization.encoding.Decoder
import kotlinx.serialization.encoding.Encoder
import java.nio.charset.Charset
import java.nio.file.Path
import java.nio.file.attribute.BasicFileAttributes
import java.time.Instant
import java.util.*
import java.util.concurrent.CompletableFuture
import java.util.concurrent.CompletionException
import kotlin.coroutines.resume
import kotlin.io.path.readAttributes


object UUIDSerializer : KSerializer<UUID> {
    override val descriptor: SerialDescriptor = String.serializer().descriptor

    override fun deserialize(decoder: Decoder): UUID = uUIDFromIdString(decoder.decodeString())

    override fun serialize(encoder: Encoder, value: UUID) = encoder.encodeString(value.toString())
}

object InstantSerializer : KSerializer<Instant> {
    override val descriptor: SerialDescriptor = Long.serializer().descriptor

    override fun deserialize(decoder: Decoder): Instant = Instant.ofEpochMilli(decoder.decodeLong())

    override fun serialize(encoder: Encoder, value: Instant) = encoder.encodeLong(value.toEpochMilli())
}



@Suppress("unused")
@Serializable
class ThrowableJsonRepresentation(val className: String, val message: String, val stacktrace: String)

object OneWayThrowableSerializer : KSerializer<Throwable> {
    private val serializer = ThrowableJsonRepresentation.serializer()
    override val descriptor: SerialDescriptor = serializer.descriptor

    override fun deserialize(decoder: Decoder): Throwable {
        throw UnsupportedOperationException("OneWayThrowableSerializer only serializes")
    }

    override fun serialize(encoder: Encoder, value: Throwable) {
        serializer.serialize(
            encoder,
            ThrowableJsonRepresentation(value::class.qualifiedName!!, value.message ?: "", value.stackTraceToString())
        )
    }

}


private const val characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

fun randomString(length: Int) = buildString {
    repeat(length) {
        append(characters.random())
    }
}

fun getResource(path: String): String? =
    Crashy::class.java.getResourceAsStream(path)?.readBytes()?.toString(Charset.defaultCharset())

//

suspend fun <T> CompletableFuture<T>.suspendResult(): Result<T> = suspendCancellableCoroutine { cont ->
    whenCompleteAsync { value, e ->
        if (value != null) {
            cont.resume(Result.success(value))
        } else {
            val error = if (e is CompletionException) {
                e.cause!!
            } else e
            cont.resume(Result.failure(error))
        }
    }
}

suspend fun <T> CompletableFuture<T>.suspend(): T {
    return suspendResult().getOrThrow()
}

