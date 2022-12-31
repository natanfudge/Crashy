package io.github.crashy.mappings.tsrg

import io.github.crashy.mappings.MappingsVersion
import io.ktor.http.*
import kotlinx.coroutines.suspendCancellableCoroutine
import okhttp3.*
import okhttp3.HttpUrl.Companion.toHttpUrl
import okio.IOException
import java.io.InputStream
import java.util.zip.ZipEntry
import java.util.zip.ZipInputStream
import kotlin.coroutines.resume

/**
 * Forge doesn't support CORS starting from 1.12.2 so we need to supply TSRG from the server
 */
object TsrgMappingsProvider {
    private val client = OkHttpClient()
    suspend fun get(mcVersion: String): ByteArray? {
        val url = "https://files.minecraftforge.net/maven/de/oceanlabs/mcp/mcp_config/${mcVersion}/mcp_config-${mcVersion}.zip"
        val response = client.get(url)
        if(response.code == HttpStatusCode.NotFound.value) return null
        val bytes = response.body.byteStream().use {
            //TODO: tsrg2 has different path i think
            it.getAtPath("config/joined.tsrg")
        } ?: error("Couldn't find tsrg mappings at config/joined.tsrg!")

        return bytes
    }
}

private fun InputStream.getAtPath(path: String): ByteArray? {
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

private suspend fun OkHttpClient.get(url: String): Response = suspendCancellableCoroutine{ cont ->
    newCall(Request(url.toHttpUrl())).enqueue(object: Callback{
        override fun onFailure(call: Call, e: IOException) {
            cont.cancel(e)
        }

        override fun onResponse(call: Call, response: Response) {
            cont.resume(response)
        }
    })
}