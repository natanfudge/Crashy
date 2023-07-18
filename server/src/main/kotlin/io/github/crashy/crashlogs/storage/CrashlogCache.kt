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

    // Every relevant day has a directory under /last_access that contains all the crash logs that were last accessed that day.
    // This directory is called the 'day index' for that specific day.
    // This allows quickly figuring out which logs have not been accessed in a long time.
    // Days are in GMT.
    private val dayIndex = parentDir.resolve("last_access").createDirectories()
    context(LogContext)
    fun store(id: CrashlogId, log: CrashlogEntry) {
        log.addToCrashesDir(id)
        addCrashToDayIndex(id, clock.today())
    }

    context (LogContext)
    fun get(id: CrashlogId): CrashlogEntry? {
        val lastAccessDay = CrashlogEntry.peekLastAccessDay(id) ?: return null
        //TODO: delete this
        logInfo { "Getting crash log" }

        updateDayIndex(id, oldLastAccessDay = lastAccessDay)
        return CrashlogEntry.fromCrashesDir(id)
    }

    context(LogContext)
    fun peek(id: CrashlogId): CrashlogMetadata? {
        val lastAccessDay = CrashlogEntry.peekLastAccessDay(id) ?: return null

        updateDayIndex(id, oldLastAccessDay = lastAccessDay)
        return CrashlogEntry.peek(id)
    }


    /**
     * Returns true if something was deleted
     */
    context(LogContext)
    fun delete(id: CrashlogId, key: DeletionKey): DeleteCrashResult {
        val oldLastAccessDay = CrashlogEntry.peekLastAccessDay(id) ?: return DeleteCrashResult.NoSuchId

        val correctKey = CrashlogEntry.peekDeletionKey(id)
        if (key != correctKey) {
            updateDayIndex(id, oldLastAccessDay)
            return DeleteCrashResult.IncorrectDeletionKey
        }

        deleteLastAccessDay(id, oldLastAccessDay)
        CrashlogEntry.deleteEntryFiles(id)
        return DeleteCrashResult.Success
    }

    private fun deleteLastAccessDay(id: CrashlogId, lastAccessDay: LastAccessDay) {
        dayIndexPath(id, lastAccessDay).deleteExisting()
    }

    private val daysToEvictCrash = 30L

    context(LogContext)
    @OptIn(ExperimentalPathApi::class)
    suspend fun evictOld(onEvicted: suspend (CrashlogId, CrashlogEntry) -> Unit) {
        val existingDays = dayIndex.listDirectoryEntries().map { LastAccessDay.fromFileName(it.fileName) }
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

    ///   /root/.crashy/cache/crashlogs/0ed50914-1646-68c2-07bd-11dee21dcd14/meta.json
//    /root/.crashy/cache/crashlogs/0ed50914-1646-68c2-07bd-11dee21dcd14/meta.json
    context (LogContext)
    private fun updateDayIndex(id: CrashlogId, oldLastAccessDay: LastAccessDay) {
        val today = clock.today()
        // Only update last access day if the new day (today) is actually different from the old last access time
        if (oldLastAccessDay != today) {
            // Delete old lastDay file and create a new one at the updated day
            val deleted = dayIndexPath(id, oldLastAccessDay).deleteIfExists()
            if (!deleted) {
                dayIndexPath(id, today).deleteIfExists()
                logWarn { "Could not find day index of $id at day $oldLastAccessDay to delete." }
//                val metadataFile = crashes.crashParentDir(id).crashMetadataFile()
//                logData("Crash metadata file location") { metadataFile.absolute() }
//                logData("Crash metadata last access day") { lastAccessDay(metadataFile) }
                logData("old lastAccessDay") { oldLastAccessDay }
                logData("today") { today }
                logData("day index old location") { dayIndexPath(id, oldLastAccessDay) }
                logData("day index today location") { dayIndexPath(id, today) }
//                logData("contents of oldLastAccessDay dir") {
//                    val path = crashesLastAccessedAtDay(oldLastAccessDay)
//                    if (path.exists()) {
//                        logInfo { "$path exists." }
//                        path.listDirectoryEntries()
//                    } else "Dir Doesn't exist"
//                }
            }
            addCrashToDayIndex(id, today)
        }
    }


    private fun dayIndexPath(id: CrashlogId, lastAccessDay: LastAccessDay): Path {
        return crashesLastAccessedAtDay(lastAccessDay).resolve(id.value.toString())
    }

    context (LogContext)
    private fun addCrashToDayIndex(id: CrashlogId, lastAccessDay: LastAccessDay, oldLastAccessDay: LastAccessDay? = null) {
        val path = dayIndexPath(id, lastAccessDay)
        val parent = path.parent
        if (!parent.exists()) path.parent.createDirectories()
        if (!path.exists()) {
            path.createFile()
            logInfo { "Indexed last access day of $id at $path" }
        } else {
            logData("lastAccessDay") { lastAccessDay }
            logData("oldLastAccessDay") { oldLastAccessDay ?: "null" }
            logWarn { "Day index at $path already exists. Maybe there were issues archiving this?" }
        }
    }

    private fun crashesLastAccessedAtDay(lastAccessDay: LastAccessDay): Path {
        return dayIndex.resolve(lastAccessDay.toFileName())
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
        //TODo: delete this
        logInfo { "Getting from crashes dir" }
        return CrashlogEntry(
            CompressedLog.readFromFile(logFile),
            entryDir.readMetadataFromCrashEntryFolder(updateLastAccessTime = true) ?: return null
        )
    }

    context (LogContext)
    private fun CrashlogEntry.Companion.peekDeletionKey(underId: CrashlogId): DeletionKey? {
        return crashes.crashParentDir(underId).readMetadataFromCrashEntryFolder(updateLastAccessTime = false)?.deletionKey
    }

    context (LogContext)
    private fun CrashlogEntry.Companion.peek(underId: CrashlogId): CrashlogMetadata? {
        return crashes.crashParentDir(underId).readMetadataFromCrashEntryFolder(updateLastAccessTime = false)
    }

    private fun CrashlogEntry.Companion.deleteEntryFiles(underId: CrashlogId) {
        crashes.crashParentDir(underId).toFile().deleteRecursively()
    }

    context(LogContext)
    private fun CrashlogEntry.Companion.peekLastAccessDay(ofId: CrashlogId): LastAccessDay? {
        val crashParent = crashes.crashParentDir(ofId)
        // We need the file itself for backwards compatibility
        val file = crashParent.crashMetadataFile()
        if (!file.exists()) return null
        val metadata = crashParent.readMetadataFromCrashEntryFolder(updateLastAccessTime = false) ?: return null
        return metadata.getLastAccessDay(file)
    }

    companion object {
        @Suppress("FunctionName")
        @TestOnly
        fun __testGetMetadataFile(cacheParentDir: Path, id: CrashlogId): Path {
            return cacheParentDir.resolve("crashlogs").crashParentDir(id).crashMetadataFile()
        }
    }
}


