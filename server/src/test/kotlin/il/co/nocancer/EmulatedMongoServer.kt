package il.co.nocancer

import com.mongodb.MongoClientSettings
import com.mongodb.ServerAddress
import com.mongodb.reactivestreams.client.MongoClient
import de.bwaldvogel.mongo.MongoServer
import de.bwaldvogel.mongo.backend.memory.MemoryBackend
import org.litote.kmongo.coroutine.CoroutineClient
import org.litote.kmongo.coroutine.coroutine
import org.litote.kmongo.reactivestreams.KMongo

object EmulatedMongoServer {
    private lateinit var server: MongoServer
    val Client: MongoClient by lazy {
        server = MongoServer(MemoryBackend())
         val serverAddress = server.bind()
         KMongo.createClient(
            MongoClientSettings.builder()
            .applyToClusterSettings { it.hosts(listOf(ServerAddress(serverAddress))) }
            .build())
    }

    fun dispose() {
        Client.close()
        server.shutdown()
    }
}