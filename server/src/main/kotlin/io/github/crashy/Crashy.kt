package io.github.crashy

import io.github.crashy.Crashy.Build.*
import kotlinx.serialization.json.Json
import kotlinx.serialization.protobuf.ProtoBuf
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import java.nio.file.Path
import java.nio.file.Paths
import kotlin.io.path.toPath

object Crashy {
    val json = Json
    val protobuf = ProtoBuf { }
    val logger: Logger = LoggerFactory.getLogger(AppKt::class.java)

    val build = readBuild()

    fun isLocal() = build == Local

    fun isBeta() = build == Beta

    val SSLPort = if(isBeta()) 4433 else 443

    fun isRelease() = build == Release

    val domain = when (build) {
        Local -> "localhost:80"
        Beta -> "crashy.net"
        Release -> "crashy.net"
    }

    private fun readBuild(): Build {
        // Release: we have a release.txt file
        val releaseFile = Crashy::class.java.getResource("/release.txt")
        if (releaseFile != null) return Release
        // Beta: we have a beta.txt file
        val betaFile = Crashy::class.java.getResource("/beta.txt")
        if (betaFile != null) return Beta
        // No file: it's local
        return Local
    }

    enum class Build {
        Local, Beta, Release
    }

    val RunDir: Path = AC::class.java.protectionDomain.codeSource.location.toURI().toPath().parent.resolve("serverRun")
    val HomeDir: Path = Paths.get(System.getProperty("user.home"), ".crashy")
    const val StaticPath = "static"
    val StaticDir: Path = RunDir.resolve(StaticPath)

    const val S3CrashlogBucket = "crashy-crashlogs"
}