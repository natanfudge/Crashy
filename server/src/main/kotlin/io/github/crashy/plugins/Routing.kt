package io.github.crashy.plugins

import io.github.crashy.crashlogs.storage.CrashlogStorage
import io.github.crashy.crashlogs.storage.RealClock
import io.github.crashy.runDir
import io.github.crashy.staticDir
import io.ktor.server.application.*
import io.ktor.server.http.content.*
import io.ktor.server.routing.*
import kotlinx.coroutines.runBlocking

fun Application.configureRouting() {
    val logStorage = runBlocking {
        CrashlogStorage.create(bucket = "crashy-crashlogs", runDir = runDir, clock = RealClock)
    }
    routing {

        preCompressed {
            singlePageApplication {
                useResources = false
                filesPath = staticDir.toString()
            }
        }
    }
}