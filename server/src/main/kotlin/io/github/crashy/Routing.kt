package io.github.crashy

import io.github.crashy.crashlogs.CrashlogApi
import io.github.crashy.crashlogs.DeleteCrashlogRequest
import io.github.crashy.crashlogs.GetCrashRequest
import io.github.crashy.crashlogs.UploadCrashlogRequest
import io.github.crashy.crashlogs.storage.CrashlogStorage
import io.github.crashy.crashlogs.storage.RealClock
import io.ktor.server.application.*
import io.ktor.server.http.content.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlinx.coroutines.runBlocking

fun Application.configureRouting() {
    val logStorage = runBlocking {
        CrashlogStorage.create(bucket = "crashy-crashlogs", runDir = runDir, clock = RealClock)
    }

    val api = CrashlogApi(logStorage)

    routing {
        post<UploadCrashlogRequest>("/uploadCrash"){
            call.respondText(api.uploadCrash(it).responseString())
        }
        post<DeleteCrashlogRequest>("/deleteCrash"){
            call.respondText(api.deleteCrash(it).responseString())
        }
        post<GetCrashRequest>("/getCrash"){
            call.respondBytes(api.getCrash(it))
        }
        preCompressed {
            singlePageApplication {
                useResources = false
                filesPath = staticDir.toString()
            }
        }
    }
}