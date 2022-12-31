package io.github.crashy.api

import HttpTest.Companion.httpTest
import TestClass
import io.github.crashy.api.utils.TestHttpResponse
import io.github.crashy.mappings.tsrg.TsrgMappingsProvider
import kotlinx.coroutines.runBlocking
import org.junit.Test
import strikt.api.expectThat
import strikt.assertions.isEqualTo
import java.net.HttpURLConnection
import kotlin.test.assertEquals

class TsrgApiTest: TestClass {
    override val useRealServer: Boolean = false

    private fun getAtVersion(version: String): String? = runBlocking {
        with(httpTest()){
            getTsrg(version).body
        }
    }

    @Test
    fun get1_12_2() {
        val mappings = getAtVersion("1.12.2")!!
        expectThat(mappings.take(10)).isEqualTo("a net/mine")
    }

    @Test
    fun get1_18_1(){
        val mappings = getAtVersion("1.18.1")!!
        expectThat(mappings.take(10)).isEqualTo("tsrg2 obf ")
    }
    @Test
    fun getBS(){
        val mappings = getAtVersion("69420")
        expectThat(mappings).isEqualTo("No such Minecraft version")
    }

    @Test
    fun getTsrgTest(): Unit = runBlocking {
        with(httpTest()) {
            getTsrg(mcVersion = "1.12.2")
        }
    }
}