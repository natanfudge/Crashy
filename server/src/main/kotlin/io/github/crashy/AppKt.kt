package io.github.crashy

import com.aayushatharva.brotli4j.Brotli4jLoader
import io.github.crashy.Crashy.Build.Local
import io.github.crashy.auth.installAuthentication
import io.github.crashy.plugins.configureLogging
import io.github.crashy.routing.configureRouting
import io.ktor.http.*
import io.ktor.http.content.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import io.ktor.server.plugins.cachingheaders.*
import io.ktor.server.plugins.httpsredirect.*

object AppKt {
    @JvmStatic
    fun main(args: Array<String>) {
        Brotli4jLoader.ensureAvailability()
        copyStaticResourcesForServing()
        embeddedServer(Netty, environment = createAppEnvironment()).start(wait = true)
    }
}





data class UserSession(val name: String, val count: Int) : Principal


private fun createAppEnvironment() = applicationEngineEnvironment {
    watchPaths = listOf("classes")
    connector {
        port = 80
        host = "0.0.0.0"
    }
    configureSSL()

    module {
        installAuthentication()

        if (Crashy.build != Local) {
            install(HttpsRedirect) {
                sslPort = 443
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

