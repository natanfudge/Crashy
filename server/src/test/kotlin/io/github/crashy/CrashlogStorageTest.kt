package io.github.crashy

import io.github.crashy.crashlogs.storage.*
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.runBlocking
import kotlinx.coroutines.withContext
import strikt.api.DescribeableBuilder
import strikt.api.expectThat
import strikt.assertions.isA
import strikt.assertions.isEqualTo
import java.nio.file.Files
import java.nio.file.Path
import java.nio.file.attribute.FileTime
import kotlin.io.path.setAttribute
import kotlin.test.Test


class CrashlogStorageTest {
    @Test
    fun testStorage() = testScope {
        val id1 = CrashlogId.generate()
        expectThat(get(id1)).isEqualTo(GetCrashlogResponse.DoesNotExist)

        val log1 = createLog()
        testStore(id1, log1)

        expectBytes(id1).isEqualTo(log1.bytes)

        val id2 = CrashlogId.generate()
        expectThat(get(id2)).isEqualTo(GetCrashlogResponse.DoesNotExist)

        val log2 = createLog()
        testStore(id2, log2)
        expectBytes(id2).isEqualTo(log2.bytes)

        advanceDays(10)
        evictOld()

        // LastAccess
        expectBytes(id1).isEqualTo(log1.bytes)
        expectBytes(id2).isEqualTo(log2.bytes)


        val id3 = CrashlogId.generate()
        val log3 = createLog()
        testStore(id3, log3)

        advanceDays(15)
        evictOld()

        expectBytes(id1).isEqualTo(log1.bytes)
        expectBytes(id2).isEqualTo(log2.bytes)
        expectBytes(id3).isEqualTo(log3.bytes)

        advanceDays(15)
        evictOld()

        expectBytes((id1)).isEqualTo(log1.bytes)
        expectBytes((id2)).isEqualTo(log2.bytes)
        expectBytes((id3)).isEqualTo(log3.bytes)

        advanceDays(20)
        evictOld()

        expectBytes((id1)).isEqualTo(log1.bytes)
        expectBytes((id2)).isEqualTo(log2.bytes)

        advanceDays(20)
        evictOld()

        expectBytes(id1).isEqualTo(log1.bytes)
        expectBytes(id2).isEqualTo(log2.bytes)
        expectBytes(id3).isEqualTo(log3.bytes)


        advanceDays(20)
        evictOld()

        advanceDays(20)
        evictOld()

        expectBytes(id1).isEqualTo(log1.bytes)
        expectBytes(id2).isEqualTo(log2.bytes)
        expectBytes(id3).isEqualTo(log3.bytes)
    }

    @Test
    fun testArchived() = testScope {
        expectThat(get(CrashlogId.fromString("7fc76c2f-5dc0-402f-bec8-4869d86ef3f3"))).isEqualTo(GetCrashlogResponse.Archived)
    }

    private inline fun testScope(crossinline test: suspend context (CrashlogStorage, TestClock, Path) () -> Unit) {
        runBlocking {
            val clock = TestClock()
            val dir = withContext(Dispatchers.IO) {
                Files.createTempDirectory("test")
            }
            val cache = CrashlogStorage.create(bucket = "crashy-test-crashlogs", clock, dir)
            test(cache, clock, dir)
        }

    }

    context (CrashlogStorage, TestClock, Path)
            private suspend fun expectBytes(id: CrashlogId): DescribeableBuilder<ByteArray> {
        val result = get(id)
        if (result is GetCrashlogResponse.Success) {
            alignFileWithTestTime(id)
        }
        return expectThat(result)
            .isA<GetCrashlogResponse.Success>()
            .get(GetCrashlogResponse.Success::log)
            .get(CompressedCrashlog::bytes)
    }

    context (CrashlogStorage, TestClock, Path)
            private fun testStore(id: CrashlogId, log: CompressedCrashlog) {
        store(id, log)
        alignFileWithTestTime(id)
    }

    context (CrashlogStorage, TestClock, Path)
            private fun alignFileWithTestTime(id: CrashlogId) {
        val crashFile = resolve("cache/crashlogs").resolve(id.value.toString() + ".crash")
        val newTime = FileTime.from(now().toInstant())
        // Update the lastAccessTime to match with the time we've advanced on the TestClock
        crashFile.setAttribute("lastAccessTime", newTime)
        val x = 2
    }


    private fun createLog() = CompressedCrashlog.createRandom()
}