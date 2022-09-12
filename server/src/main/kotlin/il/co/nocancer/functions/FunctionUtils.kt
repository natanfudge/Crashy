package il.co.nocancer.functions

import com.amazonaws.services.lambda.runtime.Context
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent
import il.co.nocancer.mongodb.MongoClientContext
import kotlinx.coroutines.runBlocking
import kotlinx.serialization.KSerializer
import kotlinx.serialization.SerializationException
import kotlinx.serialization.json.Json
import org.litote.kmongo.id.serialization.IdKotlinXSerializationModule
import java.net.HttpURLConnection


val json = Json { serializersModule = IdKotlinXSerializationModule }



fun badRequest(message: String,exception: Throwable? = null): APIGatewayProxyResponseEvent {
    return problem(message,HttpURLConnection.HTTP_BAD_REQUEST,exception)
}
fun notFound(message: String,exception: Throwable? = null): APIGatewayProxyResponseEvent {
    return problem(message,HttpURLConnection.HTTP_NOT_FOUND,exception)
}
fun problem(message: String,statusCode: Int, exception: Throwable? = null): APIGatewayProxyResponseEvent {
    exception?.printStackTrace()
    val fullMessage = "Bad Request: $message"
    println(fullMessage)
    return APIGatewayProxyResponseEvent().withBody(fullMessage).withStatusCode(statusCode)
}


fun <T> Json.decodeFromStringOrFailure(serializer: KSerializer<T>, string: String): Result<T> = try {
    Result.success(decodeFromString(serializer, string))
} catch (e: SerializationException) {
    Result.failure(e)
}

inline fun <Res> runBlockingWith(context: Context, mongoClientContext: MongoClientContext, crossinline code: suspend context(Context, MongoClientContext) () -> Res): Res {
    return runBlocking {
        code(context, mongoClientContext)
    }
}

fun String.splitToTwo(on: String) : Pair<String,String?> {
    if(on !in this) return this to null
    return substringBefore(on) to substringAfter(on)
}
fun String.splitToTwoOrThrow(on: String) : Pair<String,String> {
    require(on in this)
    return substringBefore(on) to substringAfter(on)
}