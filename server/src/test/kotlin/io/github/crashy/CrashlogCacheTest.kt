package io.github.crashy

import io.github.crashy.crashlogs.storage.*
import strikt.api.expectThat
import strikt.assertions.isEqualTo
import java.nio.file.Files
import java.nio.file.Path
import java.nio.file.attribute.FileTime
import java.time.ZonedDateTime
import kotlin.io.path.setAttribute
import kotlin.random.Random
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


        val id1 = CrashlogId.generate()
        expectThat(getBytes(id1)).isEqualTo(null)

        val log1 = createLog()
        testStore(id1, log1)

        expectThat(getBytes(id1)).isEqualTo(log1.bytes)

        val id2 = CrashlogId.generate()
        expectThat(getBytes(id2)).isEqualTo(null)

        val log2 = createLog()
        testStore(id2, log2)
        expectThat(getBytes(id2)).isEqualTo(log2.bytes)

        advanceDays(10)
        evictOld {_, _ ->}

        expectThat(getBytes(id1)).isEqualTo(log1.bytes)
        expectThat(getBytes(id2)).isEqualTo(log2.bytes)


        val id3 = CrashlogId.generate()
        val log3 = createLog()
        testStore(id3, log3)

        advanceDays(15)
        evictOld {_, _ ->}

        expectThat(getBytes(id1)).isEqualTo(log1.bytes)
        expectThat(getBytes(id2)).isEqualTo(log2.bytes)
        expectThat(getBytes(id3)).isEqualTo(log3.bytes)

        advanceDays(15)
        evictOld {_, _ ->}

        expectThat(getBytes(id1)).isEqualTo(log1.bytes)
        expectThat(getBytes(id2)).isEqualTo(log2.bytes)
        expectThat(getBytes(id3)).isEqualTo(log3.bytes)

        advanceDays(20)
        evictOld {_, _ ->}

        expectThat(getBytes(id1)).isEqualTo(log1.bytes)
        expectThat(getBytes(id2)).isEqualTo(log2.bytes)

        advanceDays(20)
        evictOld {_, _ ->}

        expectThat(getBytes(id1)).isEqualTo(log1.bytes)
        expectThat(getBytes(id2)).isEqualTo(log2.bytes)
        expectThat(getBytes(id3)).isEqualTo(null)


        advanceDays(20)
        evictOld {_, _ ->}

        advanceDays(20)
        evictOld {_, _ ->}

        expectThat(getBytes(id1)).isEqualTo(null)
        expectThat(getBytes(id2)).isEqualTo(null)
        expectThat(getBytes(id3)).isEqualTo(null)
    }

    private fun testScope(test: context (CrashlogCache, TestClock, Path) () -> Unit) {
        val clock = TestClock()
        val dir = Files.createTempDirectory("test")
        val cache = CrashlogCache(dir, clock)
        test(cache, clock, dir)
    }

     context (CrashlogCache, TestClock, Path)
    private fun getBytes(id: CrashlogId): ByteArray? {
        val bytes = get(id)?.bytes
        if (bytes != null) {
            alignFileWithTestTime(id)
        }
        return bytes
    }

    context (CrashlogCache, TestClock, Path)
            private fun testStore(id: CrashlogId, log: CompressedCrashlog) {
        store(id, log)
        alignFileWithTestTime(id)
    }

    context (CrashlogCache, TestClock, Path)
            private fun alignFileWithTestTime(id: CrashlogId) {
        val crashFile = resolve("crashlogs").resolve(id.value.toString() + ".crash")
        // Update the lastAccessTime to match with the time we've advanced on the TestClock
        crashFile.setAttribute("lastAccessTime", FileTime.from(now().toInstant()))
    }


    private fun createLog() = CompressedCrashlog.createRandom()
}