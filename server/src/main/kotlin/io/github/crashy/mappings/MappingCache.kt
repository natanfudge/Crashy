package io.github.crashy.mappings

import io.github.crashy.utils.readString
import io.github.crashy.utils.writeString
import okhttp3.internal.cache.DiskLruCache
import okhttp3.internal.concurrent.TaskRunner
import okio.FileSystem
import okio.Path.Companion.toOkioPath
import java.nio.file.Path

class MappingsCache(directory: Path, size: Long) {
    private val fileSystem = FileSystem.SYSTEM
    private val cache = DiskLruCache(
        fileSystem, directory.toOkioPath(),
        appVersion = 1, valueCount = 1,
        maxSize = size, // 100KB
        taskRunner = TaskRunner.INSTANCE,
    )

    fun get(id: MappingsId): String? {
        return cache[id.key()]?.use { it.readString(0) }
    }

    fun store(id: MappingsId, mappings: String) {
        val editor = cache.edit(id.key()) ?: error("Failed to create entry of mappings with id '$id'")
        editor.writeString(0, mappings)
        editor.commit()
    }

    private fun MappingsId.key() =
        "${namespace.toString().lowercase()}_${version.mcVersion.replace(".", "_")}-${version.build}"
}

