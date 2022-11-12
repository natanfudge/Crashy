package io.github.crashy

import io.github.crashy.crashlogs.*
import io.github.crashy.crashlogs.api.*
import io.github.crashy.crashlogs.storage.CrashlogStorage
import io.github.crashy.crashlogs.storage.RealClock
import io.github.crashy.utils.decompressGzip
import io.ktor.client.utils.*
import io.ktor.http.*
import io.ktor.http.content.*
import io.ktor.server.application.*
import io.ktor.server.http.content.*
import io.ktor.server.plugins.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.util.pipeline.*
import io.ktor.utils.io.core.*
import kotlinx.coroutines.runBlocking
import kotlinx.serialization.ExperimentalSerializationApi
import kotlinx.serialization.json.Json
import kotlinx.serialization.json.decodeFromStream
import java.nio.file.Paths
import kotlin.io.use

fun Application.configureRouting() {
    val logStorage = runBlocking {
        CrashlogStorage.create(
            bucket = "crashy-crashlogs",
            appDataDir = Paths.get(System.getProperty("user.home"), "crashy"),
            clock = RealClock
        )
    }

    val api = CrashlogApi(logStorage)

    routing {
        post<ByteArray>("/uploadCrash") {
            val isGzipContentType = call.request.header("content-type") == "application/gzip"
            val isGzipContentEncoding = call.request.header("content-encoding") == "gzip"
            if (isGzipContentType != isGzipContentEncoding) {
                call.respondText(
                    "Mismatching content encoding/type is not supported anymore",
                    status = HttpStatusCode.UnsupportedMediaType
                )
            }

            val uncompressed = if (isGzipContentEncoding) it.decompressGzip() else it

            respond(api.uploadCrash(UncompressedLog(uncompressed), ip = call.request.origin.remoteAddress))
        }
        json<DeleteCrashlogRequest>("/deleteCrash") {
            respond(api.deleteCrash(it))
        }
        // Used for testing
        json<GetCrashRequest>("/getCrash") {
            respond(api.getCrash(it.value.toString()))
        }
        preCompressed {
            singlePageApplication {
                useResources = false
                filesPath = staticDir.toString()
            }
        }

        // Manually respond these files so the /{id} wildcard doesn't take over these endpoints
        get("favicon.svg") {
            call.respondFile(staticDir.resolve("favicon.svg").toFile())
        }
        get("manifest.json") {
            call.respondFile(staticDir.resolve("manifest.json").toFile())
        }

        get("/{id}") {
            val id = call.parameters["id"]!!
            respond(api.getCrashPage(id))
        }
        get("/{id}/raw") {
            val id = call.parameters["id"]!!
            //TODO: add good caching headers on successful response
            respond(api.getCrash(id))
        }
    }
}


@OptIn(ExperimentalSerializationApi::class)
private inline fun <reified T : Any> Routing.json(
    path: String,
    crossinline body: suspend PipelineContext<Unit, ApplicationCall>.(T) -> Unit
) {
    post(path) {
        call.receiveStream().use {
            try {
                body(Json.decodeFromStream(it))
            } catch (e: IllegalArgumentException) {
                call.respondText("Error deserializing body", status = HttpStatusCode.UnsupportedMediaType)
            }
        }
    }
}


private suspend fun PipelineContext<Unit, ApplicationCall>.respond(response: Response) {
    when (response.encoding) {
        Encoding.Brotli -> call.response.header(HttpHeaders.ContentEncoding, "br")
        Encoding.None -> {}
    }
    call.respondBytes(
        response.bytes, status = response.statusCode, contentType = response.contentType
    )
}