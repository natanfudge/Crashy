package io.github.crashy

import io.ktor.server.application.*
import org.reflections.Reflections
import org.reflections.scanners.Scanners
import java.nio.file.Paths
import kotlin.io.path.*

val runDir = AC::class.java.protectionDomain.codeSource.location.toURI().toPath().parent.resolve("serverRun")
val staticPath = "static"
val staticDir = runDir.resolve(staticPath)

object AC

/**
 * Ktor doesn't support serving precompressed files out of the 'resources' folder, so we copy the resources to a real folder
 * and serve it from there. Also this is more efficient since it doesn't need to extract it from the jar every time I believe.
 */
fun copyResourcesForServing() {
    val reflections = Reflections(staticPath, Scanners.Resources)
    val resourceList = reflections.getResources(".*")
    staticDir.toFile().deleteRecursively()
    staticDir.createDirectories()
    println("Setting $runDir as run directory")
    for (resource in resourceList) {
        val target = runDir.resolve(resource)
        target.parent.createDirectories()
        val source = "/$resource"
        val bytes = AC::class.java.getResource(source).readBytes()
        target.writeBytes(bytes)
    }

}