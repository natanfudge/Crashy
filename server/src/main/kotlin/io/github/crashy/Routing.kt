package io.github.crashy

import io.github.crashy.crashlogs.*
import io.github.crashy.crashlogs.api.*
import io.github.crashy.crashlogs.storage.CrashlogStorage
import io.github.crashy.crashlogs.storage.RealClock
import io.github.crashy.mappings.MappingsProvider
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
    val crashyDir = Paths.get(System.getProperty("user.home"), ".crashy")
    val logStorage = runBlocking {
        CrashlogStorage.create(
            bucket = "crashy-crashlogs",
            appDataDir = crashyDir,
            clock = RealClock
        )
    }
    val mappingsProvider = MappingsProvider(crashyDir.resolve("mappings"))

    val crashlogs = CrashlogApi(logStorage)
    val mappings = MappingsApi(mappingsProvider)

    routing {
        // We have an options response for /uploadCrash so the browser will calm down.
        crashlogEndpoints(crashlogs)
        route("/getTsrg/{mcVersion}.tsrg") {
            val mcVersion = call.parameters["mcVersion"]!!
            respond(mappings.getTsrg(mcVersion))
        }
    }
}

private fun Routing.crashlogEndpoints(crashlogs: CrashlogApi) {
    options("/uploadCrash") {
        call.response.header("Allow", "POST")
        addDevCorsHeader()
        call.response.header("Access-Control-Allow-Headers", "content-encoding")
        call.respondBytes(ByteArray(0), status = HttpStatusCode.OK)
    }
    post<ByteArray>("/uploadCrash") {
        val isGzipContentEncoding = call.request.header("content-encoding") == "gzip"

        val uncompressed = if (isGzipContentEncoding) it.decompressGzip() else it

        respond(crashlogs.uploadCrash(UncompressedLog(uncompressed), ip = call.request.origin.remoteAddress))
    }
    json<DeleteCrashlogRequest>("/deleteCrash") {
        respond(crashlogs.deleteCrash(it))
    }
    // Used for testing
    json<GetCrashRequest>("/getCrash") {
        respond(crashlogs.getCrash(it.value.toString()))
    }
    preCompressed {
        singlePageApplication {
            useResources = false
            filesPath = staticDir.toString()
        }
    }

    // Manually respond these files so the /{id} wildcard doesn't take over these endpoints
    route("favicon.svg") {
        call.respondFile(staticDir.resolve("favicon.svg").toFile())
    }
    route("manifest.json") {
        call.respondFile(staticDir.resolve("manifest.json").toFile())
    }

    route("/") {
        respond(crashlogs.getLandingPage())
    }

    route("/{id}") {
        val id = call.parameters["id"]!!
        respond(crashlogs.getCrashPage(id))
    }
    route("/{id}/raw.txt", "/{id}/raw") {
        val id = call.parameters["id"]!!
        respond(crashlogs.getCrash(id))
    }
}

private inline fun Routing.route(
    vararg routes: String,
    crossinline body: suspend PipelineContext<Unit, ApplicationCall>.() -> Unit
) {
    for (route in routes) {
        get(route) {
            printCrashes {
                body()
            }
        }
    }
}


@OptIn(ExperimentalSerializationApi::class)
private inline fun <reified T : Any> Routing.json(
    path: String,
    crossinline body: suspend PipelineContext<Unit, ApplicationCall>.(T) -> Unit
) {
    post(path) {
        printCrashes {
            call.receiveStream().use {
                try {
                    body(Json.decodeFromStream(it))
                } catch (e: IllegalArgumentException) {
                    call.respondText("Error deserializing body", status = HttpStatusCode.UnsupportedMediaType)
                }
            }
        }

    }
}


private suspend fun PipelineContext<Unit, ApplicationCall>.respond(response: Response) {
    when (response.encoding) {
        Encoding.Brotli -> call.response.header(HttpHeaders.ContentEncoding, "br")
        Encoding.None -> {}
    }
    for ((key, value) in response.extraHeaders) {
        call.response.header(key, value)
    }

    addDevCorsHeader()

    call.respondBytes(
        response.bytes, status = response.statusCode, contentType = response.contentType
    )
}

private inline fun printCrashes(callback: () -> Unit) {
    try {
        callback()
    } catch (e: Throwable) {
        e.printStackTrace()
        throw e
    }
}

private fun PipelineContext<Unit, ApplicationCall>.addDevCorsHeader() {
    // This makes it easier to test out the api in development since the React app runs in port 3000
    call.response.header("Access-Control-Allow-Origin", "http://localhost:3000")
}