package io.github.crashy.crashlogs.api

import io.ktor.http.*

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

fun textResponse(string: String, code: HttpStatusCode) = object : StringResponse {
    override val statusCode: HttpStatusCode = code
    override val string = string
    override val contentType: ContentType = ContentType.Text.Plain
}

fun htmlResponse(string: String, code: HttpStatusCode) = object : StringResponse {
    override val statusCode: HttpStatusCode = code
    override val string = string
    override val contentType: ContentType = ContentType.Text.Html
}
