package io.github.crashy

import com.aayushatharva.brotli4j.Brotli4jLoader
import com.codahale.metrics.jmx.JmxReporter
import io.github.crashy.plugins.configreLogging
import io.github.crashy.plugins.configureHTTP
import io.ktor.server.application.*
import io.ktor.server.engine.*
import io.ktor.server.metrics.dropwizard.*
import io.ktor.server.netty.*
import kotlinx.serialization.json.Json
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import java.nio.charset.Charset
import java.nio.file.Paths
import java.security.KeyStore
import java.util.concurrent.TimeUnit
import kotlin.io.path.exists

object App

object Crashy {
    val json = Json
    val logger: Logger = LoggerFactory.getLogger(App::class.java)

    //TODO: update build.txt to release
    val build = readBuild()
    private fun readBuild(): Build {
        // Build file is only included in the jar uploaded to EC2
        val buildFile = Crashy::class.java.getResource("/build.txt") ?: return Build.Local
        return when (val build = buildFile.readText()) {
            "beta" -> Build.Beta
            "release" -> Build.Release
            else -> error("Unexpected crashy build: $build")
        }
    }

    enum class Build {
        Local, Beta, Release
    }
}


fun main() {
    Brotli4jLoader.ensureAvailability()
    copyStaticResourcesForServing()
    embeddedServer(Netty, environment = createAppEnvironment()).start(wait = true)
}

private val realServerKeystoreFile = Paths.get("/etc/cert/crashy_keystore.jks")
private val isRealServer = realServerKeystoreFile.exists()

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
                keyAlias = if (isRealServer) "CrashyCertificate" else "sampleAlias",
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
    val password = if (isRealServer) "/letsencrypt_keystore_password.txt" else "/fake_keystore_password.txt"
    return App::class.java.getResourceAsStream(password)
        ?.readAllBytes()?.toString(Charset.defaultCharset())?.toCharArray()
}

private fun getKeystore(password: CharArray): KeyStore? {
    if (realServerKeystoreFile.exists()) {
        return KeyStore.getInstance(realServerKeystoreFile.toFile(), password)
    } else {
        val keystoreFile = App::class.java.getResourceAsStream("/keystore.jks") ?: return null
        val keystore = KeyStore.getInstance(KeyStore.getDefaultType())
        keystore.load(keystoreFile, password)
        return keystore
    }
}