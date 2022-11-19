package io.github.crashy.crashlogs.api

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
        val header = peekCrashHeader(request) ?: return UploadCrashResponse.MalformedCrashError
        logs.store(id = id, log = CrashlogEntry(request.compress(), CrashlogMetadata(key, Instant.now(), header)))

        return UploadCrashResponse.Success(id, deletionKey = key, crashyUrl = "https://crashy.net/${id.value}")
    }

    suspend fun getCrash(id: String): Response {
        val logId = CrashlogId.parse(id).getOrElse { return textResponse("Invalid id", HttpStatusCode.NotFound) }
        return when (val result = logs.getLog(logId)) {
            GetCrashlogResult.Archived -> GetCrashResponse.Archived
            GetCrashlogResult.DoesNotExist -> GetCrashResponse.DoesNotExist
            is GetCrashlogResult.Success -> GetCrashResponse.Success(result.log)
        }
    }

    private val htmlTemplate = staticDir.resolve("index.html").readText()
    suspend fun getCrashPage(id: String): Response {
        val logId = CrashlogId.parse(id).getOrElse { return textResponse("Invalid id", HttpStatusCode.NotFound) }
        val (title, description) = when (val result = logs.peek(logId)) {
            //TODO: implement in frontend
            PeekCrashlogResult.Archived -> "Archived Crash" to "This crash wasn't accessed in a long time"
            //TODO: implement in frontend
            PeekCrashlogResult.DoesNotExist -> "Invalid Crash Url" to "Looks like there's nothing here"
            is PeekCrashlogResult.Success -> {
                val header = result.metadata.header
               header.title to header.exceptionDescription
            }
        }
        return htmlResponse(
            htmlTemplate.replaceSequentially(
                listOf("{ID}" to id, "{DESCRIPTION}" to description, "{TITLE}" to title)
            ),
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

