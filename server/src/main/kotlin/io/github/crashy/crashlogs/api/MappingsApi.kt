package io.github.crashy.crashlogs.api

import io.github.crashy.mappings.MappingsProvider
import io.ktor.http.*
import io.ktor.server.http.*

//typealias GetTsrgRequest = String

sealed interface GetTsrgResponse : Response {
    class Success(override val bytes: ByteArray) : GetTsrgResponse, Response by textAsBytesResponse(bytes){
        override val extraHeaders: Map<String, String> = mapOf(
            "Cache-Control" to "public, max-age=604800, immutable"
        )
    }
    object NoSuchMinecraftVersion : GetTsrgResponse,
        Response by textResponse("No such Minecraft version", code = HttpStatusCode.NotFound)
}

class MappingsApi(private val mappings: MappingsProvider) {
    //TODO: optimize: parse mappings and only provide methods and classes (the cache should also only store methods/classes)
    //TODO: optimize: provide a filter and only return mappings fitting the filter
    suspend fun getTsrg(mcVersion: String): GetTsrgResponse {
        val tsrg = mappings.getTsrg(mcVersion)
        if (tsrg != null) {
            return GetTsrgResponse.Success(tsrg)
        } else return GetTsrgResponse.NoSuchMinecraftVersion
    }
}