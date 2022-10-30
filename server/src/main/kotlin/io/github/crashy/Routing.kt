package io.github.crashy

import io.github.crashy.crashlogs.*
import io.github.crashy.crashlogs.storage.CrashlogStorage
import io.github.crashy.crashlogs.storage.RealClock
import io.ktor.server.application.*
import io.ktor.server.http.content.*
import io.ktor.server.plugins.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.util.pipeline.*
import kotlinx.coroutines.runBlocking

fun Application.configureRouting() {
    val logStorage = runBlocking {
        CrashlogStorage.create(bucket = "crashy-crashlogs", runDir = runDir, clock = RealClock)
    }

    val api = CrashlogApi(logStorage)

    routing {
        handle<UploadCrashlogRequest>("/uploadCrash"){
            respondResponse(api.uploadCrash(it))
        }
        handle<DeleteCrashlogRequest>("/deleteCrash"){
            respondResponse(api.deleteCrash(it))
        }
        handle<GetCrashRequest>("/getCrash"){
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

private inline fun<reified T: Any> Routing.handle(path: String, crossinline body: suspend PipelineContext<Unit, ApplicationCall>.(T) -> Unit) {
    post<T>(path) {
//        println("IP:" + call.request.origin.)
        body(it)
    }
}

private suspend fun  PipelineContext<Unit, ApplicationCall>.respondResponse(response: Response) {
    call.respondText(response.responseString(), status = response.statusCode)
}