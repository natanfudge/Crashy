package io.github.crashy.utils

import kotlinx.coroutines.async
import kotlinx.coroutines.awaitAll
import kotlinx.coroutines.coroutineScope
import software.amazon.awssdk.core.ResponseBytes
import software.amazon.awssdk.core.async.AsyncRequestBody
import software.amazon.awssdk.core.async.AsyncResponseTransformer
import software.amazon.awssdk.services.s3.S3AsyncClient
import software.amazon.awssdk.services.s3.model.*


 suspend fun S3AsyncClient.deleteObjectSuspend(requestBuilder: DeleteObjectRequest.Builder.() -> Unit): DeleteObjectResponse {
    val request = DeleteObjectRequest.builder().apply(requestBuilder).build()
    return deleteObject(request).suspend()
}

 suspend fun S3AsyncClient.restoreObjectSuspend(requestBuilder: RestoreObjectRequest.Builder.() -> Unit): RestoreObjectResponse {
    val request = RestoreObjectRequest.builder().apply(requestBuilder).build()
    return restoreObject(request).suspend()
}

suspend fun S3AsyncClient.putObjectSuspend(
    body: String,
    requestBuilder: PutObjectRequest.Builder.() -> Unit
): PutObjectResponse {
    val request = PutObjectRequest.builder().apply(requestBuilder).build()
    return putObject(request, AsyncRequestBody.fromString(body)).suspend()
}

 suspend fun S3AsyncClient.getObjectSuspend(requestBuilder: GetObjectRequest.Builder.() -> Unit): AnyGetObjectResponse {
    val request = GetObjectRequest.builder().apply(requestBuilder).build()
    val res = getObject(request, AsyncResponseTransformer.toBytes()).suspendResult()
    return when (val exception = res.exceptionOrNull()) {
        null -> AnyGetObjectResponse.Success(res.getOrThrow())
        is NoSuchKeyException -> AnyGetObjectResponse.NoSuchKey
        is InvalidObjectStateException -> AnyGetObjectResponse.InvalidObjectState
        else -> AnyGetObjectResponse.UnexpectedError(exception)
    }

}

/**
 * Puts the objects in parallel. [objects] shouldn't be too large.
 */
suspend fun S3AsyncClient.putObjectsSuspend(
    objects: Map<String, String>,
    bucket: String,
): List<PutObjectResponse> = coroutineScope {
    val deferred = objects.map { (k, body) ->
        async {
            putObjectSuspend(body) {
                key(k)
                bucket(bucket)
            }
        }
    }

    deferred.awaitAll()
}


 sealed interface AnyGetObjectResponse {
    class Success(val bytes: ResponseBytes<GetObjectResponse>) : AnyGetObjectResponse
    object NoSuchKey : AnyGetObjectResponse
    object InvalidObjectState : AnyGetObjectResponse
    class UnexpectedError(val e: Throwable) : AnyGetObjectResponse
}
