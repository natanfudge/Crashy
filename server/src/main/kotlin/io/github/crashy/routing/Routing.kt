package io.github.crashy.routing

import io.github.crashy.auth.AuthSessionName
import io.github.crashy.auth.routeAuthentication
import io.github.crashy.crashlogs.api.CrashlogApi
import io.github.crashy.crashlogs.api.MappingsApi
import io.github.crashy.crashlogs.storage.CrashlogStorage
import io.github.crashy.crashlogs.storage.RealClock
import io.github.crashy.mappings.MappingsProvider
import io.github.crashy.utils.log.CrashyLogger
import io.ktor.http.*
import io.ktor.http.content.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.plugins.cachingheaders.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlinx.coroutines.*
import java.nio.file.Paths
import java.time.Instant
import java.util.*
import kotlin.concurrent.schedule
import kotlin.io.path.exists
import kotlin.io.path.readText

object Routes {
    const val Logs = "/logs"
}

fun Application.configureRouting() {
    val crashyDir = Paths.get(System.getProperty("user.home"), ".crashy")
    val logStorage = runBlocking {
        CrashlogStorage(
            bucketName = "crashy-crashlogs",
            appDataDir = crashyDir,
            clock = RealClock
        )
    }
    val mappingsProvider = MappingsProvider(crashyDir.resolve("mappings"))

    val crashlogs = CrashlogApi(logStorage)
    scheduleTasks(logStorage)
    val mappings = MappingsApi(mappingsProvider)

    routing {
        // We have an options response for /uploadCrash so the browser will calm down.
        crashlogEndpoints(crashlogs)
        mappingEndpoints(mappings)

        routeAuthentication()

        authenticate(AuthSessionName) {
            get(Routes.Logs) {
                respond(crashlogs.getLandingPage())
            }
        }



    }
}

private fun getLogs(call: ApplicationCall): String {
    val endpoint = call.parameters["e"] ?: return "Missing endpoint parameter"
    val logs = CrashyLogger.logsOfEndpoint(endpoint)
    if (!logs.exists()) return "No such endpoint '$endpoint'"
    if (logs.parent != CrashyLogger.todayLogDir) return "Woah there son"
    return logs.readText()
}


@OptIn(DelicateCoroutinesApi::class)
private fun scheduleTasks(crashlogStorage: CrashlogStorage) {
    val timer = Timer()
    // Runs once every day
    timer.schedule(Day) {
        GlobalScope.launch(Dispatchers.IO) {
            CrashyLogger.startCall("scheduleTasks") {
                logData("Schedule Time") { Instant.now() }
                CrashyLogger.deleteOldLogs()
                crashlogStorage.evictOld()
            }
        }
    }.apply {
        // Run once at startup
        run()
    }
}

private const val Day = 1000 * 60 * 60 * 24L