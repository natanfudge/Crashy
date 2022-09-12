package il.co.nocancer

import com.mongodb.MongoClientSettings
import com.mongodb.ServerAddress
import com.mongodb.reactivestreams.client.MongoClient
import de.bwaldvogel.mongo.MongoServer
import de.bwaldvogel.mongo.backend.memory.MemoryBackend
import org.litote.kmongo.reactivestreams.KMongo

fun main(){
    EmulatedMongoServer.start()
}
object EmulatedMongoServer {
    private  var server: MongoServer? = null
    val ClientAndServerOnThisMachine: MongoClient by lazy {
        server = MongoServer(MemoryBackend())
         val serverAddress = server!!.bind()
         KMongo.createClient(
            MongoClientSettings.builder()
            .applyToClusterSettings { it.hosts(listOf(ServerAddress(serverAddress))) }
            .build())
    }

    fun start(): String {
         server = MongoServer(MemoryBackend())
        val address = server!!.bind()
        return address.toString().removePrefix("/")
    }

    fun shutdown() {
        server?.shutdown()
    }
}