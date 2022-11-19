package io.github.crashy.plugins

import io.ktor.server.application.*
import io.ktor.server.plugins.callloging.*
import org.slf4j.event.Level

fun Application.configreLogging() {
    install(CallLogging) {
        level = Level.INFO
    }
}
