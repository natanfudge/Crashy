package io.github.crashy

import io.github.crashy.Crashy.Build.*
import io.github.crashy.utils.getResource
import io.github.natanfudge.logs.Loggy
import io.github.natanfudge.logs.impl.LoggingCredentials
import kotlinx.serialization.json.Json
import kotlinx.serialization.protobuf.ProtoBuf
import java.nio.file.Path
import java.nio.file.Paths
import kotlin.io.path.toPath

object Crashy {
    val json = Json
    val protobuf = ProtoBuf { }

    private val build = readBuild()

    fun isLocal() = build == Local || build == SecondLocal

    fun isSecondaryInstance() = build == Beta || build == SecondLocal

    val SSLPort = if (isSecondaryInstance()) 4433 else 443

    fun isRelease() = build == Release

    val domain = when (build) {
        Local -> "localhost:80"
        Beta -> "crashy.net:4433"
        Release -> "crashy.net"
        SecondLocal -> "localhost:4433"
    }

    private fun readBuild(): Build {
        // Release: we have a release.txt file
        val releaseFile = Crashy::class.java.getResource("/release.txt")
        if (releaseFile != null) return Release
        // Beta: we have a beta.txt file
        val betaFile = Crashy::class.java.getResource("/beta.txt")
        if (betaFile != null) return Beta
        // Second Local server - we have a secondLocal.txt file
        val secondLocalFile = Crashy::class.java.getResource("/secondLocal.txt")
        if (secondLocalFile != null) return SecondLocal

        // No file: it's local
        return Local
    }

    enum class Build {
        Local, SecondLocal, Beta, Release
    }

    val RunDir: Path = AC::class.java.protectionDomain.codeSource.location.toURI().toPath().parent
        .resolve(if(isSecondaryInstance()) "betaServerRun" else "serverRun")
    val HomeDir: Path = Paths.get(System.getProperty("user.home"), if (Crashy.isSecondaryInstance()) ".crashy_beta" else ".crashy")
    const val StaticPath = "static"
    val StaticDir: Path = RunDir.resolve(StaticPath)

    const val S3CrashlogBucket = "crashy-crashlogs"


    // For some reason it calls the constructor twice if i init it inside the object so we init it outside
    val logger get() = loggerInit
}

private val loggerInit = Loggy.create(
    logToConsole = true,
    logsDir = Crashy.HomeDir.resolve("logs"),
    credentials = LoggingCredentials(
        username = getResource("/secrets/admin_user.txt")!!.toCharArray(),
        password = getResource("/secrets/admin_pass.txt")!!.toCharArray()
    )
)
