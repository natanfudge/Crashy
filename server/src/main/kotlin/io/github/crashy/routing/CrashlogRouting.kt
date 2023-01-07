package io.github.crashy.routing

import io.github.crashy.Crashy
import io.github.crashy.crashlogs.UncompressedLog
import io.github.crashy.crashlogs.api.CrashlogApi
import io.github.crashy.crashlogs.api.DeleteCrashlogRequest
import io.github.crashy.utils.log.CrashyLogger
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.http.content.*
import io.ktor.server.plugins.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun Routing.crashlogEndpoints(crashlogs: CrashlogApi) {
    options("/uploadCrash") {
        call.response.header("Allow", "POST")
        addCorsHeader()
        call.response.header("Access-Control-Allow-Headers", "content-encoding")
        call.respondBytes(ByteArray(0), status = HttpStatusCode.OK)
    }
    crashyPost<ByteArray>("/uploadCrash") {
        val isGzipContentEncoding = call.request.header("content-encoding") == "gzip"
        logData("GZip Compressed") { isGzipContentEncoding }

        val uncompressed = if (isGzipContentEncoding) it.decompressGzip() else it

        CrashyLogger.startCall("foo") {
            logData("Compression") { isGzipContentEncoding }
        }

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
            filesPath = Crashy.StaticDir.toString()
        }
    }

    // Manually respond these files so the /{id} wildcard doesn't take over these endpoints
    route("favicon.svg") {
        call.respondFile(Crashy.StaticDir.resolve("favicon.svg").toFile())
    }
    route("manifest.json") {
        call.respondFile(Crashy.StaticDir.resolve("manifest.json").toFile())
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


