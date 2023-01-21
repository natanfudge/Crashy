package io.github.crashy.utils

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.channels.awaitClose
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.callbackFlow
import kotlinx.coroutines.flow.channelFlow
import kotlinx.coroutines.launch
import kotlinx.coroutines.sync.Semaphore
import software.amazon.awssdk.core.ResponseBytes
import software.amazon.awssdk.core.async.AsyncRequestBody
import software.amazon.awssdk.core.async.AsyncResponseTransformer
import software.amazon.awssdk.services.s3.S3AsyncClient
import software.amazon.awssdk.services.s3.model.*
import java.util.concurrent.atomic.AtomicInteger


suspend fun S3AsyncClient.deleteObjectSuspend(requestBuilder: DeleteObjectRequest.Builder.() -> Unit): DeleteObjectResponse {
    val request = DeleteObjectRequest.builder().apply(requestBuilder).build()
    return deleteObject(request).suspend()
}

suspend fun S3AsyncClient.restoreObjectSuspend(requestBuilder: RestoreObjectRequest.Builder.() -> Unit): RestoreObjectResponse {
    val request = RestoreObjectRequest.builder().apply(requestBuilder).build()
    return restoreObject(request).suspend()
}

suspend fun S3AsyncClient.putObjectSuspend(
    body: ByteArray,
    requestBuilder: PutObjectRequest.Builder.() -> Unit
): PutObjectResponse {
    val request = PutObjectRequest.builder().apply(requestBuilder).build()
    return putObject(request, AsyncRequestBody.fromBytes(body)).suspend()
}

suspend fun S3AsyncClient.getObjectSuspend(key: String, bucket: String): AnyGetObjectResponse {
    val request = GetObjectRequest.builder()
        .apply {
            key(key)
            bucket(bucket)
        }
        .build()
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
suspend fun S3AsyncClient.putObjectsFlow(
    objects: Map<String, ByteArray>,
    bucket: String,
): Flow<Triple<PutObjectResponse, String, ByteArray>> = processInParallel(objects.toList(), 10) { (key, body) ->
    Triple(putObjectSuspend(body) {
        key(key)
        bucket(bucket)
    }, key, body)
}

suspend fun <T, R> processInParallel(
    items: List<T>,
    parallelCount: Int,
    process: suspend (T) -> R
): Flow<R> = channelFlow {
    val availableWorkers = Semaphore(permits = parallelCount)
    val nextIndex = AtomicInteger(0)

    while (nextIndex.get() < items.size) {
        availableWorkers.acquire()
        val toProcess = nextIndex.getAndIncrement()
        launch(Dispatchers.IO) {
            send(process(items[toProcess]))
            availableWorkers.release()
        }
    }
}

suspend fun S3AsyncClient.listAllObjectsFlow(bucket: String): Flow<List<S3Object>> {
    val request = ListObjectsV2Request.builder()
        .bucket(bucket)
        .build()

    return callbackFlow {
        listObjectsV2Paginator(request).subscribe {
//            for (obj in it.contents()) {
                trySend(it.contents())
//            }
        }.thenAcceptAsync {
            channel.close()
        }
        awaitClose { }
    }
}

suspend fun S3AsyncClient.getObjectsFlow(keys: List<String>, bucket: String, concurrency: Int = 10): Flow<Pair<String,AnyGetObjectResponse>> {
    return processInParallel(keys, concurrency) {
        it to getObjectSuspend(key = it, bucket = bucket)
    }
}


sealed interface AnyGetObjectResponse {
    class Success(val bytes: ResponseBytes<GetObjectResponse>) : AnyGetObjectResponse
    object NoSuchKey : AnyGetObjectResponse
    object InvalidObjectState : AnyGetObjectResponse
    class UnexpectedError(val e: Throwable) : AnyGetObjectResponse
}
