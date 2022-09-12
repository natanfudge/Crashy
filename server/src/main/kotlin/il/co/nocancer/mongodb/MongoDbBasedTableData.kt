package il.co.nocancer.mongodb

import kotlinx.coroutines.withTimeout
import kotlinx.serialization.KSerializer
import kotlinx.serialization.serializer
import org.litote.kmongo.Id
import org.litote.kmongo.coroutine.CoroutineCollection
import org.litote.kmongo.coroutine.CoroutineDatabase
import org.litote.kmongo.id.WrappedObjectId
import org.litote.kmongo.serialization.registerSerializer
import org.reactivestreams.Subscriber
import org.reactivestreams.Subscription
import kotlin.time.Duration.Companion.seconds

class UnsuccessfulWriteException(message: String) : RuntimeException(message)

class MongoDbBasedTableData<T : Any> @PublishedApi internal constructor(
    private val collection: CoroutineCollection<T>,
    val serializer: KSerializer<T>
) {
    companion object {
        inline fun <reified T : Any> create(
            database: CoroutineDatabase,
            collectionName: String,
            serializer: KSerializer<T> = serializer()
        ): MongoDbBasedTableData<T> {
            registerSerializer(serializer)
            val collection = database.getCollection<T>(collectionName)
            return MongoDbBasedTableData(collection, serializer)
        }
    }


    suspend fun getRows(): List<T> {
        return  collection.find().toList()
    }

    suspend fun put(row: T): Id<T> {
        val result = collection.insertOne(row)
        if (!result.wasAcknowledged()) {
            throw UnsuccessfulWriteException("Put was not acknowledged")
        }
        if (result.insertedId == null) {
            throw UnsuccessfulWriteException("Did not get inserted ID back")
        }
        return WrappedObjectId(result.insertedId!!.asObjectId().value)
    }

    /**
     * Returns true if something was deleted
     */
    suspend fun delete(id: Id<T>): Boolean  {
        val result = collection.deleteOneById(id)
        if (!result.wasAcknowledged()) {
            throw UnsuccessfulWriteException("Delete was not acknowledged")
        }
        return result.deletedCount == 1L
    }
}

