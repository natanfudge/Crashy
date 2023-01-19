@file:UseSerializers(InstantSerializer::class)

package io.github.crashy.utils.log

import io.github.crashy.Crashy
import io.github.crashy.utils.InstantSerializer
import io.github.crashy.utils.lastAccessInstant
import kotlinx.serialization.UseSerializers
import java.nio.file.Path
import java.time.Duration
import java.time.Instant
import kotlin.io.path.*

fun main() {
    val red = "\u001b[37;1m"

// Resets previous color codes
    val reset = "\u001b[0m"

    println(red + "hello world" + reset)
}


object CrashyLogger {
    inline fun <T> startCall(name: String, call: LogContext.() -> T): T {
        return startCallWithContextAsParam(name, call)
    }

    // Context receivers are bugging out so we pass LogContext as a parameter for some use cases
    // (try removing this with K2)
    inline fun <T> startCallWithContextAsParam(name: String, call: (LogContext) -> T): T {
        val context = LogContext(name, Instant.now())
        val value = try {
            call(context)
        } catch (e: Throwable) {
            context.logError(e) { "Unexpected error handling '$name'" }
            throw e
        } finally {
            val log = context.buildLog()
            if (Crashy.isLocal()) ConsoleLogRenderer.render(log)
            FileLogRenderer.render(log)
        }
        return value
    }

    private val allLogsDir = Crashy.HomeDir.resolve("old_logs")

    val todayLogDir = allLogsDir.resolve(Instant.now().systemDate().replace("/", ".")).createDirectories()

    fun logsOfEndpoint(endpoint: String): Path {
        return todayLogDir.resolve(endpoint.replace("/", "") + ".log")
    }

    context(LogContext) @OptIn(ExperimentalPathApi::class)
    fun deleteOldLogs() {
        // Delete all log dirs that are over 30 days old
        allLogsDir.forEachDirectoryEntry { logDirOfDay ->
            if (logDirOfDay.lastAccessInstant().plus(Duration.ofDays(30)).isBefore(Instant.now())) {
                logDirOfDay.deleteRecursively()
                logInfo { "Deleted logs at $logDirOfDay" }
            }
        }
    }
}


class LogContext(private val name: String, private val startTime: Instant) {
    @Suppress("PropertyName")
    val ___logDetails = mutableListOf<LogLine>()


    inline fun logInfo(message: () -> String) {
        ___logDetails.add(LogLine.Message.Normal(message(), Instant.now(), LogLine.Severity.Info))
    }

    inline fun logWarn(message: () -> String) {
        ___logDetails.add(LogLine.Message.Normal(message(), Instant.now(), LogLine.Severity.Warn))
    }

    inline fun logError(exception: Throwable, message: () -> String) {
        ___logDetails.add(LogLine.Message.Error(message(), Instant.now(), exception))
    }

    inline fun logData(key: String, value: () -> Any) {
        ___logDetails.add(LogLine.Detail(key, value().toString()))
    }

    fun buildLog(): LogEvent = LogEvent(name, startTime = startTime, endTime = Instant.now(), ___logDetails)
}