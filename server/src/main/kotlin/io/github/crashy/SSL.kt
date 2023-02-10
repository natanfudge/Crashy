package io.github.crashy

import io.github.crashy.Crashy.Build.*
import io.github.crashy.Crashy.SSLPort
import io.github.crashy.utils.getResource
import io.ktor.server.engine.*
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
                port = SSLPort
                host = "0.0.0.0"
            }
        }
    } else {
        println("Warning: Could not find Keystore password, SSL will not be enabled.")
    }
}

private fun getKeystorePassword(): CharArray? {
    val password = when(Crashy.build){
        Local -> "/secrets/fake_keystore_password.txt"
        Beta ->  "/secrets/letsencrypt_keystore_password_beta.txt"
        Release ->  "/secrets/letsencrypt_keystore_password_release.txt"
    }
    return getResource(password)?.toCharArray()
}

private val keyStoreName = if (Crashy.isRelease()) "crashy_release_keystore" else "crashy_keystore"
private val realServerKeystoreFile = Paths.get("/etc/cert/$keyStoreName.jks")
private fun getKeystore(password: CharArray): KeyStore? {
    if (realServerKeystoreFile.exists()) {
        return KeyStore.getInstance(realServerKeystoreFile.toFile(), password)
    } else {
        val keystoreFile = AppKt::class.java.getResourceAsStream("/secrets/keystore.jks") ?: return null
        val keystore = KeyStore.getInstance(KeyStore.getDefaultType())
        keystore.load(keystoreFile, password)
        return keystore
    }
}