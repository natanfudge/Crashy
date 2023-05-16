package io.github.crashy.crashlogs.storage


import io.github.crashy.Crashy
import io.github.crashy.crashlogs.*
import io.github.natanfudge.logs.LogContext
import org.jetbrains.annotations.TestOnly
import java.nio.file.Path
import kotlin.io.path.*


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
    context(LogContext)
    fun store(id: CrashlogId, log: CrashlogEntry) {
        log.addToCrashesDir(id)
        storeLastAccessDay(id, clock.today())
    }

    context (LogContext)
    fun get(id: CrashlogId): CrashlogEntry? {
        val lastAccessDay = CrashlogEntry.lastAccessDay(id) ?: return null

        updateLastAccessDay(id, oldLastAccessDay = lastAccessDay)
        return CrashlogEntry.fromCrashesDir(id)
    }

    context(LogContext)
    fun peek(id: CrashlogId): CrashlogMetadata? {
        val lastAccessDay = CrashlogEntry.lastAccessDay(id) ?: return null

        updateLastAccessDay(id, oldLastAccessDay = lastAccessDay)
        return CrashlogEntry.peek(id)
    }


    /**
     * Returns true if something was deleted
     */
    context(LogContext)
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
        lastAccessDayPath(id, lastAccessDay).deleteExisting()
    }

    private val daysToEvictCrash = 30L

    context(LogContext)
    @OptIn(ExperimentalPathApi::class)
    suspend fun evictOld(onEvicted: suspend (CrashlogId, CrashlogEntry) -> Unit) {
        val existingDays = lastAccessDays.listDirectoryEntries().map { LastAccessDay.fromFileName(it.fileName) }
        val thirtyDaysAgo = clock.now().minusDays(daysToEvictCrash)
        val oldDays = existingDays.filter { it.toGmtZonedDateTime().isBefore(thirtyDaysAgo) }
        logInfo { "Evicting crashes from days: $oldDays" }
        for (oldDay in oldDays) {
            val crashesLastAccessedAtOldDay = crashesLastAccessedAtDay(oldDay)
            val crashIds = crashesLastAccessedAtOldDay.listDirectoryEntries()
            logInfo { "Evicting ${crashIds.size} crashes from $oldDay." }
            for (crashIdFile in crashIds) {
                val crashId = CrashlogId.fromFileName(crashIdFile)
                // Archive crash to s3
                val entry = CrashlogEntry.fromCrashesDir(crashId)
                if (entry != null) {
                    onEvicted(crashId, entry)
                    logInfo { "Archived $crashId to S3." }
                    // Delete LastAccessDay -> crashId record from disk
                    crashIdFile.deleteExisting()
                    // Delete the crash files themselves
                    CrashlogEntry.deleteEntryFiles(crashId)
                } else {
                    logWarn { "Could not archive $crashId because the entry could not be read." }
                }

            }
            crashesLastAccessedAtOldDay.deleteRecursively()
        }
    }

    context (LogContext)
    private fun updateLastAccessDay(id: CrashlogId, oldLastAccessDay: LastAccessDay) {
        val today = clock.today()
        // Only update last access day if the new day (today) is actually different from the old last access time
        if (oldLastAccessDay != today) {
            // Delete old lastDay file and create a new one at the updated day
            val deleted = lastAccessDayPath(id, oldLastAccessDay).deleteIfExists()
            if (!deleted) {
                lastAccessDayPath(id, today).deleteIfExists()
                logWarn { "Could not find lastAccessDay of $id to delete." }
                logData("old lastAccessDay") { oldLastAccessDay }
                logData("today") { oldLastAccessDay }
                logData("lastAccessDay old location") { lastAccessDayPath(id, oldLastAccessDay) }
                logData("lastAccessDay today location") { lastAccessDayPath(id, today) }
                logData("contents of oldLastAccessDay dir") { crashesLastAccessedAtDay(oldLastAccessDay).listDirectoryEntries() }
            }
            storeLastAccessDay(id, today)
        }
    }


    private fun lastAccessDayPath(id: CrashlogId, lastAccessDay: LastAccessDay): Path {
        return crashesLastAccessedAtDay(lastAccessDay).resolve(id.value.toString())
    }

    context (LogContext)
    private fun storeLastAccessDay(id: CrashlogId, lastAccessDay: LastAccessDay) {
        val path = lastAccessDayPath(id, lastAccessDay)
        val parent = path.parent
        if (!parent.exists()) path.parent.createDirectories()
        if (!path.exists()) {
            path.createFile()
        } else {
            logWarn { "LastAccessDay at $path already exists. Maybe there were issues archiving this?" }
        }
    }

    private fun crashesLastAccessedAtDay(lastAccessDay: LastAccessDay): Path {
        return lastAccessDays.resolve(lastAccessDay.toFileName())
    }

    private fun CrashlogEntry.addToCrashesDir(underId: CrashlogId) {
        val parentDir = crashes.crashParentDir(underId).createDirectory()
        val logFile = parentDir.compressedLogFile()
        val metadataFile = parentDir.crashMetadataFile()
        compressedLog.writeToFile(logFile)
        metadataFile.writeText(Crashy.json.encodeToString(CrashlogMetadata.serializer(), metadata))
    }

    context(LogContext)
    private fun CrashlogEntry.Companion.fromCrashesDir(underId: CrashlogId): CrashlogEntry? {
        val entryDir = crashes.crashParentDir(underId)
        if (!entryDir.exists()) {
            logWarn { "Directory of crash id $underId at '$entryDir' is gone!" }
            return null
        }
        val logFile = entryDir.compressedLogFile()
        if (!logFile.exists()) {
            logWarn { "Log file is missing from entry directory of crash id $underId! It's supposed to exist at $logFile." }
        }
        return CrashlogEntry(
            CompressedLog.readFromFile(logFile),
            entryDir.readMetadataFromCrashEntryFolder() ?: return null
        )
    }

    context (LogContext)
    private fun CrashlogEntry.Companion.peekDeletionKey(underId: CrashlogId): DeletionKey? {
        return crashes.crashParentDir(underId).readMetadataFromCrashEntryFolder()?.deletionKey
    }

    context (LogContext)
    private fun CrashlogEntry.Companion.peek(underId: CrashlogId): CrashlogMetadata? {
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
context (LogContext)
private fun Path.readMetadataFromCrashEntryFolder(): CrashlogMetadata? {
    val file = crashMetadataFile()
    if (!file.exists()) {
        logWarn { "Metadata file is missing from entry directory at $this!" }
        return null
    }
    return Crashy.json.decodeFromString(CrashlogMetadata.serializer(), crashMetadataFile().readText())
}
