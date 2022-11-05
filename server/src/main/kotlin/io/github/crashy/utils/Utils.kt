package io.github.crashy.utils

import io.github.crashy.crashlogs.DeletionKey
import io.ktor.utils.io.*
import kotlinx.serialization.KSerializer
import kotlinx.serialization.builtins.serializer
import kotlinx.serialization.descriptors.SerialDescriptor
import kotlinx.serialization.encoding.Decoder
import kotlinx.serialization.encoding.Encoder
import java.io.ByteArrayOutputStream
import java.io.FileInputStream
import java.io.IOException
import java.nio.file.Path
import java.util.*
import java.util.zip.GZIPInputStream


object UUIDSerializer: KSerializer<UUID> {
    override val descriptor: SerialDescriptor = String.serializer().descriptor

    override fun deserialize(decoder: Decoder): UUID  = UUID.fromString(decoder.decodeString())

    override fun serialize(encoder: Encoder, value: UUID)  = encoder.encodeString(value.toString())
}

// decompress a Gzip file into a byte arrays
fun ByteArray.decompressGzip(): ByteArray {
    val output = ByteArrayOutputStream()
    GZIPInputStream(inputStream()).use { gis ->
        // copy GZIPInputStream to ByteArrayOutputStream
        val buffer = ByteArray(1024)
        var len: Int
        while (gis.read(buffer).also { len = it } > 0) {
            output.write(buffer, 0, len)
        }
    }
    return output.toByteArray()
}

private const val characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

fun randomString(length: Int) = buildString {
    repeat(length) {
        append(characters.random())
    }
}