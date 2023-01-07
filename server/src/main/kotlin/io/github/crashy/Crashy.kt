package io.github.crashy

import io.github.crashy.Crashy.Build.*
import kotlinx.serialization.json.Json
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import java.nio.file.Paths
import kotlin.io.path.toPath

object Crashy {
    val json = Json
    val logger: Logger = LoggerFactory.getLogger(App::class.java)

    //TODO: update build.txt to release
    val build = readBuild()

    fun isLocal() = build == Local

    val domain = when (build) {
        Local -> "localhost:80"
        Beta -> "beta.crashy.net"
        Release -> "crashy.net"
    }

    private fun readBuild(): Build {
        // Build file is only included in the jar uploaded to EC2
        val buildFile = Crashy::class.java.getResource("/build.txt") ?: return Local
        return when (val build = buildFile.readText()) {
            "beta" -> Beta
            "release" -> Release
            else -> error("Unexpected crashy build: $build")
        }
    }

    enum class Build {
        Local, Beta, Release
    }

    val RunDir = AC::class.java.protectionDomain.codeSource.location.toURI().toPath().parent.resolve("serverRun")
    val HomeDir = Paths.get(System.getProperty("user.home"), ".crashy")
    val StaticPath = "static"
    val StaticDir = RunDir.resolve(StaticPath)
}