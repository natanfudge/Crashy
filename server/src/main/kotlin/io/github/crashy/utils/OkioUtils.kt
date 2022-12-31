package io.github.crashy.utils

import okhttp3.internal.cache.DiskLruCache
import okio.Buffer
import java.nio.charset.Charset

fun DiskLruCache.Snapshot.read(index: Int): Buffer {
    val length = getLength(index)
    val source = getSource(index)
    val sink = Buffer()
    source.read(sink, length)
    return sink
}

fun DiskLruCache.Snapshot.readString(index: Int, charset: Charset = Charsets.UTF_8) =
    read(index).use { it.readString(charset) }
fun DiskLruCache.Snapshot.readBytes(index: Int) =
    read(index).use { it.readByteArray() }

fun DiskLruCache.Editor.writeString(index: Int, string: String, charset: Charset = Charsets.UTF_8) {
    Buffer().use { buffer ->
        buffer.writeString(string, charset)
        newSink(index).use { it.write(buffer, buffer.size) }
    }

}

fun DiskLruCache.Editor.writeBytes(index: Int, bytes: ByteArray) {
    Buffer().use { buffer ->
        buffer.write(bytes)
        newSink(index).use { it.write(buffer, buffer.size) }
    }

}

