package io.github.crashy

import io.github.crashy.crashlogs.*
import io.github.crashy.crashlogs.storage.CrashlogCache
import io.github.crashy.utils.randomString
import java.nio.file.Path
import java.nio.file.attribute.FileTime
import kotlin.io.path.exists
import kotlin.io.path.setAttribute

context (TestClock, Path)
         fun alignFileWithTestTime(id: CrashlogId) {
    val crashFile = CrashlogCache.__testGetLogFile(this@Path, id)

    // Update the lastAccessTime to match with the time we've advanced on the TestClock
   if(crashFile.exists()) crashFile.setAttribute("lastAccessTime", FileTime.from(now().toInstant()))
}


 fun createRandomLog() = CrashlogEntry(
    CompressedLog.createRandom(),
    createRandomMetadata()
)

private fun createRandomMetadata() = CrashlogMetadata(
    DeletionKey.generate(),
    CrashlogHeader(randomString(15), randomString(100))
)