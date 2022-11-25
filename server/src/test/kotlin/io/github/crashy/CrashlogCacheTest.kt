package io.github.crashy

import io.github.crashy.crashlogs.CompressedLog
import io.github.crashy.crashlogs.CrashlogEntry
import io.github.crashy.crashlogs.CrashlogId
import io.github.crashy.crashlogs.storage.CrashlogCache
import io.github.crashy.crashlogs.storage.NowDefinition
import io.github.crashy.crashlogs.storage.RealClock
import kotlinx.coroutines.runBlocking
import strikt.api.expectThat
import strikt.assertions.isEqualTo
import strikt.assertions.isNotNull
import java.nio.file.Files
import java.nio.file.Path
import java.time.ZonedDateTime
import kotlin.test.Test

class TestClock : NowDefinition {
    private var additionalDaysPassed = 0
    override fun now(): ZonedDateTime {
        return RealClock.now().plusDays(additionalDaysPassed.toLong())
    }

    fun advanceDays(days: Int) {
        additionalDaysPassed += days
    }
}

class CrashlogCacheTest {
    @Test
    fun testCache() = testScope {
        testCacheBody()
    }

    context (CrashlogCache, TestClock, Path)
    suspend fun testCacheBody() {
        val id1 = CrashlogId.generate()
        expectThat(getForTest(id1)).isEqualTo(null)

        val log1 = createRandomLog()
        testStore(id1, log1)

        checkBytes(id1, log1)

//        println()

        val id2 = CrashlogId.generate()
        expectThat(getForTest(id2)).isEqualTo(null)

        val log2 = createRandomLog()
        testStore(id2, log2)
        checkBytes(id2, log2)

        advanceDays(10)
        evictOld { _, _ -> }

        checkBytes(id1, log1)
        checkBytes(id2, log2)

        val id3 = CrashlogId.generate()
        val log3 = createRandomLog()
        testStore(id3, log3)

        advanceDays(15)
        evictOld { _, _ -> }

        checkBytes(id1, log1)
        checkBytes(id2, log2)
        checkBytes(id3, log3)

        advanceDays(15)
        evictOld { _, _ -> }

        checkBytes(id1, log1)
        checkBytes(id2, log2)
        checkBytes(id3, log3)

        advanceDays(20)
        evictOld { _, _ -> }

        checkBytes(id1, log1)
        checkBytes(id2, log2)

        advanceDays(20)
        evictOld { _, _ -> }

        checkBytes(id1, log1)
        checkBytes(id2, log2)
        expectThat(getForTest(id3)).isEqualTo(null)


        advanceDays(20)
        evictOld { _, _ -> }

        advanceDays(20)
        evictOld { _, _ -> }

        expectThat(getForTest(id1)).isEqualTo(null)
        expectThat(getForTest(id2)).isEqualTo(null)
        expectThat(getForTest(id3)).isEqualTo(null)
    }

    context (CrashlogCache, TestClock, Path)   fun checkBytes(id: CrashlogId, log: CrashlogEntry) {
        expectThat(getForTest(id)).isNotNull().and {
            get(CrashlogEntry::compressedLog).get(CompressedLog::bytes).isEqualTo(log.compressedLog.bytes)
            get(CrashlogEntry::metadata).isEqualTo(log.metadata)
        }
    }


    private inline fun testScope(crossinline test: suspend context (CrashlogCache, TestClock, Path) () -> Unit) {
        val clock = TestClock()
        val dir = Files.createTempDirectory("test")
        val cache = CrashlogCache(dir, clock)
        runBlocking { test(cache, clock, dir) }
    }


    context (CrashlogCache, TestClock, Path)
    private fun getForTest(id: CrashlogId): CrashlogEntry? {
        val bytes = get(id)
        if (bytes != null) {
            alignFileWithTestTime(id)
        }
        return bytes
    }

    context (CrashlogCache, TestClock, Path)
    private fun testStore(id: CrashlogId, log: CrashlogEntry) {
        store(id, log)
        alignFileWithTestTime(id)
    }


}