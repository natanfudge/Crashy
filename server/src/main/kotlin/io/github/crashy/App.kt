package io.github.crashy

import com.aayushatharva.brotli4j.Brotli4jLoader
import com.codahale.metrics.jmx.JmxReporter
import io.github.crashy.plugins.configureHTTP
import io.github.crashy.plugins.configreLogging
import io.ktor.server.application.*
import io.ktor.server.engine.*
import io.ktor.server.metrics.dropwizard.*
import io.ktor.server.netty.*
import kotlinx.serialization.json.Json
import org.slf4j.LoggerFactory
import java.nio.charset.Charset
import java.security.KeyStore
import java.util.concurrent.TimeUnit

object App
val CrashyJson = Json
val CrashyLogger = LoggerFactory.getLogger(App::class.java)
fun main() {
    Brotli4jLoader.ensureAvailability()
    copyResourcesForServing()
    embeddedServer(Netty, environment =  createAppEnvironment()).start(wait = true)
}

private fun createAppEnvironment() = applicationEngineEnvironment {
    connector {
        port = 80
        host = "0.0.0.0"
    }
    val keystorePassword = getKeystorePassword()
    if (keystorePassword != null) {
        val keyStore = getKeystore(keystorePassword)
        if (keyStore != null) {
            sslConnector(
                keyStore = keyStore,
                keyAlias = "sampleAlias",
                keyStorePassword = { keystorePassword },
                privateKeyPassword = { keystorePassword }
            ) {
                port = 443
                host = "0.0.0.0"
            }
        }
    } else {
        println("Warning: Could not find Keystore password, SSL will not be enabled.")
    }

    module {
        configureRouting()
        configureHTTP()
        configreLogging()
        install(DropwizardMetrics) {
            JmxReporter.forRegistry(registry)
                .convertRatesTo(TimeUnit.SECONDS)
                .convertDurationsTo(TimeUnit.MILLISECONDS)
                .build()
                .start()
        }
    }
}

private fun getKeystorePassword(): CharArray? {
    return App::class.java.getResourceAsStream("/keystore_password.txt")
        ?.readAllBytes()?.toString(Charset.defaultCharset())?.toCharArray()
}

private fun getKeystore(password: CharArray): KeyStore? {
    val keystoreFile = App::class.java.getResourceAsStream("/keystore.jks") ?: return null
    val keystore = KeyStore.getInstance(KeyStore.getDefaultType())
    keystore.load(keystoreFile, password)
    return keystore
}