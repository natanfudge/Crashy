package il.co.nocancer.functions

import com.amazonaws.services.lambda.runtime.Context
import com.amazonaws.services.lambda.runtime.RequestHandler
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent
import il.co.nocancer.mongodb.AntiCancerMongo
import kotlinx.coroutines.runBlocking

data class FunctionRequest(
    val pathParameters: List<String>,
    val queryParameters: Map<String, String>, val body: String?, val rawPath: String
)

class Entrypoint : RequestHandler<APIGatewayProxyRequestEvent, APIGatewayProxyResponseEvent> {
    override fun handleRequest(input: APIGatewayProxyRequestEvent, context: Context): APIGatewayProxyResponseEvent {
        println("path params we got: " + input.pathParameters)
        val (method, pathParametersStr) = input.pathParameters?.get("proxy")?.splitToTwo("/") ?: return notFound("No path parameters found")
        val client = AntiCancerMongo.getMongoClient(input).getOrElse { return badRequest("Could not connect to test mongo server", it) }
        val pathParameters = pathParametersStr?.split("/") ?: listOf()
        val queryParameters = input.queryStringParameters ?: mapOf()

        println("Executing function '$method' with pathParams = $pathParameters, queryParams = $queryParameters")
        val request = FunctionRequest(pathParameters, queryParameters, input.body, input.path)

        return runBlocking {
            with(client) {
                when (method) {
                    "data" -> Functions.getData(request)
                    "put" -> Functions.put(request)
                    "delete" -> Functions.delete(request)
                    else -> notFound("No such function '$method'")
                }
            }
        }
    }
}