package io.github.crashy.mappings

import io.github.crashy.mappings.tsrg.TsrgMappingsProvider
import java.nio.file.Path


class MappingsProvider(path: Path) {
    val cache = MappingsCache(path, size = 1_000_000) // 1MB cache

    suspend fun getTsrg(mcVersion: String): ByteArray? {
        val id =  MappingsId(namespace = MappingsNamespace.Srg, version = MappingsVersion(mcVersion, build = null))
        val cached = cache.get(id)
        if (cached != null) return cached
        val fetched = TsrgMappingsProvider.get(mcVersion) ?: return null
        cache.store(id, fetched)
        return fetched
    }
}