import TestCrash.*
import io.github.crashy.api.utils.IHttpClient
import io.github.crashy.api.utils.Java11HttpClient
import io.github.crashy.api.utils.OkHttpTestClient
import io.github.crashy.api.utils.TestHttpResponse
import org.intellij.lang.annotations.Language


private fun <T> T.mapIf(case: Boolean, application: (T) -> T): T = if (case) let(application) else this

enum class TestCrash {
    Forge,
    Fabric,
    Malformed,
    Huge
}

/////////////////
// Post:
//  - Local, No GZIP: 100ms
//  - Local, Yes GZIP: 100ms
//  - Online, No GZIP: 500-1200ms
//  - Online, GZIP: 300-400ms
//  - Online, GZIP through and through: ~200MS
/////////////////

fun getRandomString(length: Int): String {
    val allowedChars = ('A'..'Z') + ('a'..'z') + ('0'..'9')
    return (1..length)
        .map { allowedChars.random() }
        .joinToString("")
}

enum class ClientLibrary {
    OkHttp,
    Apache
}

interface TestClass {
    val useRealServer: Boolean
}


class HttpTest private constructor(
    local: Boolean = true,
    ssl: Boolean = false,
    private val cache: Boolean = true,
    private val useGzip: Boolean = true,
    private val clientLibrary: ClientLibrary = ClientLibrary.OkHttp
) {
    companion object {
        fun TestClass.httpTest(
            ssl: Boolean = false,
            cache: Boolean = true,
            useGzip: Boolean = true,
            clientLibrary: ClientLibrary = ClientLibrary.OkHttp, local: Boolean = !useRealServer
        ): HttpTest {
            return HttpTest(local = local, ssl = ssl, cache = cache, useGzip = useGzip, clientLibrary = clientLibrary)
        }
    }

    private val client: IHttpClient = when (clientLibrary) {
        ClientLibrary.OkHttp -> OkHttpTestClient(cache, useGzip)
        ClientLibrary.Apache -> Java11HttpClient()
    }

    private val port = if (ssl) 443 else 80
    private val scheme = if (ssl) "https" else "http"

    private val domain = if (local) "localhost" else TODO()
    private val pathPrefix = "$scheme://$domain:$port"

    suspend fun uploadCrash(crash: TestCrash, headers: Map<String, String> = mapOf()): TestHttpResponse {
        val path = "uploadCrash"

        val crashText = getCrashLogContents(crash)

        return post(path, crashText, useGzip = useGzip, headers)
    }

    private fun httpParameters(vararg parameters: Pair<String, String?>): String {
        val notNull = parameters.filter { it.second != null }
        if (notNull.isEmpty()) return ""
        else return "?" + notNull.joinToString("&") { (k, v) -> "$k=$v" }
    }

    suspend fun deleteCrash(id: String?, key: String?): TestHttpResponse {
        val path = "deleteCrash"

        @Language("JSON") val body = """{"id": "$id", "key":  "$key"}"""

//        val body = DeleteCrashlogRequest(id = CrashlogId.fromString(id), key = DeletionKey.fromString(key))

        return post(path, body = body)
    }

    suspend fun getCrash(id: String): TestHttpResponse {
        val path = "getCrash"

        return post(path, body = "\"$id\"")
    }
    suspend fun getTsrg(mcVersion: String): TestHttpResponse {
        val path = "getTsrg/$mcVersion.tsrg"
        return client.get("$pathPrefix/$path")
    }
    suspend fun getMcp(mcVersion: String, build: Int): TestHttpResponse {
        val path = "getMcp/$mcVersion/$build.csv"
        return client.get("$pathPrefix/$path")
    }

     suspend fun post(path: String, body: String, useGzip: Boolean = false, headers: Map<String, String> = mapOf()) : TestHttpResponse {
        return client.post("$pathPrefix/$path", body = body, useGzip = useGzip, headers)
    }

//    private fun testRequest(request: Request) {
//        val startTime = System.currentTimeMillis()
//        client.newCall(request).execute().use { response ->
//            val body = response.body!!.string();
//            println("Got response: ${body.substring(0, min(100, body.length))} with code ${response.code}")
//            val endTime = System.currentTimeMillis()
//            println("Time taken: ${endTime - startTime}ms")
//        }
//    }

}

private fun getResource(path: String) = TestCrash::class.java.getResourceAsStream("/$path")!!.readAllBytes()
    .toString(Charsets.UTF_8)

fun getCrashLogContents(crash: TestCrash) = when (crash) {
    Forge -> getResource("forge_crash.txt")
    Fabric -> getResource("fabric_crash.txt")
    Malformed -> getResource("malformed_crash.txt")
    Huge -> buildString { repeat(10_000_000) { append(getRandomString(1)) } }
}
