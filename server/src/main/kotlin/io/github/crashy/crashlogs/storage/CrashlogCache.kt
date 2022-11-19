package io.github.crashy.crashlogs.storage

import io.github.crashy.CrashyJson
import io.github.crashy.CrashyLogger
import io.github.crashy.crashlogs.*
import org.jetbrains.annotations.TestOnly
import java.nio.file.Path
import kotlin.io.path.*

//TODO: investigate whether it's possible to include external files in html file, and have those files be indexed by search engines
// https://moz.com/beginners-guide-to-seo/how-search-engines-operate
// then, supposing it works, template the crash with the metadata and attach the crash with the <link> or something.
// See https://stackoverflow.com/questions/74322790/expose-external-resource-to-search-engines


class CrashlogCache(parentDir: Path, private val clock: NowDefinition) {
    init {
        require(parentDir.exists())
    }

    // Crash logs are stored on a separate directory per ID, with the crashlog and metadata as separate files in that directory.
    private val crashes = parentDir.resolve("crashlogs").createDirectories()

    // The last day that crash logs were accessed are stored under /last_access, with a separate directory for each day
    // containing the ID of logs that their last access day is equal to said day as the file name.
    // This allows quickly figuring out which logs have not been accessed in a long time.
    // Days are in GMT.
    private val lastAccessDays = parentDir.resolve("last_access").createDirectories()
    fun store(id: CrashlogId, log: CrashlogEntry) {
        log.addToCrashesDir(id)
        storeLastAccessDay(id, clock.today())
    }


    fun get(id: CrashlogId): CrashlogEntry? {
        val lastAccessDay = CrashlogEntry.lastAccessDay(id) ?: return null

        updateLastAccessDay(id, oldLastAccessDay = lastAccessDay)
        return CrashlogEntry.fromCrashesDir(id)
    }

    fun peek(id: CrashlogId): CrashlogMetadata? {
        val lastAccessDay = CrashlogEntry.lastAccessDay(id) ?: return null

        updateLastAccessDay(id, oldLastAccessDay = lastAccessDay)
        return CrashlogEntry.peek(id)
    }

    /**
     * Returns true if something was deleted
     */
    fun delete(id: CrashlogId, key: DeletionKey): DeleteCrashResult {
        val oldLastAccessDay = CrashlogEntry.lastAccessDay(id) ?: return DeleteCrashResult.NoSuchId

        val correctKey = CrashlogEntry.peekDeletionKey(id)
        if (key != correctKey) {
            updateLastAccessDay(id, oldLastAccessDay)
            return DeleteCrashResult.IncorrectDeletionKey
        }

        deleteLastAccessDay(id, oldLastAccessDay)
        CrashlogEntry.deleteEntryFiles(id)
        return DeleteCrashResult.Success
    }

    private fun deleteLastAccessDay(id: CrashlogId, lastAccessDay: LastAccessDay) {
        locationOfLastAccessDay(id, lastAccessDay).deleteExisting()
    }

    suspend fun evictOld(onEvicted: suspend (CrashlogId, CrashlogEntry) -> Unit) {
        val existingDays = lastAccessDays.listDirectoryEntries().map { LastAccessDay.fromFileName(it.fileName) }
        val thirtyDaysAgo = clock.now().minusDays(30)
        val oldDays = existingDays.filter { it.toGmtZonedDateTime().isBefore(thirtyDaysAgo) }
        println("Evicting crashes from days: $oldDays")
        for (oldDay in oldDays) {
            val crashesDir = locationOfAllLastAccessDay(oldDay)
            val crashIds = crashesDir.listDirectoryEntries()
            println("Evicting ${crashIds.size} crashes from $oldDay.")
            for (crashIdFile in crashIds) {
                val crashId = CrashlogId.fromFileName(crashIdFile)
                // Archive crash to s3
                onEvicted(crashId, CrashlogEntry.fromCrashesDir(crashId))
                println("Archived $crashId to S3.")
                // Delete LastAccessDay -> crashId record from disk
                crashIdFile.deleteExisting()
                // Delete the crash files themselves
                CrashlogEntry.deleteEntryFiles(crashId)
            }
            crashesDir.deleteExisting()
        }
    }

