package io.github.crashy.compat

import io.github.crashy.Crashy
import io.github.crashy.crashlogs.CrashlogMetadata
import io.github.crashy.crashlogs.DeletionKey
import io.github.crashy.crashlogs.storage.LastAccessDay
import io.github.natanfudge.logs.LogContext
import io.github.natanfudge.logs.Loggy
import io.github.natanfudge.logs.impl.LoggingCredentials
import strikt.api.expectThat
import strikt.assertions.isEqualTo
import java.nio.file.Files
import java.time.Instant
import kotlin.io.path.writeText
import kotlin.test.Test

//data class CrashlogHeader(val title: String?, val exceptionDescription: String) {
class NewLastAccessDay {
    private val loggy = Loggy.create(true, Files.createTempDirectory("temp"), LoggingCredentials(charArrayOf('f'), charArrayOf('b')))

    //        val deletionKey: DeletionKey,
//
//    @Serializable(with = InstantSerializer::class) val uploadDate: Instant,
//    val header: CrashlogHeader,
    @Test
    fun crashlogMetadataWithNoLastAccessDayWorks(): Unit = loggy.startCall("test") {
        //language=json
        val json = """
            {
              "deletionKey": "${DeletionKey.generate()}",
              "uploadDate": "${Instant.now().toEpochMilli()}",
              "header": {
                "title": "Foo", 
                "exceptionDescription": "Bar"
              }
            }
        """.trimIndent()

        val jsonFile = Files.createTempFile("metadata-json-test", ".json")
        jsonFile.writeText(json)

        val parsed = Crashy.json.decodeFromString<CrashlogMetadata>(json)
        expectThat(parsed.getLastAccessDay(jsonFile)).isEqualTo(LastAccessDay.today())
    }
}