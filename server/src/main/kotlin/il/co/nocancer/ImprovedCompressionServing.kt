package il.co.nocancer

import io.ktor.server.application.*
import org.reflections.Reflections
import org.reflections.scanners.Scanners
import java.nio.file.Paths
import kotlin.io.path.*

val runDir = AC::class.java.protectionDomain.codeSource.location.toURI().toPath().parent.resolve("serverRun")
val staticPath = "static"
val staticDir = runDir.resolve(staticPath)

object AC

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