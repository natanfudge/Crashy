package io.github.crashy

import org.reflections.Reflections
import org.reflections.scanners.Scanners
import kotlin.io.path.createDirectories
import kotlin.io.path.writeBytes


object AC

/**
 * Ktor doesn't support serving precompressed files out of the 'resources' folder, so we copy the resources to a real folder
 * and serve it from there. Also this is more efficient since it doesn't need to extract it from the jar every time I believe.
 */
fun copyStaticResourcesForServing() {
    val reflections = Reflections(Crashy.StaticPath, Scanners.Resources)
    val resourceList = reflections.getResources(".*")
    Crashy.StaticDir.toFile().deleteRecursively()
    Crashy.StaticDir.createDirectories()
    println("Setting ${Crashy.RunDir} as run directory")
    println("Setting ${Crashy.HomeDir} as home directory")
    Crashy.HomeDir.createDirectories()
    for (resource in resourceList) {
        val target = Crashy.RunDir.resolve(resource)
        target.parent.createDirectories()
        val source = "/$resource"
        val bytes = AC::class.java.getResource(source).readBytes()
        target.writeBytes(bytes)
    }

}