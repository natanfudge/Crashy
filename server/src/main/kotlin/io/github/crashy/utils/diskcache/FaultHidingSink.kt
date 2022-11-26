package io.github.crashy.utils.diskcache


import java.io.IOException
import okio.Buffer
import okio.ForwardingSink
import okio.Sink

/** A sink that never throws IOExceptions, even if the underlying sink does. */
internal open class FaultHidingSink(
    delegate: Sink,
    val onException: (IOException) -> Unit
) : ForwardingSink(delegate) {
    private var hasErrors = false

    override fun write(source: Buffer, byteCount: Long) {
        if (hasErrors) {
            source.skip(byteCount)
            return
        }
        try {
            super.write(source, byteCount)
        } catch (e: IOException) {
            hasErrors = true
            onException(e)
        }
    }

    override fun flush() {
        if (hasErrors) {
            return
        }
        try {
            super.flush()
        } catch (e: IOException) {
            hasErrors = true
            onException(e)
        }
    }

    override fun close() {
        if (hasErrors) {
            return
        }
        try {
            super.close()
        } catch (e: IOException) {
            hasErrors = true
            onException(e)
        }
    }
}
