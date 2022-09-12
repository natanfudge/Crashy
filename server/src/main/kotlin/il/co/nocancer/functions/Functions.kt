package il.co.nocancer.functions

import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent
import il.co.nocancer.model.Centre
import il.co.nocancer.model.DonationGathering
import il.co.nocancer.model.Store
import il.co.nocancer.mongodb.MongoClientContext
import il.co.nocancer.mongodb.MongoDbBasedTableData
import il.co.nocancer.mongodb.getTableByName
import kotlinx.coroutines.async
import kotlinx.coroutines.coroutineScope
import kotlinx.serialization.Serializable
import org.litote.kmongo.Id
import org.litote.kmongo.id.WrappedObjectId
@Serializable
data class GatheringDataResponse(
    val gatherings: List<DonationGathering>,
    val stores: List<Store>,
    val centres: List<Centre>
)


object Functions {
    context (MongoClientContext) suspend fun getData(
        request: FunctionRequest
    ): APIGatewayProxyResponseEvent {
        val string = json.encodeToString(GatheringDataResponse.serializer(), getData())
        return APIGatewayProxyResponseEvent().withBody(string)
    }

    context (MongoClientContext) suspend fun put(
        request: FunctionRequest
    ): APIGatewayProxyResponseEvent {
        val tableName = request.pathParameters.getOrNull(0) ?: return badRequest("Missing 'table' parameter in request '${request.rawPath}'")
        val table = getTableByName(tableName) ?: return badRequest("Table parameter '$tableName' is invalid in request '${request.rawPath}'")
        val id = table.put(request.body) ?: return badRequest("$tableName body is malformed: ${request.body}")

        return APIGatewayProxyResponseEvent().withBody("\"$id\"")
    }

    context (MongoClientContext) suspend fun delete(
        request: FunctionRequest
    ): APIGatewayProxyResponseEvent {
        val tableName = request.pathParameters.getOrNull(0) ?: return badRequest("Missing 'table' parameter in request '${request.rawPath}'")
        val rowId = request.queryParameters["id"] ?: return badRequest("Missing 'id' parameter in request '${request.rawPath}'")
        val table = getTableByName(tableName) ?: return badRequest("Table parameter '$tableName' is invalid in request '${request.rawPath}'")
        val deleted = table.delete(rowId)
        return APIGatewayProxyResponseEvent().withBody(deleted.toString())
    }

    private suspend fun <T : Any> MongoDbBasedTableData<T>.delete(id: String) = delete(WrappedObjectId(id))

}

private suspend fun <T : Any> MongoDbBasedTableData<T>.delete(id: String) = delete(WrappedObjectId(id))
private suspend fun <T : Any> MongoDbBasedTableData<T>.put(body: String?): Id<T>? {
    if (body == null) return null
    val obj = json.decodeFromStringOrFailure(serializer, body).getOrElse {
        it.printStackTrace()
        return null
    }
    return put(obj)
}


context (MongoClientContext) private suspend fun getData(): GatheringDataResponse = coroutineScope {
    val gatheringData = async { gatheringTable.getRows() }
    val storeData = async { storeTable.getRows() }
    val centreData = async { centreTable.getRows() }

    GatheringDataResponse(
        gatheringData.await(), storeData.await(), centreData.await()
    )
}
