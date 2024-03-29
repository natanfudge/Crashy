package io.github.crashy.routing

import io.github.crashy.Crashy
import io.github.crashy.crashlogs.api.CrashlogApi
import io.github.crashy.crashlogs.api.MappingsApi
import io.github.crashy.crashlogs.storage.CrashlogStorage
import io.github.crashy.crashlogs.storage.RealClock
import io.github.crashy.mappings.MappingsProvider
import io.ktor.server.application.*
import io.ktor.server.routing.*
import kotlinx.coroutines.*
import java.nio.file.Paths
import java.time.Instant
import java.util.*
import kotlin.concurrent.schedule

object Routes {
    const val Logs = "/logs"
}

fun Application.configureRouting() {
    val crashyDir = Crashy.HomeDir
    val logStorage = runBlocking {
        CrashlogStorage(
            bucketName = Crashy.S3CrashlogBucket,
            appDataDir = crashyDir,
            clock = RealClock,
            deleteFromS3OnFetch = Crashy.isRelease()
        )
    }
    val mappingsProvider = MappingsProvider(crashyDir.resolve("mappings"))

    val crashlogs = CrashlogApi(logStorage)
    scheduleTasks(logStorage)
    val mappings = MappingsApi(mappingsProvider)

    routing {
        Crashy.logger.route()
        // We have an options response for /uploadCrash so the browser will calm down.
        crashlogEndpoints(crashlogs)
        mappingEndpoints(mappings)
    }
}


@OptIn(DelicateCoroutinesApi::class)
private fun scheduleTasks(crashlogStorage: CrashlogStorage) {
    val timer = Timer()
    // Runs once every day and once at startup
    timer.schedule(delay = 0, period = Day) {
        GlobalScope.launch(Dispatchers.IO) {
            Crashy.logger.startSuspend("scheduleTasks") {
                logData("Crashy Home Dir") { Crashy.HomeDir.toAbsolutePath() }
                logData("Schedule Time") { Instant.now() }
                crashlogStorage.evictOld()
            }
        }
    }
}

private const val Day = 1000 * 60 * 60 * 24L