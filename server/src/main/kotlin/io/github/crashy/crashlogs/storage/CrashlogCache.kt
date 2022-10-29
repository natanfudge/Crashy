package io.github.crashy.crashlogs.storage

import io.github.crashy.crashlogs.CrashlogEntry
import io.github.crashy.crashlogs.CrashlogId
import io.github.crashy.crashlogs.DeleteCrashResult
import io.github.crashy.crashlogs.DeletionKey
import java.nio.file.Path
import kotlin.io.path.*


class CrashlogCache(parentDir: Path, private val clock: NowDefinition) {
    init {
        require(parentDir.exists())
    }

    // Full compressed crash logs are stored under /crashlogs, with their ID as the file name
    private val crashes = parentDir.resolve("crashlogs").createDirectories()

    // The last day that crash logs were accessed are stored under /last_access, with a separate directory for each day
    // containing the ID of logs that their last access day is equal to said day as the file name.
    // This allows quickly figuring out which logs have not been accessed in a long time.
    // Days are in GMT.
    private val lastAccessDays = parentDir.resolve("last_access").createDirectories()
    fun store(id: CrashlogId, log: CrashlogEntry) {
        val crashFile = locationOfCrash(id)

        log.writeToFile(crashFile)
        storeLastAccessDay(id, clock.today())
    }


    fun get(id: CrashlogId): CrashlogEntry? {
        val crashFile = locationOfCrash(id)
        if (!crashFile.exists()) return null

        updateLastAccessDay(id, oldLastAccessDay = lastAccessDay(crashFile))
        return CrashlogEntry.read(crashFile)
    }

    /**
     * Returns true if something was deleted
     */
    fun delete(id: CrashlogId, key: DeletionKey): DeleteCrashResult {
        val crashFile = locationOfCrash(id)
        if (!crashFile.exists()) return DeleteCrashResult.NoSuchId

        val oldLastAccessDay = lastAccessDay(crashFile)
        val correctKey = CrashlogEntry.peekDeletionKey(crashFile)
        if (key != correctKey) {
            updateLastAccessDay(id, oldLastAccessDay)
            return DeleteCrashResult.IncorrectDeletionKey
        }

        deleteLastAccessDay(id, oldLastAccessDay)
        crashFile.deleteExisting()
        return DeleteCrashResult.Success
    }

    private fun deleteLastAccessDay(id: CrashlogId, lastAccessDay: LastAccessDay) {
        locationOfLastAccessDay(id, lastAccessDay).deleteExisting()
    }

    suspend fun evictOld(onEvicted: suspend (CrashlogId, CrashlogEntry.ContiguousArrayBacked) -> Unit) {
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
                val crashFile = locationOfCrash(crashId)
                // Archive crash to s3
                onEvicted(crashId, CrashlogEntry.read(crashFile))
                println("Archived $crashId to S3.")
                // Delete LastAccessDay -> crashId record from disk
                crashIdFile.deleteExisting()
                // Delete the crash file itself
                crashFile.deleteExisting()
            }
            crashesDir.deleteExisting()
        }
    }

    private fun updateLastAccessDay(id: CrashlogId, oldLastAccessDay: LastAccessDay) {
        val today = clock.today()
        // Only update last access day if the new day (today) is actually different from the old last access time
        if (oldLastAccessDay != today) {
            // Delete old lastDay file and create a new one at the updated day
            locationOfLastAccessDay(id, oldLastAccessDay).deleteExisting()
            storeLastAccessDay(id, today)
        }
    }

    private fun locationOfCrash(id: CrashlogId) = crashes.resolve(id.value.toString() + ".crash")

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

}


