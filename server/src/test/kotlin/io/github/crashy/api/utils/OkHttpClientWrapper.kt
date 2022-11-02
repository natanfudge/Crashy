package io.github.crashy.api.utils

import IHttpClient
import TestHttpResponse
import applyIf
import okhttp3.*
import okhttp3.Headers.Companion.toHeaders
import okhttp3.RequestBody.Companion.toRequestBody
import okhttp3.ResponseBody.Companion.toResponseBody
import okio.*
import java.io.File
import java.io.IOException
import java.util.concurrent.TimeUnit
import kotlin.coroutines.resume
import kotlin.coroutines.resumeWithException
import kotlin.coroutines.suspendCoroutine

class OkHttpTestClient(cache: Boolean, useGzip: Boolean) : IHttpClient {

    private val client = OkHttpClient.Builder().applyIf(cache) {
            cache(
                Cache(
                    directory = File("http_cache"),
                    // $0.05 worth of phone storage in 2020
                    maxSize = 50L * 1024L * 1024L, // 50 MiB
                )
            )
        }.applyIf(useGzip) { addInterceptor(GzipRequestInterceptor()) }.readTimeout(10, TimeUnit.MINUTES)
        .addInterceptor(GzipResponseInterceptor()).eventListener(object : EventListener() {
            override fun cacheHit(call: Call, response: Response) {
                println("Hit cache")
            }

            override fun cacheMiss(call: Call) {
                println("Miss cache")
            }

            override fun cacheConditionalHit(call: Call, cachedResponse: Response) {
                println("Conditional hit ")
            }
        }).build()

    private suspend fun makeRequest(request: Request): Response = suspendCoroutine { cont ->
        client.newCall(request).enqueue(object : Callback {
            override fun onFailure(call: Call, e: IOException) {
                cont.resumeWithException(e)
            }

            override fun onResponse(call: Call, response: Response) {
                cont.resume(response)
            }
        })
    }

    private suspend fun makeTestRequest(request: Request) = with(makeRequest(request)) {
        TestHttpResponse(code, body.string())
    }

    override suspend fun get(url: String): TestHttpResponse {
        val request = Request.Builder().cacheControl(CacheControl.Builder().build()).url(url).build()
        return makeTestRequest(request)
    }

    override suspend fun post(url: String, body: String, useGzip: Boolean, headers: Map<String, String>): TestHttpResponse {
        val request = Request.Builder().post(body.toRequestBody()).headers(headers.toHeaders()).url(url)
            .tag(useGzip)
            .build()
        return makeTestRequest(request)
    }

    override suspend fun delete(url: String): TestHttpResponse {
        val request = Request.Builder().delete().url(url).build()
        return makeTestRequest(request)
    }
}

class GzipRequestInterceptor : Interceptor {
    override fun intercept(chain: Interceptor.Chain): Response {
        val originalRequest: Request = chain.request()
        val useGzip = originalRequest.tag<Boolean>() ?: false
        if (!useGzip) return chain.proceed(originalRequest)

        // do not set content encoding in negative use case
        if (originalRequest.body == null || originalRequest.header("Content-Encoding") != null) {
            return chain.proceed(originalRequest)
        }
        val compressedRequest = originalRequest.newBuilder().header("Content-Type", "application/gzip")
            .method(originalRequest.method, gzip(originalRequest.body)).build()
        return chain.proceed(compressedRequest)
    }

    private fun gzip(body: RequestBody?): RequestBody {
        return object : RequestBody() {
            override fun contentType(): MediaType? {
                return body!!.contentType()
            }

            override fun contentLength(): Long {
                return -1 // We don't know the compressed length in advance!
            }

            override fun writeTo(sink: BufferedSink) {
                val gzipSink: BufferedSink = GzipSink(sink).buffer()
                body!!.writeTo(gzipSink)
                gzipSink.close()
            }
        }
    }
}

class GzipResponseInterceptor : Interceptor {
    override fun intercept(chain: Interceptor.Chain): Response {
        val newRequest: Request.Builder = chain.request().newBuilder()
        newRequest.addHeader("Accept-Encoding", "gzip")
        val response: Response = chain.proceed(newRequest.build())
        return if (isGzipped(response)) {
            unzipResponse(response)
        } else {
            response
        }
    }

    private fun unzipResponse(response: Response): Response {
        if (response.body == null) {
            return response
        }
        val bodyString: String = response.body!!.source().unzip()
        val responseBody = bodyString.toResponseBody(response.body!!.contentType())
        val strippedHeaders =
            response.headers.newBuilder().removeAll("Content-Encoding").removeAll("Content-Length").build()
        return response.newBuilder().headers(strippedHeaders).body(responseBody).message(response.message).build()
    }

    private fun isGzipped(response: Response): Boolean {
        return response.header("Content-Encoding") == "gzip"
    }
}

private fun Source.unzip(): String = gzip().buffer().readUtf8()
