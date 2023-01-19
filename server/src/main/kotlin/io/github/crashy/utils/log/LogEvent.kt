@file:UseSerializers(InstantSerializer::class, OneWayThrowableSerializer::class)

package io.github.crashy.utils.log

import io.github.crashy.utils.InstantSerializer
import io.github.crashy.utils.OneWayThrowableSerializer


import kotlinx.serialization.Serializable
import kotlinx.serialization.UseSerializers
import org.dizitart.no2.index.IndexType
import org.dizitart.no2.repository.annotations.Entity
import org.dizitart.no2.repository.annotations.Id
import org.dizitart.no2.repository.annotations.Index
import java.time.Instant

@Serializable
@Entity(value = "Crashy-Log", indices = [Index(value = "startTime", type = IndexType.NonUnique), Index(value = "name", type =  IndexType.NonUnique)])
data class LogEvent( val name: String, val startTime: Instant, val endTime: Instant, val logs: List<LogLine>)

@Serializable

sealed interface LogLine {
    @Serializable
    sealed interface Message : LogLine {
        val message: String
        val time: Instant
        val severity: Severity
        @Serializable
        data class Normal(
            override val message: String,
            override val time: Instant,
            override val severity: Severity
        ) : Message

        @Serializable
        data class Error(override val message: String, override val time: Instant, val exception: Throwable) :
            Message {
            override val severity: Severity get() = Severity.Error
        }
    }

    enum class Severity {
        Info, Warn, Error
    }
    data class Detail(val key: String, val value: String) : LogLine
}

