package io.github.crashy

import io.github.crashy.mappings.forge.McpMappingsProvider
import io.github.crashy.mappings.forge.TsrgMappingsProvider
import kotlinx.coroutines.runBlocking
import org.junit.Test
import strikt.api.expectThat
import strikt.assertions.isEqualTo

class McpTest {
    @Test
    fun get1_12(): Unit = runBlocking {
        val mappings = McpMappingsProvider.get("1.12",39)!!.decodeToString()
        expectThat(mappings.take(36).replace("\r","")) .isEqualTo("searge,name,side,desc\nfunc_100011_g")
    }
    @Test
    fun get1_14_4(): Unit = runBlocking{
        val mappings = McpMappingsProvider.get("1.14.4",58)!!.decodeToString()
        expectThat(mappings.take(10)).isEqualTo("searge,nam")
    }
    @Test
    fun getBS(): Unit = runBlocking{
        val mappings = McpMappingsProvider.get("69420",123123)
        expectThat(mappings).isEqualTo(null)
    }
}