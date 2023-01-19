package io.github.crashy.utils

import io.github.crashy.Crashy
import kotlinx.coroutines.suspendCancellableCoroutine
import kotlinx.serialization.KSerializer
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

    override fun deserialize(decoder: Decoder): UUID = UUID.fromString(decoder.decodeString())

    override fun serialize(encoder: Encoder, value: UUID) = encoder.encodeString(value.toString())
}

object InstantSerializer : KSerializer<Instant> {
    override val descriptor: SerialDescriptor = Long.serializer().descriptor

    override fun deserialize(decoder: Decoder): Instant = Instant.ofEpochMilli(decoder.decodeLong())

    override fun serialize(encoder: Encoder, value: Instant) = encoder.encodeLong(value.toEpochMilli())
}


private const val characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

fun randomString(length: Int) = buildString {
    repeat(length) {
        append(characters.random())
    }
}

fun getResource(path: String): String? =
    Crashy::class.java.getResourceAsStream(path)?.readBytes()?.toString(Charset.defaultCharset())

fun Path.lastAccessInstant() = readAttributes<BasicFileAttributes>().lastAccessTime().toInstant()

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

