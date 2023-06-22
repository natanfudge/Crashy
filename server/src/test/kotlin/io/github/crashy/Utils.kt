package io.github.crashy

import io.github.crashy.crashlogs.*
import io.github.crashy.crashlogs.storage.CrashlogCache
import io.github.crashy.crashlogs.storage.LastAccessDay
import io.github.crashy.utils.randomString
import kotlinx.serialization.encodeToString
import java.nio.file.Path
import java.nio.file.attribute.FileTime
import java.time.Instant
import kotlin.io.path.exists
import kotlin.io.path.readText
import kotlin.io.path.setAttribute
import kotlin.io.path.writeText

context (TestClock, Path)
fun alignLastAccessMetadataWithTestTime(id: CrashlogId) {
    val crashFile = CrashlogCache.__testGetMetadataFile(this@Path, id)
    if (crashFile.exists()) {
        val oldMetadata = Crashy.json.decodeFromString<CrashlogMetadata>(crashFile.readText())
        val newMetadata = oldMetadata.copy(lastAccessDay = LastAccessDay.fromDate(now()))
        crashFile.writeText(Crashy.json.encodeToString(newMetadata))
    }
}


fun createRandomLog() = CrashlogEntry(
    CompressedLog.createRandom(),
    createRandomMetadata()
)

private fun createRandomMetadata() = CrashlogMetadata.create(
    DeletionKey.generate(),
    Instant.ofEpochMilli(Instant.now().toEpochMilli()),
    CrashlogHeader(randomString(15), randomString(100)),
    LastAccessDay.today()
)