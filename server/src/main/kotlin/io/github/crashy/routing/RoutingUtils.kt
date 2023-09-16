package io.github.crashy.routing

import io.github.crashy.Crashy
import io.github.crashy.crashlogs.Blacklist
import io.github.crashy.crashlogs.api.Encoding
import io.github.crashy.crashlogs.api.Response
import io.github.natanfudge.logs.LogContext
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.plugins.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.util.pipeline.*
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import kotlinx.serialization.ExperimentalSerializationApi
import kotlinx.serialization.json.Json
import kotlinx.serialization.json.decodeFromStream


inline fun <reified R : Any> Routing.crashyPost(
    path: String,
    crossinline handler: suspend context(LogContext, PipelineContext<Unit, ApplicationCall>) (R) -> Unit
) {
    post<R>(path) { body ->
        response(path) { log ->
            handler(log, this@post, body)
        }
    }
}

inline fun Routing.crashyRoute(
    vararg routes: String,
    crossinline body: suspend context(LogContext, PipelineContext<Unit, ApplicationCall>) () -> Unit
) {
    for (route in routes) {
        get(route) {
            response(route) { log ->
                body(log, this@get)
            }
        }
    }
}

@OptIn(ExperimentalSerializationApi::class)
inline fun <reified T : Any> Routing.json(
    path: String,
    crossinline handler: suspend context(LogContext, PipelineContext<Unit, ApplicationCall>)(T) -> Unit
) {
    post(path) {
        response(path) { log ->
            call.receiveStream().use { body ->
                try {
                    val decoded = withContext<T>(Dispatchers.IO) {
                        Json.decodeFromStream(body)
                    }
                    handler(log, this@post, decoded)
                } catch (e: IllegalArgumentException) {
                    call.respondText("Error deserializing body", status = HttpStatusCode.UnsupportedMediaType)
                    log.logWarn { "Error deserializing body $e" }
                }
            }
        }
    }
}


suspend fun PipelineContext<Unit, ApplicationCall>.respond(response: Response) {
    when (response.encoding) {
        Encoding.Brotli -> call.response.header(HttpHeaders.ContentEncoding, "br")
        Encoding.None -> {}
    }
    for ((key, value) in response.extraHeaders) {
        call.response.header(key, value)
    }

    addCorsHeader()

    call.respondBytes(
        response.bytes, status = response.statusCode, contentType = response.contentType
    )
}

suspend fun PipelineContext<Unit, ApplicationCall>.response(
    path: String,
    handler: suspend (log: LogContext) -> Unit
) {
    val ip = call.request.origin.remoteAddress
    if (Blacklist.isBlacklisted(ip)) {
        // Don't respond anything, fuck you
        return
    }
    Crashy.logger.startSuspendWithContextAsParam(path) { log ->
        log.logData("IP") { ip }
        handler(log)
    }
}


fun PipelineContext<Unit, ApplicationCall>.addCorsHeader() {
    // This makes it easier to test out the api in development since the React app runs in port 3000
    call.response.header("Access-Control-Allow-Origin", "*")
}