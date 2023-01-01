package io.github.crashy.mappings.forge

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
    suspend fun get(mcVersion: String): ByteArray? {
        val url = "https://files.minecraftforge.net/maven/de/oceanlabs/mcp/mcp_config/${mcVersion}/mcp_config-${mcVersion}.zip"
        val response = CorsProxy.httpClient.get(url)
        if(response.code == HttpStatusCode.NotFound.value) return null
        val bytes = response.body.byteStream().use {
            it.getAtPath("config/joined.tsrg")
        } ?: error("Couldn't find tsrg mappings at config/joined.tsrg!")
        return bytes
    }
}


