package io.github.crashy

import io.github.crashy.crashlogs.CrashlogApi
import io.github.crashy.crashlogs.storage.CrashlogStorage
import io.github.crashy.crashlogs.storage.RealClock
import io.ktor.server.application.*
import io.ktor.server.http.content.*
import io.ktor.server.routing.*
import kotlinx.coroutines.runBlocking

fun Application.configureRouting() {
    val logStorage = runBlocking {
        CrashlogStorage.create(bucket = "crashy-crashlogs", runDir = runDir, clock = RealClock)
    }

    val api = CrashlogApi(logStorage)

    routing {

        preCompressed {
            singlePageApplication {
                useResources = false
                filesPath = staticDir.toString()
            }
        }
    }
}