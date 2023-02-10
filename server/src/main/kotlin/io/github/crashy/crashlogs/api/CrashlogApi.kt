package io.github.crashy.crashlogs.api

import io.github.crashy.Crashy
import io.github.crashy.Crashy.Build.Local
import io.github.crashy.Crashy.StaticDir
import io.github.crashy.crashlogs.*
import io.github.crashy.crashlogs.storage.CrashlogStorage
import io.github.crashy.crashlogs.storage.GetCrashlogResult
import io.github.crashy.crashlogs.storage.PeekCrashlogResult
import io.github.crashy.utils.log.LogContext
import io.github.crashy.utils.replaceSequentially
import io.ktor.http.*
import java.time.Instant
import kotlin.io.path.readText


private const val MaxCrashSize = 100_000


class CrashlogApi(private val logs: CrashlogStorage) {
    private val uploadLimiter = UploadLimiter()

    context(LogContext)
    fun uploadCrash(request: UploadCrashlogRequest, ip: String): UploadCrashResponse {
        logData("Accepted size") { request.size }
        if (request.size > MaxCrashSize) {
            logInfo { "Crash size was ${request.size} which is over the max of $MaxCrashSize" }
            return UploadCrashResponse.CrashTooLargeError
        }
        if (!uploadLimiter.requestUpload(ip, request.size)) {
            logInfo { "IP $ip is being rate limited" }
            return UploadCrashResponse.RateLimitedError
        }

        val id = CrashlogId.generate()
        val key = DeletionKey.generate()
        logData("Generated ID") { id }
        logData("Deletion Key") { key }

        val header = CrashlogHeader.readFromLog(request) ?: return UploadCrashResponse.MalformedCrashError
        logs.store(id = id, log = CrashlogEntry(request.compress(), CrashlogMetadata(key, Instant.now(), header)))

        return UploadCrashResponse.Success(
            id,
            deletionKey = key,
            crashyUrl = "$httpPrefix://${Crashy.domain}/${id.value}?code=${key}"
        )

    }

    private val httpPrefix = if (Crashy.isLocal()) "http" else "https"

    context(LogContext)
    suspend fun getCrash(id: String): Response {
        logData("ID") { id }
        val logId = CrashlogId.parse(id).getOrElse {
            logInfo { "No such ID is stored" }
            return textResponse("Invalid id", HttpStatusCode.NotFound)
        }
        val response = when (val result = logs.getLog(logId)) {
            GetCrashlogResult.Archived -> GetCrashResponse.Archived
            GetCrashlogResult.DoesNotExist -> GetCrashResponse.DoesNotExist
            is GetCrashlogResult.Success -> GetCrashResponse.Success(result.log)
        }

        logData("Response") { response::class.toString() }
        return response
    }

    private val htmlTemplate = StaticDir.resolve("index.html").readText()
    private val notFound = Triple("Invalid Crash Url", "Looks like there's nothing here", HttpStatusCode.NotFound)
    context(LogContext)
    suspend fun getCrashPage(id: String): Response {
        val logId = CrashlogId.parse(id)
        val (title, description, code) = when {
            logId.isFailure -> notFound
            else -> when (val result = logs.peek(logId.getOrThrow())) {
                PeekCrashlogResult.Archived -> Triple(
                    "Archived Crash",
                    "This crash wasn't accessed in a long time",
                    HttpStatusCode.OK
                )

                PeekCrashlogResult.DoesNotExist -> notFound
                is PeekCrashlogResult.Success -> {
                    val header = result.metadata.header
                    Triple(header.title, header.exceptionDescription, HttpStatusCode.OK)
                }
            }
        }

        logData("ID") { id }
        logData("Title") { title }
        logData("Description") { description }
        logData("Code") { code }

        return htmlResponse(
            htmlTemplate.replaceSequentially(
                listOf(
                    "{PREFETCH}" to if (code == HttpStatusCode.OK) "rel=\"prefetch\" href=\"$id/raw.txt\"" else "",
                    "{DESCRIPTION}" to description,
                    "{TITLE}" to title
                )
            ),
            code = code
        )
    }

    private val landingPage = htmlTemplate.replaceSequentially(
        listOf("{PREFETCH}" to "", "{DESCRIPTION}" to "Formatted Minecraft crash reports", "{TITLE}" to if(Crashy.isRelease()) "Crashy" else "Crashy Beta")
    )

    fun getLandingPage(): Response {
        return htmlResponse(
            landingPage,
            code = HttpStatusCode.OK
        )
    }

    context(LogContext)
    fun deleteCrash(request: DeleteCrashlogRequest): DeleteCrashResult {
        logData("ID") { request.id }
        logData("Code") { request.key }
        val result = logs.delete(request.id, request.key)
        logData("Result") { result.name }
        return result
    }
}



