package io.github.crashy.crashlogs.storage

import aws.smithy.kotlin.runtime.content.ByteStream
import aws.smithy.kotlin.runtime.content.toByteArray
import java.nio.file.Path
import java.util.*
import kotlin.io.path.*
import kotlin.random.Random


class CrashlogCache(parentDir: Path, private val clock: NowDefinition) {
    init {
        require(parentDir.exists())
    }

    // Full compressed crash logs are stored under /crashlogs, with their ID as the file name
    private val crashes = parentDir.resolve("crashlogs").createDirectory()

    // The last day that crash logs were accessed are stored under /last_access, with a separate directory for each day
    // containing the ID of logs that their last access day is equal to said day as the file name.
    // This allows quickly figuring out which logs have not been accessed in a long time.
    // Days are in GMT.
    private val lastAccessDays = parentDir.resolve("last_access").createDirectory()
    fun store(id: CrashlogId, log: CompressedCrashlog) {
        val crashFile = locationOfCrash(id)

        crashFile.writeBytes(log.bytes)
        storeLastAccessDay(id, clock.today())
    }


    fun get(id: CrashlogId): CompressedCrashlog? {
        val crashFile = locationOfCrash(id)
        if (!crashFile.exists()) return null

        updateLastAccessDay(crashFile, id)
        return CompressedCrashlog.read(crashFile)
    }

    suspend fun evictOld(onEvicted: suspend (CrashlogId, CompressedCrashlog) -> Unit) {
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
                onEvicted(crashId, CompressedCrashlog.read(crashFile))
                println("Archived $crashId to S3.")
                // Delete LastAccessDay -> crashId record from disk
                crashIdFile.deleteExisting()
                // Delete the crash file itself
                crashFile.deleteExisting()
            }
            crashesDir.deleteExisting()
        }
    }

    private fun updateLastAccessDay(crashFile: Path, id: CrashlogId) {
        val today = clock.today()
        val lastAccessDay = lastAccessDay(crashFile)
        // Only update last access day if the new day (today) is actually different from the old last access time
        if (lastAccessDay != today) {
            // Delete old lastDay file and create a new one at the updated day
            locationOfLastAccessDay(id, lastAccessDay).deleteExisting()
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


inline class CrashlogId private constructor(val value: UUID) {
    companion object {
        fun fromFileName(path: Path) = CrashlogId(UUID.fromString(path.nameWithoutExtension))
        fun generate() = CrashlogId(UUID.randomUUID())

        fun fromString(string: String) = CrashlogId(UUID.fromString(string))
    }
}

inline class CompressedCrashlog private constructor(val bytes: ByteArray) {
    override fun toString(): String  = "${bytes.size} bytes [${bytes.take(5).joinToString(",")}...]"
    companion object {
        fun read(path: Path): CompressedCrashlog {
            return CompressedCrashlog(path.readBytes())
        }
        suspend fun read(byteStream: ByteStream): CompressedCrashlog {
            return CompressedCrashlog(byteStream.toByteArray())
        }

        fun createRandom() = CompressedCrashlog(Random.nextBytes(100))
    }
}



