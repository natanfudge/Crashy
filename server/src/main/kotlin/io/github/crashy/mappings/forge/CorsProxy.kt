package io.github.crashy.mappings.forge

import kotlinx.coroutines.suspendCancellableCoroutine
import okhttp3.*
import okhttp3.HttpUrl.Companion.toHttpUrl
import java.io.IOException
import java.io.InputStream
import java.util.zip.ZipEntry
import java.util.zip.ZipInputStream
import kotlin.coroutines.resume

object CorsProxy {
    val httpClient = OkHttpClient()
}

 suspend fun OkHttpClient.get(url: String): Response = suspendCancellableCoroutine{ cont ->
    newCall(Request(url.toHttpUrl())).enqueue(object: Callback {
        override fun onFailure(call: Call, e: IOException) {
            cont.cancel(e)
        }

        override fun onResponse(call: Call, response: Response) {
            cont.resume(response)
        }
    })
}

fun InputStream.getAtPath(path: String): ByteArray? {
    ZipInputStream(this).use {
        var entry: ZipEntry? = it.nextEntry
        while(entry != null){
            if(entry.name == path) {
                return it.readNBytes(entry.size.toInt())
            }
            entry = it.nextEntry
        }
        return null
    }
}
