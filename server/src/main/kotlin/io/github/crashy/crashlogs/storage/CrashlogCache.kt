package io.github.crashy.crashlogs.storage

import java.nio.file.Path
import java.util.*
import kotlin.io.path.*


class CrashlogCache(parentDir: Path, private val clock: NowProvider) {
    // Full compressed crash logs are stored under /crashlogs, with their ID as the file name
    private val crashes = parentDir.resolve("crashlogs")

    // The last day that crash logs were accessed are stored under /last_access, with a separate directory for each day
    // containing the ID of logs that their last access day is equal to said day as the file name.
    // This allows quickly figuring out which logs have not been accessed in a long time.
    // Days are in GMT.
    private val lastAccessDays = parentDir.resolve("last_access")
    fun store(id: CrashlogId, log: CompressedCrashlog) {
        val crashFile = locationOfCrash(id)
        val lastAccessFile = locationOfLastAccessDay(id, clock.today())

        crashFile.writeBytes(log.bytes)
        lastAccessFile.createFile()
    }


    fun get(id: CrashlogId): CompressedCrashlog? {
        val crashFile = locationOfCrash(id)
        if (!crashFile.exists()) return null

        updateLastAccessDay(crashFile, id)
        return CompressedCrashlog(crashFile.readBytes())
    }

    private fun updateLastAccessDay(crashFile: Path, id: CrashlogId) {
        val today = clock.today()
        val lastAccessDay = lastAccessDay(crashFile)
        // Only update last access day if the new day (today) is actually different from the old last access time
        if (lastAccessDay != today) {
            // Delete old lastDay file and create a new one at the updated day
            locationOfLastAccessDay(id, lastAccessDay).deleteExisting()
            locationOfLastAccessDay(id, today).createFile()
        }
    }

    fun evictOld() {
        val existingDays =
            lastAccessDays.listDirectoryEntries().map { LastAccessDay.fromString(it.fileName.toString()) }
        val thirtyDaysAgo = clock.now().minusDays(30)
        val oldDays = existingDays.filter { it.toGmtZonedDateTime().isBefore(thirtyDaysAgo) }
        println("Evicting crashes from days: $oldDays")
        for (oldDay in oldDays) {
            val crashesDir = locationOfAllLastAccessDay(oldDay)
            val crashes = crashesDir.listDirectoryEntries()
            println("Evicting ${crashes.size} crashes from $oldDay.")
            for (crash in crashes) {
                // Archive crash to s3
                archiveCrash(idFromCrashFile(crash))
                // Delete crash from disk
                crash.deleteExisting()
            }
            crashesDir.deleteExisting()
        }
    }

    private fun archiveCrash(id: CrashlogId) {
        TODO("Use s3")
    }

    private fun locationOfCrash(id: CrashlogId) = crashes.resolve(id.value.toString() + ".crash")

    private fun idFromCrashFile(path: Path) = CrashlogId(UUID.fromString(path.nameWithoutExtension))
    private fun locationOfLastAccessDay(id: CrashlogId, lastAccessDay: LastAccessDay): Path {
        return locationOfAllLastAccessDay(lastAccessDay).resolve(id.value.toString())
    }

    private fun locationOfAllLastAccessDay(lastAccessDay: LastAccessDay): Path {
        return lastAccessDays.resolve(lastAccessDay.toString())
    }

}


inline class CrashlogId(val value: UUID)
inline class CompressedCrashlog(val bytes: ByteArray)



