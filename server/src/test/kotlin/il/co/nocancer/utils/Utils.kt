package il.co.nocancer.utils

import il.co.nocancer.model.*
import java.time.Instant
import kotlin.random.Random

private val charPool : List<Char> = ('a'..'z') + ('A'..'Z') + ('0'..'9')

fun randomChar(): Char = charPool[Random.nextInt(0, charPool.size - 1)]

fun randomString() : String {
    val len = Random.nextInt(1,10)
    return buildString {
        repeat(len){
            append(randomChar())
        }
    }
}

fun createTestGathering(store: Store) = createTestGathering(store.centreName,store.name)
fun createTestGathering(centreName: CentreName = CentreName(randomString()), storeName: StoreName = StoreName(randomString())) = DonationGathering(
    storeName = storeName,
    centreName = centreName,
    notes = randomString(),
    leftBox = Random.nextBoolean(),
    date = Instant.now()
)
fun createTestStore(centreName: CentreName = CentreName(randomString())) = Store(
    name = StoreName(randomString()),
    centreName = centreName,
    phoneNumber = PhoneNumber(Random.nextLong())
)
fun createTestCentre() = Centre(
    name = CentreName(randomString()),
    location = Location(randomString())
)