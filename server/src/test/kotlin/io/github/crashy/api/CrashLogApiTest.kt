package io.github.crashy.api

import ClientLibrary
import HttpTest
import HttpTest.Companion.httpTest
import TestCrash
import getCrashLogContents
import io.github.crashy.api.utils.TestHttpResponse
import io.github.crashy.crashlogs.api.UploadCrashResponse
import io.github.crashy.utils.getResource
import kotlinx.coroutines.runBlocking
import kotlinx.serialization.json.Json
import org.junit.FixMethodOrder
import org.junit.Test
import org.junit.runners.MethodSorters
import strikt.api.expectThat
import strikt.assertions.isEqualTo
import java.net.HttpURLConnection
import java.util.*
import kotlin.test.assertEquals

@FixMethodOrder(MethodSorters.NAME_ASCENDING)
class CrashLogApiTest {
    private inline fun withBothClients(
        cache: Boolean = true,
        useGzip: Boolean = true, code: HttpTest.() -> Unit
    ) {
        with(httpTest(cache, useGzip, ClientLibrary.OkHttp), code)
        with(httpTest(cache, useGzip, ClientLibrary.Apache), code)
    }

    @Test
    // Run test last (that's why we have ZZ at the start) because afterwards our IP will be blocked from uploading.
    fun `ZZInvalid uploadCrash requests`(): Unit = runBlocking {
        with(httpTest()) {
            val response3 = uploadCrash(TestCrash.Huge)
            assertEquals(HttpURLConnection.HTTP_ENTITY_TOO_LARGE, response3.code)

            val response4 = uploadCrash(TestCrash.Malformed)
            assertEquals(HttpURLConnection.HTTP_BAD_REQUEST, response4.code)

//            repeat(100) {
//                // Load the server with loads of trash
//                uploadCrash(TestCrash.Fabric)
//            }

            // Rate limited
//            expectThat(uploadCrash(TestCrash.Fabric)).get(TestHttpResponse::code).isEqualTo(429)

        }
    }

    @Test
    fun `Firebase pass allows bypassing rate limiting`(): Unit = runBlocking {
        with(httpTest()) {
            repeat(100) {
                expectThat(uploadCrash(TestCrash.Fabric, headers = mapOf("firebase-pass" to getResource("/secrets/firebase_pass.txt")!!)))
                    .get { code }.isEqualTo(200)
            }
        }
    }


    //ID = 0f0f6541-1210-4a67-b013-158db2659b15, code = q5xflD
    // Laptop: ID = c5b823d7-d4e5-4f71-b437-2a92e7824c8a, code = G3aNOj
    @Test
    fun `Upload Crash`() = runBlocking {
//        withBothClients {
        with(httpTest()) {
            val (response, parsed) = uploadCrashAndParse(TestCrash.Fabric)
            assertEquals(HttpURLConnection.HTTP_OK, response.code)

            println("ID = ${parsed.crashId}, code = ${parsed.deletionKey}")
        }

    }

    @Test
    fun `Invalid getCrash requests`() = runBlocking {
        with(httpTest()) {
            for (id in listOf("", "/", "123123", "\"123123\"")) {
                val response = getCrash(id)
                expectThat(response).get(TestHttpResponse::code).isEqualTo(HttpURLConnection.HTTP_UNSUPPORTED_TYPE)
            }

            for (id in listOf("${UUID.randomUUID()}")) {
                val response = getCrash(id)
                assertEquals(HttpURLConnection.HTTP_NOT_FOUND, response.code)
            }
        }
    }

    @Test
    fun `Get Crash`(): Unit = runBlocking {
        with(httpTest()) {
            val (_, uploadResponse) = uploadCrashAndParse(TestCrash.Fabric)

            val getResponse = getCrash(uploadResponse.crashId.toString())
            val getResponseBody = getResponse.body
            expectThat(getCrashLogContents(TestCrash.Fabric))
                .describedAs(getCrashLogContents(TestCrash.Fabric).substring(0, 100))
                .isEqualTo(getResponseBody)
        }
    }


    private suspend fun HttpTest.uploadCrashAndParse(crash: TestCrash): Pair<TestHttpResponse, UploadCrashResponse.Success> {
        val uploadResponse = uploadCrash(crash)
        return uploadResponse to Json.decodeFromString(UploadCrashResponse.Success.serializer(), uploadResponse.body!!)
    }

    @Test
    fun `Invalid deleteCrash requests`() = runBlocking {
        with(httpTest()) {
            val response1 = deleteCrash(null, "asdf")
            assertEquals(HttpURLConnection.HTTP_UNSUPPORTED_TYPE, response1.code)
            val response2 = deleteCrash("asdf", null)
            assertEquals(HttpURLConnection.HTTP_UNSUPPORTED_TYPE, response2.code)
            val response3 = deleteCrash(null, null)
            assertEquals(HttpURLConnection.HTTP_UNSUPPORTED_TYPE, response3.code)

            val response4 = deleteCrash("asdf", "asdf")
            assertEquals(HttpURLConnection.HTTP_UNSUPPORTED_TYPE, response4.code)
            val response5 = deleteCrash(UUID.randomUUID().toString(), "asdf")
            assertEquals(HttpURLConnection.HTTP_NOT_FOUND, response5.code)

            val uploadResponse = uploadCrash(TestCrash.Fabric)
            assertEquals(HttpURLConnection.HTTP_OK, uploadResponse.code)
            val uploadResponseBody =
                Json.decodeFromString(UploadCrashResponse.Success.serializer(), uploadResponse.body!!)

            val deleteResponse = deleteCrash(uploadResponseBody.crashId.toString(), "wrong key")
            assertEquals(HttpURLConnection.HTTP_UNAUTHORIZED, deleteResponse.code)
        }
    }

    @Test
    fun `Delete Crash`() = runBlocking {
        with(httpTest()) {
            val uploadResponse = uploadCrash(TestCrash.Fabric)
            assertEquals(HttpURLConnection.HTTP_OK, uploadResponse.code)
            val uploadResponseBody =
                Json.decodeFromString(UploadCrashResponse.Success.serializer(), uploadResponse.body!!)

            val deleteResponse =
                deleteCrash(uploadResponseBody.crashId.toString(), uploadResponseBody.deletionKey.toString())
            assertEquals(HttpURLConnection.HTTP_OK, deleteResponse.code)

            val getResponse = getCrash(uploadResponseBody.crashId.toString())
            assertEquals(HttpURLConnection.HTTP_NOT_FOUND, getResponse.code)
        }
    }



//    @Test
//    fun `Download database`() = runBlocking {
//        with(httpTest(local = false)) {
//            val unauthorizedResponse = downloadDatabaseOverview("blah")
//            assertEquals(HttpURLConnection.HTTP_UNAUTHORIZED, unauthorizedResponse.code)
//        }
//    }
}
