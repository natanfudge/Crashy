package io.github.crashy.routing

import io.github.crashy.crashlogEndpoints
import io.github.crashy.crashlogs.api.CrashlogApi
import io.github.crashy.crashlogs.api.MappingsApi
import io.github.crashy.crashlogs.storage.CrashlogStorage
import io.github.crashy.crashlogs.storage.RealClock
import io.github.crashy.mappings.MappingsProvider
import io.github.crashy.respond
import io.github.crashy.route
import io.ktor.server.application.*
import io.ktor.server.routing.*
import kotlinx.coroutines.runBlocking
import java.nio.file.Paths

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
        route("/getMcp/{mcVersion}/{build}.csv") {
            val mcVersion = call.parameters["mcVersion"]!!
            val build = call.parameters["build"]!!.toInt()
            respond(mappings.getMcp(mcVersion, build))
        }
    }
}