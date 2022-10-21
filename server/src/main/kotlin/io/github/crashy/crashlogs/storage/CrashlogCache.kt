package io.github.crashy.crashlogs.storage

import io.ktor.server.util.*
import java.nio.file.Path
import java.nio.file.attribute.BasicFileAttributes
import java.time.Instant
import java.time.ZoneId
import java.time.ZoneOffset
import java.time.ZonedDateTime
import java.util.*
import kotlin.io.path.*

private val utc = ZoneId.of("UTC")

class CrashlogCache(private val parentDir: Path) {
    // Full compressed crash logs are stored under /crashlogs, with their ID as the file name
    private val crashes = parentDir.resolve("crashlogs")

    // The last day that crash logs were accessed are stored under /last_access, with a separate directory for each day
    // containing the ID of logs that their last access day is equal to said day as the file name.
    // This allows quickly figuring out which logs have not been accessed in a long time.
    // Days are in GMT.
    private val lastAccessDays = parentDir.resolve("last_access")
    fun store(id: CrashlogId, log: CompressedCrashlog) {
        val crashFile = locationOfCrash(id)
        val lastAccessFile = locationOfLastAccessDay(id,currentDayInGmt())

        crashFile.writeBytes(log.bytes)
        lastAccessFile.createFile()
    }

    private fun locationOfCrash(id: CrashlogId) = crashes.resolve(id.value.toString() + ".crash")
    private fun locationOfLastAccessDay(id: CrashlogId, lastAccessDay: LastAccessDay): Path{
        return locationOfAllLastAccessDay(lastAccessDay).resolve(id.value.toString())
    }
    private fun locationOfAllLastAccessDay(lastAccessDay: LastAccessDay): Path{
        return lastAccessDays.resolve(lastAccessDay.toString())
    }

    private fun Instant.dayInGmt(): LastAccessDay {
        return LastAccessDay.fromDate(toGmtZonedDateTime())
    }

    private fun Instant.toGmtZonedDateTime() = ZonedDateTime.ofInstant(this, ZoneOffset.UTC)

    private fun currentDayInGmt() = LastAccessDay.fromDate(ZonedDateTime.now(utc))

    private fun Path.lastAccessDay() =
    readAttributes<BasicFileAttributes>().lastAccessTime().toInstant().dayInGmt()

    fun get(id: CrashlogId): CompressedCrashlog {
        val crashFile = locationOfCrash(id)
        val today = currentDayInGmt()
        val lastAccessDay = crashFile.lastAccessDay()
        // Only update last access day if the new day (today) is actually different from the old last access time
        if (lastAccessDay != today) {
            // Delete old lastDay file and create a new one at the updated day
            locationOfLastAccessDay(id, lastAccessDay).deleteExisting()
            locationOfLastAccessDay(id, today).createFile()
        }

        return CompressedCrashlog(crashFile.readBytes())
    }

    fun evictOld() {
        val existingDays = lastAccessDays.listDirectoryEntries().map { LastAccessDay.fromString(it.fileName.toString()) }
        val thirtyDaysAgo = Instant.now().toGmtZonedDateTime().minusDays(30)
        val oldDays = existingDays.filter { it.toGmtZonedDateTime().isBefore(thirtyDaysAgo) }
        println("Evicting crashes from days: $oldDays")
        for(oldDay in oldDays){
            val crashesDir = TODO()
            // Remove last access day data
            locationOfAllLastAccessDay(oldDay).toFile().deleteRecursively()
            // Remove crash logs from disk

        }
    }
}


//class Inndex(private val parentDir: Path) {
//    private val file = parentDir.resolve("index")
////    private val entries = file.entries
//    private fun parseIndex(): MutableMap<CrashlogId, >
//}
inline class CrashlogId(val value: UUID)
inline class CompressedCrashlog(val bytes: ByteArray)

data class LastAccessDay(val day: Int, val month: Int, val year: Int) {
    override fun toString(): String {
        return "$day/$month/$year"
    }


    fun toGmtZonedDateTime() = ZonedDateTime.of(year,month,day,0,0,0,0,utc)
    companion object {
        fun fromString(string: String): LastAccessDay {
            val (day,month,year) = string.split("/")
            return LastAccessDay(day.toInt(),month.toInt(),year.toInt())
        }

        fun fromDate(dateTime: ZonedDateTime) = LastAccessDay(day = dateTime.dayOfMonth, month = dateTime.monthValue, year = dateTime.year)
    }
}