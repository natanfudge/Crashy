package il.co.nocancer.mongodb

import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent
import com.mongodb.*
import com.mongodb.reactivestreams.client.MongoClient
import il.co.nocancer.model.Centre
import il.co.nocancer.model.DonationGathering
import il.co.nocancer.model.Store
import org.litote.kmongo.coroutine.CoroutineClient
import org.litote.kmongo.coroutine.coroutine
import org.litote.kmongo.reactivestreams.KMongo


context (MongoClientContext)
fun getTableByName(name: String): MongoDbBasedTableData<*>? = when (name) {
    "gathering" -> gatheringTable
    "store" -> storeTable
    "centre" -> centreTable
    else -> null
}

object AntiCancerMongo {
    //TODO: unsafe when open-sourced
    private const val ConnectionString = "[REDACTED]"

    // We use a secret key to avoid some evil attacker sending us viwus objects with his database
    // note: okhttp title-cases this string so we need to keep it exactly this way
    //TODO: unsafe when open-sourced/
    const val SecretLocalMongoDbHeaderKey = "[REDACTED]"

    //TODO: proguard!!
    const val TestKey = "Test"

    fun getMongoClient(input: APIGatewayProxyRequestEvent): Result<MongoClientContext> {
        // For debugging purposes, we may specify a local address for a mongodb server to connect to
        val debugClientPort = input.headers?.get(SecretLocalMongoDbHeaderKey)?.toInt()

        println("headers2: ${input.headers}")
        if (debugClientPort != null) {
            return getDebugClient(debugClientPort)
        } else {
            println("headers: ${input.headers}")
            val testClient = input.headers?.get(TestKey) == "true" || input.headers?.get(TestKey.lowercase()) == "true"
            println("testClient: $testClient")
            return Result.success(if (testClient) TestMongoClient else RealMongoClient)
        }
    }

    private fun getDebugClient(debugClientPort: Int): Result<MongoClientContext> {
        println("Using debug port $debugClientPort")
        try {
            if (PreviousMongoClientPort != debugClientPort) {
                PreviousMongoClientPort = debugClientPort
                LocalMongoClient?.client?.close()
                LocalMongoClient = MongoClientContext(testDatabase = true) { createFakeClient(debugClientPort).coroutine }
            }
            return Result.success(LocalMongoClient!!)
        } catch (e: Throwable) {
            return Result.failure(e)
        }
    }

    private val RealMongoClient = MongoClientContext(testDatabase = false) { createRealClient().coroutine }
    private val TestMongoClient = MongoClientContext(testDatabase = true) { createRealClient().coroutine }
    private var LocalMongoClient: MongoClientContext? = null
    private var PreviousMongoClientPort: Int? = null


    fun createRealClient(): MongoClient = KMongo.createClient(
        MongoClientSettings.builder()
            .applyConnectionString(ConnectionString(ConnectionString))
            .serverApi(
                ServerApi.builder()
                    .version(ServerApiVersion.V1)
                    .build()
            )
            .build()
    )

    private fun createFakeClient(port: Int): MongoClient {
        return KMongo.createClient(
            MongoClientSettings.builder()
                .applyToClusterSettings { it.hosts(listOf(ServerAddress("host.docker.internal", port))) }
                .build()
        )
    }
}

class MongoClientContext(testDatabase: Boolean, clientLazy: () -> CoroutineClient) {
    val client by lazy(clientLazy)
    private val database by lazy { client.getDatabase(if (testDatabase) "AntiCancerTest" else "AntiCancer") }
    val gatheringTable by lazy { MongoDbBasedTableData.create<DonationGathering>(database, "gatherings") }
    val storeTable by lazy { MongoDbBasedTableData.create<Store>(database, "stores") }
    val centreTable by lazy { MongoDbBasedTableData.create<Centre>(database, "centres") }
}
