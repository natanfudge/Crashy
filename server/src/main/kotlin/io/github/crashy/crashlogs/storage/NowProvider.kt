package io.github.crashy.crashlogs.storage

import java.nio.file.Path
import java.nio.file.attribute.BasicFileAttributes
import java.time.ZoneId
import java.time.ZoneOffset
import java.time.ZonedDateTime
import kotlin.io.path.readAttributes

// Used mainly for testing, so we can emulate advancement of time.
interface NowProvider {
//    fun today(): LastAccessDay
    fun now(): ZonedDateTime
}

fun NowProvider.today() = LastAccessDay.fromDate(now())

object RealClock: NowProvider {
//    override fun today(): LastAccessDay =
    override fun now(): ZonedDateTime = ZonedDateTime.now(utc)
}

 data class LastAccessDay(val day: Int, val month: Int, val year: Int) {
    override fun toString(): String {
        return "$day/$month/$year"
    }


    fun toGmtZonedDateTime(): ZonedDateTime = ZonedDateTime.of(year, month, day, 0, 0, 0, 0, utc)

    companion object {
        fun fromString(string: String): LastAccessDay {
            val (day, month, year) = string.split("/")
            return LastAccessDay(day.toInt(), month.toInt(), year.toInt())
        }

        fun fromDate(dateTime: ZonedDateTime) =
            LastAccessDay(day = dateTime.dayOfMonth, month = dateTime.monthValue, year = dateTime.year)
    }
}
//fun nowUtc(): ZonedDateTime = ZonedDateTime.now(utc)

private val utc = ZoneId.of("UTC")

fun  lastAccessDay(file: Path): LastAccessDay {
    val accessInstant = file.readAttributes<BasicFileAttributes>().lastAccessTime().toInstant()
    return LastAccessDay.fromDate(ZonedDateTime.ofInstant(accessInstant, ZoneOffset.UTC))
}