    private fun updateLastAccessDay(id: CrashlogId, oldLastAccessDay: LastAccessDay) {
        val today = clock.today()
        // Only update last access day if the new day (today) is actually different from the old last access time
        if (oldLastAccessDay != today) {
            // Delete old lastDay file and create a new one at the updated day
            val deleted = locationOfLastAccessDay(id, oldLastAccessDay).deleteIfExists()
            if (!deleted) {
                locationOfLastAccessDay(id, today).deleteIfExists()
                CrashyLogger.warn("Could not find lastAccessDay of $id to delete.")
            }
            storeLastAccessDay(id, today)
        }
    }


    private fun locationOfLastAccessDay(id: CrashlogId, lastAccessDay: LastAccessDay): Path {
        return locationOfAllLastAccessDay(lastAccessDay).resolve(id.value.toString())
    }

    private fun storeLastAccessDay(id: CrashlogId, lastAccessDay: LastAccessDay) {
        val path = locationOfLastAccessDay(id, lastAccessDay)
        val parent = path.parent
        if (!parent.exists()) path.parent.createDirectories()
        path.createFile()
    }

    private fun locationOfAllLastAccessDay(lastAccessDay: LastAccessDay): Path {
        return lastAccessDays.resolve(lastAccessDay.toFileName())
    }

    private fun CrashlogEntry.addToCrashesDir(underId: CrashlogId) {
        val parentDir = crashes.crashParentDir(underId).createDirectory()
        val logFile = parentDir.compressedLogFile()
        val metadataFile = parentDir.crashMetadataFile()
        compressedLog.writeToFile(logFile)
        metadataFile.writeText(CrashyJson.encodeToString(CrashlogMetadata.serializer(), metadata))
    }

    private fun CrashlogEntry.Companion.fromCrashesDir(underId: CrashlogId): CrashlogEntry {
        val entryDir = crashes.crashParentDir(underId)
        val logFile = entryDir.compressedLogFile()
        return CrashlogEntry(CompressedLog.readFromFile(logFile), entryDir.readMetadataFromCrashEntryFolder())
    }

    private fun CrashlogEntry.Companion.peekDeletionKey(underId: CrashlogId): DeletionKey {
        return crashes.crashParentDir(underId).readMetadataFromCrashEntryFolder().deletionKey
    }

    private fun CrashlogEntry.Companion.peek(underId: CrashlogId): CrashlogMetadata {
        return crashes.crashParentDir(underId).readMetadataFromCrashEntryFolder()
    }

    private fun CrashlogEntry.Companion.deleteEntryFiles(underId: CrashlogId) {
        crashes.crashParentDir(underId).toFile().deleteRecursively()
    }

    private fun CrashlogEntry.Companion.lastAccessDay(ofId: CrashlogId): LastAccessDay? {
        val file = crashes.crashParentDir(ofId).crashMetadataFile()
        if (!file.exists()) return null
        return lastAccessDay(file)
    }

    companion object {
        @TestOnly
        fun __testGetMetadataFile(cacheParentDir: Path, id: CrashlogId): Path {
            return cacheParentDir.resolve("crashlogs").crashParentDir(id).crashMetadataFile()
        }
    }
}


private fun Path.crashParentDir(id: CrashlogId) = resolve(id.value.toString())
private fun Path.compressedLogFile() = resolve("crash.br")
private fun Path.crashMetadataFile() = resolve("meta.json")

private fun Path.readMetadataFromCrashEntryFolder(): CrashlogMetadata {
    return CrashyJson.decodeFromString(CrashlogMetadata.serializer(), crashMetadataFile().readText())
}