private fun Path.crashParentDir(id: CrashlogId) = resolve(id.value.toString())
private fun Path.compressedLogFile() = resolve("crash.br")
private fun Path.crashMetadataFile() = resolve("meta.json")

/**
 * 'Peeking' doesn't update the [updateLastAccessTime], so it doesn't think the file was accessed.
 */
context (LogContext)
private fun Path.readMetadataFromCrashEntryFolder(updateLastAccessTime: Boolean): CrashlogMetadata? {
    synchronized(this) {
        val file = crashMetadataFile()
        if (!file.exists()) {
            logWarn { "Metadata file is missing from entry directory at $this!" }
            return null
        }

        val metadata = Crashy.json.decodeFromString(CrashlogMetadata.serializer(), file.readText())
        //TODO: delete this
        logInfo { "Reading metadata with update = $updateLastAccessTime" }
        if (updateLastAccessTime) {
            val today = LastAccessDay.today()
            logInfo { "Updating last access day at $file to be $today" }
            val updatedMetadata = metadata.copy(lastAccessDay = today)
            file.writeText(Crashy.json.encodeToString(CrashlogMetadata.serializer(), updatedMetadata))
        } else {
            //TODO: delete this
            logInfo { "Not updating lastAccessTime" }
        }
        return metadata
    }
}

