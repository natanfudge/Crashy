package io.github.crashy

import com.aayushatharva.brotli4j.Brotli4jLoader
import io.github.crashy.plugins.configureLogging
import io.github.crashy.routing.configureRouting
import io.ktor.http.*
import io.ktor.http.content.*
import io.ktor.server.application.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import io.ktor.server.plugins.cachingheaders.*
import io.ktor.server.plugins.httpsredirect.*

object AppKt {
    private lateinit var server: ApplicationEngine

    @JvmStatic
    fun main(args: Array<String>) {
        Brotli4jLoader.ensureAvailability()
        copyStaticResourcesForServing()
        startServer()
    }

    fun restartServer() {
        server.stop()
        startServer()
    }

    private fun startServer() {
        server = embeddedServer(Netty, environment = createAppEnvironment()).start(wait = true)
    }
}


private fun createAppEnvironment() = applicationEngineEnvironment {
    watchPaths = listOf("classes")
    connector {
        port = if (Crashy.isSecondaryInstance()) 8080 else 80
        host = "0.0.0.0"
    }
    configureSSL()



    module {
        Crashy.logger.install()
        if (!Crashy.isLocal()) {
            install(HttpsRedirect) {
                sslPort = Crashy.SSLPort
                permanentRedirect = true
            }
        }

        install(CachingHeaders) {
            options { _, content ->
                when (content.contentType?.withoutParameters()) {
                    ContentType.Text.Html, ContentType.Application.JavaScript, ContentType.Text.CSS, ContentType.Image.SVG -> CachingOptions(
                        CacheControl.MaxAge(maxAgeSeconds = 604800)
                    )

                    else -> null
                }
            }
        }

        configureLogging()
        configureRouting()


    }
}

