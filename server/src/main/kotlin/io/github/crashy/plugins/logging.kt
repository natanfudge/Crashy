package io.github.crashy.plugins

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.plugins.callloging.*
import io.ktor.server.request.*
import org.slf4j.event.Level

fun Application.configreLogging() {
    install(CallLogging) {
        level = Level.INFO
    }
}

private fun colored(status: Any): String {
    return status.toString()
}

private fun ApplicationRequest.toLogStringWithColors(): String =
    "${httpMethod.value} - ${path()}"