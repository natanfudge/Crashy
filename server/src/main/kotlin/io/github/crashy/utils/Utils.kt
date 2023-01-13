package io.github.crashy.utils

import com.aayushatharva.brotli4j.Brotli4jLoader
import io.github.crashy.Crashy
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
import java.util.concurrent.atomic.AtomicBoolean
import java.util.zip.GZIPInputStream
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

// decompress a Gzip file into a byte arrays
fun ByteArray.decompressGzip(): ByteArray {
    return GZIPInputStream(inputStream()).buffered().use { stream ->
        stream.readAllBytes()
    }
}

private val brotliInitialized = AtomicBoolean(false)
fun ByteArray.decompressBrotli(): ByteArray {
    if (brotliInitialized.compareAndSet(false, true)) {
        Brotli4jLoader.ensureAvailability()
    }
    return com.aayushatharva.brotli4j.decoder.Decoder.decompress(this).decompressedData
}

private const val characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

fun randomString(length: Int) = buildString {
    repeat(length) {
        append(characters.random())
    }
}

fun getResource(path: String): String? = Crashy::class.java.getResourceAsStream(path)?.readBytes()?.toString(Charset.defaultCharset())

fun Path.lastAccessInstant() = readAttributes<BasicFileAttributes>().lastAccessTime().toInstant()