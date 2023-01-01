package io.github.crashy.api

import HttpTest.Companion.httpTest
import TestClass
import kotlinx.coroutines.runBlocking
import org.junit.Test
import strikt.api.expectThat
import strikt.assertions.isEqualTo

class McpApiTest: TestClass {
    override val useRealServer: Boolean = false

    private fun getAtVersion(version: String, build: Int): String? = runBlocking {
        with(httpTest()){
            getMcp(version, build).body
        }
    }

    @Test
    fun get1_12() {
        val mappings = getAtVersion("1.12",39)!!
        expectThat(mappings.take(36).replace("\r","")) .isEqualTo("searge,name,side,desc\nfunc_100011_g")
    }

    @Test
    fun get1_14_4(){
        val mappings = getAtVersion("1.14.4",58)!!
        expectThat(mappings.take(10)).isEqualTo("searge,nam")
    }
    @Test
    fun getBS(){
        val mappings = getAtVersion("69420",123123)
        expectThat(mappings).isEqualTo("No such Minecraft version")
    }

    @Test
    fun getTsrgTest(): Unit = runBlocking {
        with(httpTest()) {
            getTsrg(mcVersion = "1.12.2")
        }
    }
}