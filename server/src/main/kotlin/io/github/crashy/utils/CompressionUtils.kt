package io.github.crashy.utils

import com.aayushatharva.brotli4j.Brotli4jLoader
import com.aayushatharva.brotli4j.decoder.Decoder
import com.aayushatharva.brotli4j.encoder.Encoder
import java.util.concurrent.atomic.AtomicBoolean
import java.util.zip.GZIPInputStream

// decompress a Gzip file into a byte arrays
fun ByteArray.decompressGzip(): ByteArray {
    return GZIPInputStream(inputStream()).buffered().use { stream ->
        stream.readAllBytes()
    }
}


private val brotliInitialized = AtomicBoolean(false)
fun ByteArray.decompressBrotli(): ByteArray {
    ensureBrotliInitialized()
    return Decoder.decompress(this).decompressedData
}

private fun ensureBrotliInitialized() {
    if (brotliInitialized.compareAndSet(false, true)) {
        Brotli4jLoader.ensureAvailability()
    }
}

fun ByteArray.compressBrotli(): ByteArray {
    ensureBrotliInitialized()
    return Encoder.compress(this)
}