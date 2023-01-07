package io.github.crashy.utils.log

import io.github.crashy.Crashy
import io.github.crashy.utils.log.LogContext.Severity.*
import org.fusesource.jansi.Ansi
import org.fusesource.jansi.AnsiConsole
import java.time.Instant
import java.time.ZoneId
import java.time.ZonedDateTime
import kotlin.io.path.appendText
import kotlin.io.path.createDirectories
import kotlin.io.path.createFile
import kotlin.io.path.exists

fun main() {
    val red = "\u001b[37;1m"

// Resets previous color codes
    val reset = "\u001b[0m"

    println(red + "hello world" + reset)
}


object CrashyLogger {
    inline fun <T> startCall(name: String, call: (LogContext) -> T): T {
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
}

private fun LogResult.renderToString(colored: Boolean): String {
    fun Any.colored(color: Ansi.Color?): String {
        if (!colored || color == null) return toString()
        return Ansi.ansi().fg(color).a(this).reset().toString()
    }

    fun Any.bold(): String {
        if (!colored) return toString()
        return Ansi.ansi().bold().a(this).reset().toString()
    }

    fun Any.grey(): String {
        if (!colored) return toString()
        val grey = "\u001b[37;1m"
        val reset = "\u001b[0m"
        return grey + this + reset
    }


    return buildString {
        append("[${startTime.systemDate()} ${startTime.systemTimeOfDay()} -> ${endTime.systemTimeOfDay()}]".grey())
        append(" $name {\n".bold())
        val details = logs.filterIsInstance<LogContext.Log.Detail>()
        if (details.isNotEmpty()) {
            append("\t${"Details".bold()} {\n")
            for (detail in details) {
                append("\t\t${detail.key}: ${detail.value.colored(Ansi.Color.GREEN)}\n")
            }
            append("\t}\n")
        }
        val messages = logs.filterIsInstance<LogContext.Log.Message>()
        if (messages.isNotEmpty()) {
            append("\t${"Messages".bold()} {\n")
            for (message in messages) {
                val color = when (message.severity) {
                    Info -> null
                    Warn -> Ansi.Color.YELLOW
                    Error -> Ansi.Color.RED
                }
                append("\t\t")
                append("[${message.time.systemTimeOfDay()}]".grey())
                append(" ${message.severity.name.uppercase()}: ${message.message}\n".colored(color))
            }
            append("\t}\n")
        }
        val exceptions = messages.filterIsInstance<LogContext.Log.Message.Error>()
        if (exceptions.isNotEmpty()) {
            append("\t${"Exceptions".bold()} {\n")
            for (message in exceptions) {
                append("\t\t")
                append((message.exception.stackTraceToString().replace("\n", "\n\t\t") + "\n").colored(Ansi.Color.RED))
            }
            append("\t}\n")
        }

        append("}".bold())
    }

}

object ConsoleLogRenderer : LogRenderer {
    override fun render(log: LogResult) {
        println(log.renderToString(colored = true))
    }
}

//TODO: evict old logs (maybe automatically delete over 30 days old)
object FileLogRenderer : LogRenderer {
    val logDir = Crashy.HomeDir.resolve("logs").resolve(Instant.now().systemDate().replace("/",".")).createDirectories()
    override fun render(log: LogResult) {
        val logFile = logDir.resolve(log.name.replace("/", "") + ".log")
        if (!logFile.exists()) logFile.createFile()
        logFile.appendText(log.renderToString(colored = false) + "\n")
    }
}

private fun Instant.timeInSystem() = atZone(ZoneId.systemDefault())

private fun ZonedDateTime.timeOfDay() = "${hour.twoCharacters}:${minute.twoCharacters}:${second.twoCharacters}" +
        ".${(nano / 1_000_000).threeCharacters}"

private val Int.twoCharacters get() = toString().let { if (it.length == 1) "0$it" else it }
private val Int.threeCharacters
    get() = toString().let {
        "0".repeat(3 - it.length) + it
    }

private fun Instant.systemTimeOfDay(): String = timeInSystem().timeOfDay()
private fun Instant.systemDate(): String = with(timeInSystem()) {
    "${dayOfMonth.twoCharacters}/${monthValue.twoCharacters}/$year"
}

interface LogRenderer {
    fun render(log: LogResult)
}

data class LogResult(val name: String, val startTime: Instant, val endTime: Instant, val logs: List<LogContext.Log>)
class LogContext(private val name: String, private val startTime: Instant) {
    @Suppress("PropertyName")
    val ___logDetails = mutableListOf<Log>()

    sealed interface Log {
        sealed interface Message : Log {
            val message: String
            val time: Instant
            val severity: Severity

            data class Normal(
                override val message: String,
                override val time: Instant,
                override val severity: Severity
            ) : Message

            data class Error(override val message: String, override val time: Instant, val exception: Throwable) :
                Message {
                override val severity: Severity = Error
            }
        }

        data class Detail(val key: String, val value: String) : Log
    }

    enum class Severity {
        Info, Warn, Error
    }

    inline fun logInfo(message: () -> String) {
        ___logDetails.add(Log.Message.Normal(message(), Instant.now(), Info))
    }

    inline fun logWarn(message: () -> String) {
        ___logDetails.add(Log.Message.Normal(message(), Instant.now(), Warn))
    }

    inline fun logError(exception: Throwable, message: () -> String) {
        ___logDetails.add(Log.Message.Error(message(), Instant.now(), exception))
    }

    inline fun logData(key: String, value: () -> Any) {
        ___logDetails.add(Log.Detail(key, value().toString()))
    }

    fun buildLog(): LogResult = LogResult(name, startTime = startTime, endTime = Instant.now(), ___logDetails)
}