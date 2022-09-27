package io.github.crashy

import io.ktor.server.engine.*
import io.ktor.server.netty.*
import io.github.crashy.plugins.configureHTTP
import io.github.crashy.plugins.configureMonitoring
import io.github.crashy.plugins.configureRouting

fun main() {
    copyResourcesForServing()
    embeddedServer(Netty, port = 80, host = "0.0.0.0") {
        configureRouting()
        configureHTTP()
        configureMonitoring()
    }.start(wait = true)
}
