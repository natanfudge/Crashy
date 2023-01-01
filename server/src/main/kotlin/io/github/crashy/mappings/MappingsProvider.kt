package io.github.crashy.mappings

import io.github.crashy.mappings.forge.McpMappingsProvider
import io.github.crashy.mappings.forge.TsrgMappingsProvider
import java.nio.file.Path


class MappingsProvider(path: Path) {
    val cache = MappingsCache(path, size = 1_000_000) // 1MB cache

    suspend fun getTsrg(mcVersion: String): ByteArray? {
        return get(MappingsNamespace.Srg, mcVersion, build = null) { TsrgMappingsProvider.get(mcVersion) }
    }

    suspend fun getMcp(mcVersion: String, build: Int): ByteArray? {
        return get(MappingsNamespace.Mcp, mcVersion, build = null) { McpMappingsProvider.get(mcVersion, build) }
    }

    private suspend fun get(
        namespace: MappingsNamespace,
        mcVersion: String,
        build: Int? = null,
        fetcher: suspend () -> ByteArray?
    ): ByteArray? {
        val id = MappingsId(namespace, version = MappingsVersion(mcVersion, build = build))
        val cached = cache.get(id)
        if (cached != null) return cached
        val fetched = fetcher() ?: return null
        cache.store(id, fetched)
        return fetched
    }
}