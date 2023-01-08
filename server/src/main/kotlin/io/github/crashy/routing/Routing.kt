package io.github.crashy.routing

import io.github.crashy.crashlogs.api.CrashlogApi
import io.github.crashy.crashlogs.api.MappingsApi
import io.github.crashy.crashlogs.storage.CrashlogStorage
import io.github.crashy.crashlogs.storage.RealClock
import io.github.crashy.mappings.MappingsProvider
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.html.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlinx.coroutines.runBlocking
import kotlinx.html.*
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
        mappingEndpoints(mappings)

        authenticate("auth-form"){
            get("/logs"){
                call.respondText("Secret shit")
            }
        }

        get("/login") {
            call.respondHtml {
                body {
                    form(method = FormMethod.post, action = "/logs") {
                        label {
                            +"Username:"
                            textInput(name = "user")
                        }
                        label {
                            +"Password:"
                            passwordInput(name = "password")
                        }
                        submitInput()
                    }
                }
            }
        }


    }
}

private fun Routing.mappingEndpoints(mappings: MappingsApi) {
    crashyRoute("/getTsrg/{mcVersion}.tsrg") {
        val mcVersion = call.parameters["mcVersion"]!!
        respond(mappings.getTsrg(mcVersion))
    }
    crashyRoute("/getMcp/{mcVersion}/{build}.csv") {
        val mcVersion = call.parameters["mcVersion"]!!
        val build = call.parameters["build"]!!.toInt()
        respond(mappings.getMcp(mcVersion, build))
    }
}