package io.github.crashy.crashlogs.api

import io.github.crashy.Crashy
import io.ktor.http.*
import io.ktor.server.http.*

enum class Encoding {
    Brotli, None
}

enum class ResponseContentType {
    Text, Html, Json
}

interface Response {
    val bytes: ByteArray
    val statusCode: HttpStatusCode
    val encoding: Encoding
    val contentType: ContentType
    val extraHeaders: Map<String,String>
        get() = mapOf()
}

interface StringResponse : Response {
    val string: String
    override val bytes: ByteArray
        get() = string.toByteArray(Charsets.UTF_8)
    override val encoding: Encoding
        get() = Encoding.None
}
interface ByteResponse : Response {
    override val encoding: Encoding
        get() = Encoding.None
}

fun textResponse(string: String, code: HttpStatusCode) = object : StringResponse {
    override val statusCode: HttpStatusCode = code
    override val string = string
    override val contentType: ContentType = ContentType.Text.Plain
}
fun textAsBytesResponse(bytes: ByteArray) = object : ByteResponse {
    override val statusCode: HttpStatusCode = HttpStatusCode.OK
    override val bytes: ByteArray = bytes
    override val contentType: ContentType = ContentType.Text.Plain
}

fun htmlResponse(string: String, code: HttpStatusCode) = object : StringResponse {
    override val statusCode: HttpStatusCode = code
    override val string = string
    override val contentType: ContentType = ContentType.Text.Html
//    override val extraHeaders: Map<String, String>
//        get() = mapOf(
//            "Last-Modified" to Crashy.ServerStartTime.toHttpDateString(),
//            "Cache-Control" to "public, max-age=604800"
//        )
}
