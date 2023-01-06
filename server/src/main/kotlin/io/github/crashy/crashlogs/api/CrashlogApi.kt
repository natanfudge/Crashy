package io.github.crashy.crashlogs.api

import io.github.crashy.Crashy
import io.github.crashy.Crashy.Build.*
import io.github.crashy.crashlogs.*
import io.github.crashy.crashlogs.storage.CrashlogStorage
import io.github.crashy.crashlogs.storage.GetCrashlogResult
import io.github.crashy.crashlogs.storage.PeekCrashlogResult
import io.github.crashy.staticDir
import io.github.crashy.utils.replaceSequentially
import io.ktor.http.*
import java.time.Instant
import kotlin.io.path.readText


private const val MaxCrashSize = 100_000


class CrashlogApi(private val logs: CrashlogStorage) {
    private val uploadLimiter = UploadLimiter()
    fun uploadCrash(request: UploadCrashlogRequest, ip: String): UploadCrashResponse {
        if (request.size > MaxCrashSize) return UploadCrashResponse.CrashTooLargeError
        if (!uploadLimiter.requestUpload(ip, request.size)) return UploadCrashResponse.RateLimitedError

        println("Accepted size: ${request.size}")

        val id = CrashlogId.generate()
        val key = DeletionKey.generate()
        println("Uploading crash log with deletion key $key")
        val header = peekCrashHeader(request) ?: return UploadCrashResponse.MalformedCrashError
        logs.store(id = id, log = CrashlogEntry(request.compress(), CrashlogMetadata(key, Instant.now(), header)))

        return UploadCrashResponse.Success(id, deletionKey = key, crashyUrl = "$httpPrefix://${Crashy.domain}/${id.value}?code=${key}")
    }

    private val httpPrefix = if(Crashy.build == Local) "http" else "https"

    suspend fun getCrash(id: String): Response {
        val logId = CrashlogId.parse(id).getOrElse { return textResponse("Invalid id", HttpStatusCode.NotFound) }
        return when (val result = logs.getLog(logId)) {
            GetCrashlogResult.Archived -> GetCrashResponse.Archived
            GetCrashlogResult.DoesNotExist -> GetCrashResponse.DoesNotExist
            is GetCrashlogResult.Success -> GetCrashResponse.Success(result.log)
        }
    }

    private val htmlTemplate = staticDir.resolve("index.html").readText()
    private val notFound = Triple("Invalid Crash Url", "Looks like there's nothing here", HttpStatusCode.NotFound)
    suspend fun getCrashPage(id: String): Response {
        val logId = CrashlogId.parse(id)
        val (title, description, code) = when {
            logId.isFailure -> notFound
            else -> when (val result = logs.peek(logId.getOrThrow())) {
                //TODO: implement in frontend
                PeekCrashlogResult.Archived -> Triple(
                    "Archived Crash",
                    "This crash wasn't accessed in a long time",
                    HttpStatusCode.Processing
                )

                PeekCrashlogResult.DoesNotExist -> notFound
                is PeekCrashlogResult.Success -> {
                    val header = result.metadata.header
                    Triple(header.title, header.exceptionDescription, HttpStatusCode.OK)
                }
            }
        }
        return htmlResponse(
            htmlTemplate.replaceSequentially(
                listOf(
                    "{prefetch}" to if(code == HttpStatusCode.OK) "rel=\"prefetch\" href=\"$id/raw.txt\"" else "",
                    "{DESCRIPTION}" to description,
                    "{TITLE}" to title
                )
            ),
            code = code
        )
    }

    private val landingPage = htmlTemplate.replaceSequentially(
        listOf("{prefetch}" to "", "{DESCRIPTION}" to "Formatted Minecraft crash reports", "{TITLE}" to "Crashy")
    )

    suspend fun getLandingPage(): Response {
        return htmlResponse(
            landingPage,
            code = HttpStatusCode.OK
        )
    }

    fun deleteCrash(request: DeleteCrashlogRequest): DeleteCrashResult {
        return logs.delete(request.id, request.key)
    }
}

private fun peekCrashHeader(log: UncompressedLog): CrashlogHeader? {
    // 1000 bytes saves a lot of time and should be enough in all cases
    val start = log.peek(bytes = 1000)
    val lines = start.split("\n")
    val descriptionLine = lines.indexOfFirst { it.startsWith("Description:") }
    if (descriptionLine == -1) return null
    val description = lines[descriptionLine].removePrefix("Description:").trim()
    val exception = lines[descriptionLine + 2].trim()
    return CrashlogHeader(description, exception)
}

