package io.github.crashy

import io.github.crashy.plugins.configureHTTP
import io.github.crashy.plugins.configureMonitoring
import io.github.crashy.plugins.configureRouting
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import java.nio.charset.Charset
import java.security.KeyStore

object Application

fun main() {
    copyResourcesForServing()
    val environment = applicationEngineEnvironment {
        connector {
            port = 80
            host = "0.0.0.0"
        }
        val keystorePassword = getKeystorePassword()
        val keyStore = getKeystore(keystorePassword)
        sslConnector(
            keyStore = keyStore,
            keyAlias = "sampleAlias",
            keyStorePassword = { keystorePassword },
            privateKeyPassword = { keystorePassword }
        ) {
            port = 443
            host = "0.0.0.0"
        }
        module {
            configureRouting()
            configureHTTP()
            configureMonitoring()
        }
    }
    embeddedServer(Netty, environment).start(wait = true)
}

private fun getKeystorePassword(): CharArray {
    return Application::class.java.getResourceAsStream("/keystore_password.txt")!!
        .readAllBytes().toString(Charset.defaultCharset()).toCharArray()
}

private fun getKeystore(password: CharArray): KeyStore {
    val keystoreFile = Application::class.java.getResourceAsStream("/keystore.jks")
    val keystore = KeyStore.getInstance(KeyStore.getDefaultType())
    keystore.load(keystoreFile, password)
    return keystore
}