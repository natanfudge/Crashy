package io.github.crashy.crashlogs.storage

import kotlinx.serialization.Serializable
import java.nio.file.Path
import java.time.ZoneId
import java.time.ZonedDateTime
import kotlin.io.path.Path

// Used mainly for testing, so we can emulate advancement of time.
interface NowDefinition {
    fun now(): ZonedDateTime
}

fun NowDefinition.today() = LastAccessDay.fromDate(now())

object RealClock : NowDefinition {
    override fun now(): ZonedDateTime = ZonedDateTime.now(utc)
}

@Serializable
data class LastAccessDay(val day: Int, val month: Int, val year: Int) {
    override fun toString(): String = "$day/$month/$year"
    fun toFileName() = Path("${day}_${month}_${year}")


    fun toGmtZonedDateTime(): ZonedDateTime = ZonedDateTime.of(year, month, day, 0, 0, 0, 0, utc)

    companion object {
        fun today() = fromDate(ZonedDateTime.now(utc))
        fun fromFileName(name: Path): LastAccessDay {
            val (day, month, year) = name.toString().split("_")
            return LastAccessDay(day.toInt(), month.toInt(), year.toInt())
        }

        fun fromDate(dateTime: ZonedDateTime) =
            LastAccessDay(day = dateTime.dayOfMonth, month = dateTime.monthValue, year = dateTime.year)
    }
}

private val utc = ZoneId.of("UTC")


