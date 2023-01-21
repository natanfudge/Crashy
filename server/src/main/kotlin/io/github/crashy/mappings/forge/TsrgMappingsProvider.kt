package io.github.crashy.mappings.forge

import io.ktor.http.*

/**
 * Forge doesn't support CORS starting from 1.12.2 so we need to supply TSRG from the server
 */
object TsrgMappingsProvider {
    suspend fun get(mcVersion: String): ByteArray? {
        val url =
            "https://files.minecraftforge.net/maven/de/oceanlabs/mcp/mcp_config/${mcVersion}/mcp_config-${mcVersion}.zip"
        val response = CorsProxy.httpClient.get(url)
        if (response.code == HttpStatusCode.NotFound.value) return null
        val bytes = response.body.use { b ->
            b.byteStream().use {
                it.getAtPath("config/joined.tsrg")
            } ?: error("Couldn't find tsrg mappings at config/joined.tsrg!")
        }
        return bytes
    }
}


