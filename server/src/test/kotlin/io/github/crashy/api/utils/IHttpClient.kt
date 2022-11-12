package io.github.crashy.api.utils

interface IHttpClient {
    suspend fun get(url: String): TestHttpResponse
    suspend fun post(url: String, body: String,useGzip: Boolean, headers: Map<String,String> = mapOf()): TestHttpResponse
    suspend fun delete(url: String): TestHttpResponse
}

data class TestHttpResponse (
    val code: Int,
    val body: String?
)


//data class TestHttpClientOptions(
//    val local: Boolean = true,
//    val useGzip: Boolean = true,
//    private val directApi: Boolean = true,
//    val cache: Boolean = true
//)

fun <T> T.applyIf(case: Boolean, application: T. () -> Unit): T = if (case) apply(application) else this
fun <T> T.letIf(case: Boolean, application: (T) -> T): T = if (case) let(application) else this
