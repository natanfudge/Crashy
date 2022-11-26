package io.github.crashy.utils

import java.nio.file.Path

//TODO: do a simpler journal-based LRU cache

/**
 * Tracks file storage in a way that allows quickly retrieving items that haven't been accessed in a long time
 */
class FileAccessTracker(private val rootDir: Path) {
//    val x = DiskLruCache
}