package il.co.nocancer.util

import com.github.jershell.kbson.FlexibleDecoder
import com.github.jershell.kbson.ObjectIdSerializer
import kotlinx.serialization.KSerializer
import kotlinx.serialization.SerializationException
import kotlinx.serialization.descriptors.PrimitiveKind
import kotlinx.serialization.descriptors.PrimitiveSerialDescriptor
import kotlinx.serialization.descriptors.SerialDescriptor
import kotlinx.serialization.encoding.Decoder
import kotlinx.serialization.encoding.Encoder
import org.bson.AbstractBsonReader
import org.bson.BsonType
import org.bson.types.ObjectId
import org.litote.kmongo.Id
import org.litote.kmongo.id.IdGenerator
import org.litote.kmongo.id.IdTransformer
import org.litote.kmongo.id.ObjectIdGenerator
import org.litote.kmongo.id.WrappedObjectId
import java.time.Instant
import java.util.concurrent.TimeUnit

class IdSerializer<T : Id<*>>(private val shouldBeStringId: Boolean) : KSerializer<T> {

    override val descriptor: SerialDescriptor = PrimitiveSerialDescriptor("IdSerializer", PrimitiveKind.STRING)

    @Suppress("UNCHECKED_CAST")
    override fun deserialize(decoder: Decoder): T {
        if (decoder is FlexibleDecoder) return IdTransformer.wrapId(deserializeObjectId(decoder)) as T
        else {
            check(!shouldBeStringId)
            return WrappedObjectId<T>(decoder.decodeString()) as T
        }

    }

    private fun deserializeObjectId(decoder: FlexibleDecoder): Any {
        val alreadyRead = decoder.alreadyReadId
        return if (alreadyRead != null) {
            decoder.alreadyReadId = null
            alreadyRead
        } else if (decoder.reader.state == AbstractBsonReader.State.NAME) {
            val keyId = decoder.reader.readName()
            if (shouldBeStringId || IdGenerator.defaultGenerator != ObjectIdGenerator) keyId else ObjectId(keyId)
        } else {
            when (decoder.reader.currentBsonType) {
                BsonType.STRING -> decoder.decodeString()
                BsonType.OBJECT_ID -> decoder.reader.readObjectId()
                else -> throw SerializationException("Unsupported ${decoder.reader.currentBsonType} when reading _id")
            }
        }
    }

    override fun serialize(encoder: Encoder, value: T) {
        IdTransformer.unwrapId(value).also {
            when (it) {
                is String -> encoder.encodeString(it)
                is ObjectId -> ObjectIdSerializer.serialize(encoder, it)
                else -> error("unsupported id type $value")
            }
        }
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
