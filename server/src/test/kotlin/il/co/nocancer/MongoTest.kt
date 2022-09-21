package il.co.nocancer

import il.co.nocancer.model.CentreName
import il.co.nocancer.model.DonationGathering
import il.co.nocancer.model.StoreName
import il.co.nocancer.mongodb.AntiCancerMongo
import il.co.nocancer.mongodb.MongoDbBasedTableData
import kotlinx.coroutines.runBlocking
import org.bson.Document
import org.junit.Test
import org.litote.kmongo.coroutine.coroutine
import java.time.Instant
import java.time.ZoneId
import java.time.ZonedDateTime
import kotlin.test.assertEquals
import kotlin.test.assertTrue


class MongoTest {
    private val emulateServer = false
    private val client by lazy { if (emulateServer) EmulatedMongoServer.Client else AntiCancerMongo.Client }
    private val database by lazy { client.getDatabase("AntiCancerTest") }


    private val gatheringData by lazy {
        MongoDbBasedTableData.create<DonationGathering>(
            database = database.coroutine,
            collectionName = "Gatherings"
        )
    }

    @Test
    fun testMongoDbBasedTable(): Unit = runBlocking {
        val start = System.currentTimeMillis()
        val client = if (emulateServer) EmulatedMongoServer.Client else AntiCancerMongo.Client
        println("Get client time: ${System.currentTimeMillis() - start}")
        val database = client.getDatabase("AntiCancerTest")
        println("Get database time: ${System.currentTimeMillis() - start}")

        val gatheringData = MongoDbBasedTableData.create<DonationGathering>(
            database = database.coroutine,
            collectionName = "Gatherings"
        )
        println("Get collection time: ${System.currentTimeMillis() - start}")

        val testObjects = listOf(
            DonationGathering(
                storeName = StoreName("amar"),
                centreName = CentreName("def"),
                notes = "amar",
                leftBox = false,
                date = Instant.now()
            ),
            DonationGathering(
                storeName = StoreName("xd"),
                centreName = CentreName("asdfwef"),
                notes = "",
                leftBox = true,
                date = ZonedDateTime.of(2020, 10, 1, 1, 1, 1, 0, ZoneId.systemDefault()).toInstant()
            ),
            DonationGathering(
                storeName = StoreName("xqc"),
                centreName = CentreName("def"),
                notes = "fqwewfq2wr234123 4123 4123512 35125 2352",
                leftBox = true,
                date = Instant.now()
            )
        )
        assertTrue(gatheringData.getRows().isEmpty())
        println("First request time: ${System.currentTimeMillis() - start}")

        gatheringData.put(testObjects[0])
        assertEquals(testObjects.take(1), gatheringData.getRows())
        gatheringData.put(testObjects[1])
        assertEquals(testObjects.take(2), gatheringData.getRows())
        gatheringData.put(testObjects[2])
        assertEquals(testObjects.take(3), gatheringData.getRows())
        println(gatheringData.getRows())
        assertTrue(gatheringData.delete(testObjects[1].mongoId))
        assertEquals(testObjects.slice(listOf(0, 2)), gatheringData.getRows())
        assertTrue(gatheringData.delete(testObjects[0].mongoId))
        assertTrue(gatheringData.delete(testObjects[2].mongoId))
        assertTrue(gatheringData.getRows().isEmpty())

        println("Total time: ${System.currentTimeMillis() - start}")
    }

    @Test
    fun testDatabaseWorking(): Unit = runBlocking {
        val collection = database.getCollection("testcollection").coroutine

        assertEquals(0, collection.countDocuments())


//         creates the database and collection in memory and insert the object
        val obj: Document = Document("_id", 1).append("key", "value")
        collection.insertOne(obj)

        assertEquals(1, collection.countDocuments())
        assertEquals(obj, collection.find().first())
        collection.deleteMany()
    }


    @Test
    fun testMongoPutDelete(): Unit = runBlocking {
        val gathering = DonationGathering(
            storeName = StoreName("amar"),
            centreName = CentreName("def"),
            notes = "amar",
            leftBox = true,
            date = Instant.now()
        )
        gatheringData.put(gathering)
        assertTrue(gatheringData.delete(gathering.mongoId))
    }

    @Test
    fun testMongoRead(): Unit = runBlocking {
        println(gatheringData.getRows())
    }

}