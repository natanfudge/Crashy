package io.github.crashy

import io.ktor.server.engine.*
import java.nio.charset.Charset
import java.nio.file.Paths
import java.security.KeyStore
import kotlin.io.path.exists

 fun ApplicationEngineEnvironmentBuilder.configureSSL() {
    val keystorePassword = getKeystorePassword()
    if (keystorePassword != null) {
        val keyStore = getKeystore(keystorePassword)
        if (keyStore != null) {
            sslConnector(
                keyStore = keyStore,
                keyAlias = if (!Crashy.isLocal()) "CrashyCertificate" else "sampleAlias",
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
}

private fun getKeystorePassword(): CharArray? {
    val password = if (!Crashy.isLocal()) "/letsencrypt_keystore_password.txt" else "/fake_keystore_password.txt"
    return App::class.java.getResourceAsStream(password)
        ?.readAllBytes()?.toString(Charset.defaultCharset())?.toCharArray()
}

private val keyStoreName = if (Crashy.build == Crashy.Build.Release) "crashy_release_keystore" else "crashy_keystore"
private val realServerKeystoreFile = Paths.get("/etc/cert/$keyStoreName.jks")
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