package io.github.crashy.crashlogs.api

import io.github.crashy.mappings.MappingsProvider
import io.ktor.http.*

//typealias GetTsrgRequest = String

sealed interface GetMappingsResponse : Response {
    class Success(override val bytes: ByteArray) : GetMappingsResponse, Response by textAsBytesResponse(bytes){
        override val extraHeaders: Map<String, String> = mapOf(
            "Cache-Control" to "public, max-age=604800, immutable"
        )
    }
    object NoSuchMinecraftVersion : GetMappingsResponse,
        Response by textResponse("No such Minecraft version", code = HttpStatusCode.NotFound)
}

class MappingsApi(private val mappings: MappingsProvider) {
    //TODO: optimize: parse mappings and only provide methods and classes (the cache should also only store methods/classes)
    //TODO: optimize: provide a filter and only return mappings fitting the filter
    suspend fun getTsrg(mcVersion: String): GetMappingsResponse {
        val tsrg = mappings.getTsrg(mcVersion)
        return responseOf(tsrg)
    }
    suspend fun getMcp(mcVersion: String, build: Int): GetMappingsResponse {
        val mcp = mappings.getMcp(mcVersion, build)
        return responseOf(mcp)
    }

    private fun responseOf(bytes:ByteArray?) : GetMappingsResponse {
        if (bytes != null) {
            return GetMappingsResponse.Success(bytes)
        } else return GetMappingsResponse.NoSuchMinecraftVersion
    }
}