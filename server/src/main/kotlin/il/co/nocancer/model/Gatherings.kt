package il.co.nocancer.model

import il.co.nocancer.util.InstantLongSerializer
import kotlinx.serialization.Contextual
import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable
import org.litote.kmongo.Id
import org.litote.kmongo.newId
import java.time.Instant

@Serializable
data class DonationGathering(
    val storeName: StoreName,
    val centreName: CentreName,
    val leftBox: Boolean,
    @Serializable(with = InstantLongSerializer::class) val date: Instant,
    val notes: String,
    @Contextual @SerialName("_id") val mongoId: Id<DonationGathering> = newId(),
)


@Serializable
data class Centre(val name: CentreName, val location: Location,  @Contextual @SerialName("_id") val mongoId: Id<DonationGathering> = newId())

@Serializable
data class Store(val centreName: CentreName, val name: StoreName, val phoneNumber: PhoneNumber,  @Contextual @SerialName("_id") val mongoId: Id<DonationGathering> = newId())

@Serializable
@JvmInline
value class StoreName(val value: String)

@Serializable
@JvmInline
value class CentreName(val value: String)

@Serializable
@JvmInline
value class PhoneNumber(val value: Long)

@Serializable @JvmInline value class Location(val value: String)