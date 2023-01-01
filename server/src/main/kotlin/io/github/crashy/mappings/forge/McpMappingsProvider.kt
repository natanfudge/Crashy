package io.github.crashy.mappings.forge

import io.ktor.http.*

object McpMappingsProvider {
    suspend fun get(mcVersion: String, build: Int): ByteArray? {
        val url = "https://files.minecraftforge.net/maven/de/oceanlabs/mcp/mcp_stable/${build}-${mcVersion}/mcp_stable-${build}-${mcVersion}.zip"
        val response = CorsProxy.httpClient.get(url)
        if(response.code == HttpStatusCode.NotFound.value) return null
        val bytes = response.body.byteStream().use {
            it.getAtPath("methods.csv")
        } ?: error("Couldn't find mcp mappings at methods.csv!")

        return bytes
    }
}