package il.co.nocancer.util

import kotlinx.serialization.KSerializer
import kotlinx.serialization.descriptors.PrimitiveKind
import kotlinx.serialization.descriptors.PrimitiveSerialDescriptor
import kotlinx.serialization.descriptors.SerialDescriptor
import kotlinx.serialization.encoding.Decoder
import kotlinx.serialization.encoding.Encoder
import java.time.Instant
import java.time.ZoneId
import java.time.ZoneOffset
import java.time.ZonedDateTime
import java.util.concurrent.TimeUnit

object ZoneDatedTimeLongSerializer : KSerializer<ZonedDateTime> {
    override val descriptor: SerialDescriptor = PrimitiveSerialDescriptor("ZonedDateTime", PrimitiveKind.LONG)

    override fun serialize(encoder: Encoder, value: ZonedDateTime) {
        encoder.encodeLong(value.toInstant().toEpochMilli())
    }

    override fun deserialize(decoder: Decoder): ZonedDateTime {
        return ZonedDateTime.ofInstant(Instant.ofEpochMilli(decoder.decodeLong()), ZoneId.systemDefault())
    }
}

object InstantLongSerializer : KSerializer<Instant> {
    override val descriptor: SerialDescriptor = PrimitiveSerialDescriptor("ZonedDateTime", PrimitiveKind.LONG)

    override fun serialize(encoder: Encoder, value: Instant) {
        encoder.encodeLong(TimeUnit.SECONDS.toNanos(value.epochSecond) + value.nano)
    }

    override fun deserialize(decoder: Decoder): Instant {
        val value = decoder.decodeLong()
        return Instant.ofEpochSecond(TimeUnit.NANOSECONDS.toSeconds(value), value % TimeUnit.SECONDS.toNanos(1))
    }
}
