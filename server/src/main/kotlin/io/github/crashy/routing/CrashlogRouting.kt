package io.github.crashy.routing

import io.github.crashy.Crashy
import io.github.crashy.crashlogs.UncompressedLog
import io.github.crashy.crashlogs.api.CrashlogApi
import io.github.crashy.crashlogs.api.DeleteCrashlogRequest
import io.github.crashy.crashlogs.api.GetCrashRequest
import io.github.crashy.crashlogs.api.UploadCrashResponse
import io.github.crashy.utils.decompressGzip
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

        val uncompressed = if (isGzipContentEncoding) {
            it.decompressGzip().getOrElse {
                // If can't decompress from gzip, stop and return that the format is invalid
                respond(UploadCrashResponse.NotGzipCompressed)
                return@crashyPost
            }
        } else it

        // TODO: we log headers to try to see if the spammers are doing anything sus with that.
        // If that doesn't point to anything, try other mechanisms such as suspicious activity monitoring and increased ban time on upload limit.
        logData("Headers") { call.request.headers.entries().joinToString("\n") { (k, v) -> "$k: $v" } }

        respond(
            crashlogs.uploadCrash(
                UncompressedLog(uncompressed),
                ip = call.request.origin.remoteAddress,
                firebasePassHeader = call.request.header("firebase-pass")
            )
        )
    }
    json<DeleteCrashlogRequest>("/deleteCrash") {
        respond(crashlogs.deleteCrash(it))
    }
    // Used for testing
    json<GetCrashRequest>("/getCrash") {
        respond(crashlogs.getCrash(it.value.toString()))
    }

    // Serve static files
    staticFiles(remotePath = "/", dir = Crashy.StaticDir.toFile()) {
        preCompressed(CompressedFileType.BROTLI)
    }

    // Manually respond these files so the /{id} wildcard doesn't take over these endpoints
    crashyRoute("favicon.svg") {
        call.respondFile(Crashy.StaticDir.resolve("favicon.svg").toFile())
    }
    crashyRoute("manifest.json") {
        call.respondFile(Crashy.StaticDir.resolve("manifest.json").toFile())
    }

    crashyRoute("/") {
        respond(crashlogs.getLandingPage())
    }

    crashyRoute("/{id}") {
        val id = call.parameters["id"]!!
        respond(crashlogs.getCrashPage(id))
    }
    crashyRoute("/{id}/raw.txt", "/{id}/raw") {
        val id = call.parameters["id"]!!
        respond(crashlogs.getCrash(id))
    }
}


