package io.github.crashy

import com.aayushatharva.brotli4j.Brotli4jLoader
import com.codahale.metrics.jmx.JmxReporter
import io.github.crashy.Crashy.Build.*
import io.github.crashy.plugins.configreLogging
import io.github.crashy.plugins.configureHTTP
import io.github.crashy.routing.configureRouting
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.engine.*
import io.ktor.server.metrics.dropwizard.*
import io.ktor.server.netty.*
import io.ktor.server.plugins.httpsredirect.*
import java.nio.charset.Charset
import java.nio.file.Paths
import java.security.KeyStore
import java.util.concurrent.TimeUnit
import kotlin.io.path.exists

object App


fun main() {
    Brotli4jLoader.ensureAvailability()
    copyStaticResourcesForServing()
    embeddedServer(Netty, environment = createAppEnvironment()).start(wait = true)
}

private fun createAppEnvironment() = applicationEngineEnvironment {
    connector {
        port = 80
        host = "0.0.0.0"
    }
    configureSSL()

    module {
        install(Authentication) {
            form("auth-form") {
                userParamName = "username"
                passwordParamName = "password"
                validate { credentials ->
                    if (credentials.name == "jetbrains" && credentials.password == "foobar") {
                        UserIdPrincipal(credentials.name)
                    } else {
                        null
                    }
                }
                challenge("/login")
            }
        }

        if (Crashy.build != Local) {
            install(HttpsRedirect) {
                sslPort = 443
                permanentRedirect = true
            }
        }

        install(DropwizardMetrics) {
            JmxReporter.forRegistry(registry)
                .convertRatesTo(TimeUnit.SECONDS)
                .convertDurationsTo(TimeUnit.MILLISECONDS)
                .build()
                .start()
        }
        configureHTTP()
        configreLogging()

        configureRouting()


    }
}

