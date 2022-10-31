package io.github.crashy.api

import ClientLibrary
import HttpTest
import HttpTest.Companion.httpTest
import TestClass
import TestCrash
import TestHttpResponse
import UploadCrashResponse
import getCrashLogContents
import kotlinx.coroutines.runBlocking
import kotlinx.serialization.json.Json
import org.junit.Test
import java.net.HttpURLConnection
import kotlin.test.assertEquals

class EndpointTesting : TestClass {
    override val useRealServer: Boolean = false

    private inline fun withBothClients(
        directApi: Boolean = true,
        cache: Boolean = true,
        useGzip: Boolean = true, code: HttpTest.() -> Unit
    ) {
        with(httpTest( directApi, cache, useGzip, ClientLibrary.OkHttp), code)
        with(httpTest( directApi, cache, useGzip, ClientLibrary.Apache), code)
    }

    //TODO: test rate limiting
    @Test
    fun `Invalid uploadCrash requests`() = runBlocking {
//        val response2 = httpTest(useGzip = false).uploadCrash(TestCrash.Fabric)
//        assertEquals(HttpURLConnection.HTTP_UNSUPPORTED_TYPE, response2.code)

        with(httpTest()) {
//            val response1 = uploadCrash(TestCrash.Fabric, headers = mapOf("content-encoding" to "gzip"))
//            assertEquals(HttpURLConnection.HTTP_UNSUPPORTED_TYPE, response1.code)

            val response3 = uploadCrash(TestCrash.Huge)
            assertEquals(HttpURLConnection.HTTP_ENTITY_TOO_LARGE, response3.code)

//            val response4 = uploadCrash(TestCrash.Malformed)
//            assertEquals(HttpURLConnection.HTTP_BAD_REQUEST, response4.code)
        }
    }

    @Test
    fun `Upload Crash`() = runBlocking {
        withBothClients {
            val (response, parsed) = uploadCrashAndParse(TestCrash.Fabric)
            assertEquals(HttpURLConnection.HTTP_OK, response.code)

            println("ID = ${parsed.crashId}, code = ${parsed.key}")
        }

    }

    @Test
    fun `Invalid getCrash requests`() = runBlocking {
        with(httpTest()) {
            for (id in listOf(null, "", "/")) {
                val response1 = getCrash(id)
                assertEquals(HttpURLConnection.HTTP_BAD_REQUEST, response1.code)
            }

            val response4 = getCrash("asdfasdf")
            assertEquals(HttpURLConnection.HTTP_NOT_FOUND, response4.code)
        }
    }

    @Test
    fun `Get Crash`() = runBlocking {
        with(httpTest()) {
            val (_, uploadResponse) = uploadCrashAndParse(TestCrash.Fabric)

            val getResponse = getCrash(uploadResponse.crashId)
            val getResponseBody = getResponse.body
            assertEquals(getCrashLogContents(TestCrash.Fabric), getResponseBody)
        }
    }


    private suspend fun HttpTest.uploadCrashAndParse(crash: TestCrash): Pair<TestHttpResponse, UploadCrashResponse> {
        val uploadResponse = uploadCrash(crash)
        return uploadResponse to Json.decodeFromString(UploadCrashResponse.serializer(), uploadResponse.body!!)
    }

    @Test
    fun `Invalid deleteCrash requests`() = runBlocking {
        with(httpTest()) {
            val response1 = deleteCrash(null, "asdf")
            assertEquals(HttpURLConnection.HTTP_BAD_REQUEST, response1.code)
            val response2 = deleteCrash("asdf", null)
            assertEquals(HttpURLConnection.HTTP_BAD_REQUEST, response2.code)
            val response3 = deleteCrash(null, null)
            assertEquals(HttpURLConnection.HTTP_BAD_REQUEST, response3.code)

            val response4 = deleteCrash("asdf", "asdf")
            assertEquals(HttpURLConnection.HTTP_NOT_FOUND, response4.code)

            val uploadResponse = uploadCrash(TestCrash.Fabric)
            assertEquals(HttpURLConnection.HTTP_OK, uploadResponse.code)
            val uploadResponseBody =
                Json.decodeFromString(UploadCrashResponse.serializer(), uploadResponse.body!!)

            val deleteResponse = deleteCrash(uploadResponseBody.crashId, "wrong key")
            assertEquals(HttpURLConnection.HTTP_UNAUTHORIZED, deleteResponse.code)
        }
    }

    @Test
    fun `Delete Crash`() = runBlocking {
        with(httpTest()) {
            val uploadResponse = uploadCrash(TestCrash.Fabric)
            assertEquals(HttpURLConnection.HTTP_OK, uploadResponse.code)
            val uploadResponseBody =
                Json.decodeFromString(UploadCrashResponse.serializer(), uploadResponse.body!!)

            val deleteResponse = deleteCrash(uploadResponseBody.crashId, uploadResponseBody.key)
            assertEquals(HttpURLConnection.HTTP_OK, deleteResponse.code)

            val getResponse = getCrash(uploadResponseBody.crashId)
            assertEquals(HttpURLConnection.HTTP_NOT_FOUND, getResponse.code)
        }
    }

    @Test
    fun `Download database`() = runBlocking {
        with(httpTest(local = false)) {
            val unauthorizedResponse = downloadDatabaseOverview("blah")
            assertEquals(HttpURLConnection.HTTP_UNAUTHORIZED, unauthorizedResponse.code)
        }
    }
}
