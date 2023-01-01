package io.github.crashy

import io.github.crashy.mappings.forge.TsrgMappingsProvider
import kotlinx.coroutines.runBlocking
import org.junit.Test
import strikt.api.expectThat
import strikt.assertions.isEqualTo

class TsrgTest {
    @Test
    fun get1_12_2(): Unit = runBlocking {
        val mappings = TsrgMappingsProvider.get("1.12.2")!!.decodeToString()
        expectThat(mappings.take(10)).isEqualTo("a net/mine")
    }
    @Test
    fun get1_18_1(): Unit = runBlocking{
        val mappings = TsrgMappingsProvider.get("1.18.1")!!.decodeToString()
        expectThat(mappings.take(10)).isEqualTo("tsrg2 obf ")
    }
    @Test
    fun getBS(): Unit = runBlocking{
        val mappings = TsrgMappingsProvider.get("69420")
        expectThat(mappings).isEqualTo(null)
    }
}