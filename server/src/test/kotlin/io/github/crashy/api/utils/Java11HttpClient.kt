import java.io.ByteArrayOutputStream
import java.net.URI
import java.net.http.HttpClient
import java.net.http.HttpRequest
import java.net.http.HttpResponse
import java.util.zip.GZIPOutputStream
import kotlin.coroutines.resume
import kotlin.coroutines.suspendCoroutine

class Java11HttpClient : IHttpClient {
    private val client = HttpClient.newHttpClient()

    override suspend fun get(url: String): TestHttpResponse {
        TODO("Not yet implemented")
    }

    private suspend fun HttpClient.sendSuspend(request: HttpRequest) =
        suspendCoroutine<HttpResponse<String>> { cont ->
            sendAsync(request, HttpResponse.BodyHandlers.ofString()).thenAccept {
                cont.resume(it)
            }
        }

    override suspend fun post(url: String, body: String, useGzip: Boolean, headers: Map<String, String>): TestHttpResponse {
        val compressed = ByteArrayOutputStream().use { baos ->
            GZIPOutputStream(baos).use { gzos ->
                gzos.write(body.toByteArray(Charsets.UTF_8))
            }
            baos.toByteArray()
        }

        val request = HttpRequest.newBuilder(URI.create(url)).apply {
            for ((headerName, headerValue) in headers) {
                setHeader(headerName, headerValue)
            }
            setHeader("content-type","application/gzip")
            setHeader("Content-Encoding","gzip")
        }.POST(HttpRequest.BodyPublishers.ofByteArray(compressed))
            .build()
        with(client.sendSuspend(request)) {
            return TestHttpResponse(statusCode(), body())
        }
    }

    override suspend fun delete(url: String): TestHttpResponse {
        TODO("Not yet implemented")
    }
}