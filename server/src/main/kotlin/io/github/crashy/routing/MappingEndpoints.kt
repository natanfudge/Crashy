package io.github.crashy.routing

import io.github.crashy.crashlogs.api.MappingsApi
import io.ktor.server.application.*
import io.ktor.server.routing.*

 fun Routing.mappingEndpoints(mappings: MappingsApi) {
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