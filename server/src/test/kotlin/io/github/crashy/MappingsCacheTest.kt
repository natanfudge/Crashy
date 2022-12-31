package io.github.crashy

import io.github.crashy.mappings.MappingsCache
import io.github.crashy.mappings.MappingsId
import io.github.crashy.mappings.MappingsNamespace
import io.github.crashy.mappings.MappingsVersion
import strikt.api.expectThat
import strikt.assertions.isEqualTo
import java.nio.file.Files
import kotlin.test.Test

class MappingsCacheTest {
    @Test
    fun testMappingsCache() {
        val path = Files.createTempDirectory("mappings")
        val cache = MappingsCache(path, 100)

        with(cache) {
            val id1 = MappingsId(MappingsNamespace.Yarn, MappingsVersion("1.19", 3))
            val id2 = MappingsId(MappingsNamespace.Yarn, MappingsVersion("1.19", 1))
            val id3 = MappingsId(MappingsNamespace.Yarn, MappingsVersion("1.19.2", 3))
            val id4 = MappingsId(MappingsNamespace.MojMap, MappingsVersion("1.19", null))
            val id5 = MappingsId(MappingsNamespace.Mcp, MappingsVersion("1.18", 1))
            val id6 = MappingsId(MappingsNamespace.Mcp, MappingsVersion("1.18.1", 1))

            val mappings1 = "12345"
            val mappings2 = "678910"
            val mappings3 = "112131415"
            val mappings4 = "1617181920"
            val mappings5 = "2122232425"
            val mappings6 = "2122232425".repeat(7)

            expectNull(id1)
            expectNull(id2)
            expectNull(id3)
            expectNull(id4)
            expectNull(id5)

            testInsertion(id1, mappings1)
            testInsertion(id2, mappings2)
            testInsertion(id3, mappings3)
            testInsertion(id4, mappings4)
            testInsertion(id5, mappings5)
            testInsertion(id6, mappings6)
            expectNull(id1)
            expectNull(id2)
            expectValue(id3, mappings3)
            expectValue(id4, mappings4)
            expectValue(id5, mappings5)
            expectValue(id6, mappings6)
        }


    }

    private fun MappingsCache.expectValue(
        id: MappingsId,
        mappings: String
    ) = expectThat(get(id)).isEqualTo(mappings.toByteArray())

    private fun MappingsCache.testInsertion(
        id: MappingsId,
        mappings: String
    ) {
        store(id, mappings.toByteArray())
        Thread.sleep(100)
         expectThat(get(id)).isEqualTo(mappings.toByteArray())
    }

    context (MappingsCache)
    private fun expectNull(id: MappingsId) {
        expectThat(get(id)).isEqualTo(null)
    }
}