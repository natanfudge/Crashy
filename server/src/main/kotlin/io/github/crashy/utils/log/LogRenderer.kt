package io.github.crashy.utils.log

import io.github.crashy.Crashy
import org.dizitart.no2.Nitrite
import org.dizitart.no2.mvstore.MVStoreModule
import org.fusesource.jansi.Ansi
import java.time.Instant
import java.time.ZoneId
import java.time.ZonedDateTime
import kotlin.io.path.appendText
import kotlin.io.path.createFile
import kotlin.io.path.exists

interface LogRenderer {
    fun render(log: LogEvent)
}


object ConsoleLogRenderer : LogRenderer {
    override fun render(log: LogEvent) {
        val rendered = log.renderToString(colored = true)
        if (rendered != "") println(rendered)
    }
}

object FileLogRenderer : LogRenderer {
    override fun render(log: LogEvent) {
        val rendered = log.renderToString(colored = false)
        if (rendered == "") return
        val logFile = CrashyLogger.logsOfEndpoint(log.name)
        if (!logFile.exists()) logFile.createFile()
        logFile.appendText(rendered + "\n")
    }
}

object NitriteLogRenderer : LogRenderer {
    private val logsFile = Crashy.HomeDir.resolve("logs/log.db")
    private val storeModule = MVStoreModule.withConfig()
        .filePath(logsFile.toFile())
        .compress(true)
        .build()
    private val db = Nitrite.builder()
        .loadModule(storeModule)
        .openOrCreate()

    override fun render(log: LogEvent) {
       db.getRepository(LogEvent::class.java)
    }
}


private fun LogEvent.renderToString(colored: Boolean): String {
    if (logs.isEmpty()) return ""
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
        val details = logs.filterIsInstance<LogLine.Detail>()
        if (details.isNotEmpty()) {
            append("\t${"Details".bold()} {\n")
            for (detail in details) {
                append("\t\t${detail.key}: ${detail.value.colored(Ansi.Color.GREEN)}\n")
            }
            append("\t}\n")
        }
        val messages = logs.filterIsInstance<LogLine.Message>()
        if (messages.isNotEmpty()) {
            append("\t${"Messages".bold()} {\n")
            for (message in messages) {
                val color = when (message.severity) {
                    LogLine.Severity.Info -> null
                    LogLine.Severity.Warn -> Ansi.Color.YELLOW
                    LogLine.Severity.Error -> Ansi.Color.RED
                }
                append("\t\t")
                append("[${message.time.systemTimeOfDay()}]".grey())
                append(" ${message.severity.name.uppercase()}: ${message.message}\n".colored(color))
            }
            append("\t}\n")
        }
        val exceptions = messages.filterIsInstance<LogLine.Message.Error>()
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

private fun Instant.timeInSystem() = atZone(ZoneId.systemDefault())

private fun ZonedDateTime.timeOfDay() = "${hour.twoCharacters}:${minute.twoCharacters}:${second.twoCharacters}" +
        ".${(nano / 1_000_000).threeCharacters}"

private val Int.twoCharacters get() = toString().let { if (it.length == 1) "0$it" else it }
private val Int.threeCharacters
    get() = toString().let {
        "0".repeat(3 - it.length) + it
    }

private fun Instant.systemTimeOfDay(): String = timeInSystem().timeOfDay()
fun Instant.systemDate(): String = with(timeInSystem()) {
    "${dayOfMonth.twoCharacters}/${monthValue.twoCharacters}/$year"
}
