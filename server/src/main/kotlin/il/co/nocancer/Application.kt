package il.co.nocancer

import io.ktor.server.engine.*
import io.ktor.server.netty.*
import il.co.nocancer.plugins.*

fun main() {
    copyResourcesForServing()
    embeddedServer(Netty, port = 80, host = "0.0.0.0") {
        configureRouting()
//        configureSecurity()
        configureHTTP()
        configureMonitoring()
//        configureSerialization()
    }.start(wait = true)
}
