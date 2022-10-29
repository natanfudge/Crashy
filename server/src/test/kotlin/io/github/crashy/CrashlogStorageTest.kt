package io.github.crashy

import io.github.crashy.crashlogs.CrashlogEntry
import io.github.crashy.crashlogs.CrashlogId
import io.github.crashy.crashlogs.DeleteCrashResult
import io.github.crashy.crashlogs.DeletionKey
import io.github.crashy.crashlogs.storage.CrashlogStorage
import io.github.crashy.crashlogs.storage.GetCrashlogResponse
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.runBlocking
import kotlinx.coroutines.withContext
import strikt.api.expectThat
import strikt.assertions.isA
import strikt.assertions.isEqualTo
import java.nio.file.Files
import java.nio.file.Path
import java.nio.file.attribute.FileTime
import kotlin.io.path.exists
import kotlin.io.path.setAttribute
import kotlin.test.Test


class CrashlogStorageTest {
    @Test
    fun testStorage() = testScope {
        val id1 = CrashlogId.generate()
        expectThat(get(id1)).isEqualTo(GetCrashlogResponse.DoesNotExist)

        val log1 = createLog()
        testStore(id1, log1)

        checkBytes(id1, log1)

        val id2 = CrashlogId.generate()
        expectThat(get(id2)).isEqualTo(GetCrashlogResponse.DoesNotExist)

        val log2 = createLog()
        testStore(id2, log2)
        checkBytes(id2, log2)

        advanceDays(10)
        evictOld()

        // LastAccess
        checkBytes(id1, log1)
        checkBytes(id2, log2)


        val id3 = CrashlogId.generate()
        val log3 = createLog()
        testStore(id3, log3)

        advanceDays(15)
        evictOld()

        checkBytes(id1, log1)
        checkBytes(id2, log2)
        checkBytes(id3, log3)

        advanceDays(15)
        evictOld()

        checkBytes(id1, log1)
        checkBytes(id2, log2)
        checkBytes(id3, log3)

        advanceDays(20)
        evictOld()

        checkBytes(id1, log1)
        checkBytes(id2, log2)
        checkBytes(id3, log3)

        advanceDays(20)
        evictOld()

        checkBytes(id1, log1)
        checkBytes(id2, log2)
        checkBytes(id3, log3)


        advanceDays(20)
        evictOld()

        advanceDays(20)
        evictOld()

        checkBytes(id1, log1)
        checkBytes(id2, log2)
        checkBytes(id3, log3)

        // Test deletion
        expectThat(testDelete(id1, log2.deletionKey)).isEqualTo(DeleteCrashResult.IncorrectDeletionKey)
        expectThat(testDelete(id2, log1.deletionKey)).isEqualTo(DeleteCrashResult.IncorrectDeletionKey)
        expectThat(testDelete(id1, log1.deletionKey)).isEqualTo(DeleteCrashResult.Success)
        expectThat(testDelete(id2, log2.deletionKey)).isEqualTo(DeleteCrashResult.Success)
        expectThat(testDelete(id3, log3.deletionKey)).isEqualTo(DeleteCrashResult.Success)
        expectThat(testDelete(id1, log1.deletionKey)).isEqualTo(DeleteCrashResult.NoSuchId)
        expectThat(testDelete(id2, log2.deletionKey)).isEqualTo(DeleteCrashResult.NoSuchId)
        expectThat(testDelete(id3, log3.deletionKey)).isEqualTo(DeleteCrashResult.NoSuchId)
        expectThat(get(id1)).isEqualTo(GetCrashlogResponse.DoesNotExist)
        expectThat(get(id2)).isEqualTo(GetCrashlogResponse.DoesNotExist)
        expectThat(get(id3)).isEqualTo(GetCrashlogResponse.DoesNotExist)

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

    //    context (CrashlogStorage, TestClock, Path)
//            private suspend fun expectBytes(id: CrashlogId): DescribeableBuilder<ByteArray> {
//        val result = get(id)
//        if (result is GetCrashlogResponse.Success) {
//            alignFileWithTestTime(id)
//        }
//        return expectThat(result)
//            .isA<GetCrashlogResponse.Success>()
//            .get(GetCrashlogResponse.Success::log)
//            .get(CrashlogEntry::copyLog)
//    }
    context (CrashlogStorage, TestClock, Path)
            private suspend fun checkBytes(id: CrashlogId, log: CrashlogEntry) {
        val result = get(id)
        if (result is GetCrashlogResponse.Success) {
            alignFileWithTestTime(id)
        }
        expectThat(result)
            .isA<GetCrashlogResponse.Success>()
            .get(GetCrashlogResponse.Success::log)
            .and {
                get(CrashlogEntry::copyLog).isEqualTo(log.copyLog())
                get(CrashlogEntry::deletionKey).isEqualTo(log.deletionKey)
            }
    }

//    context (CrashlogCache, TestClock, Path)   fun checkBytes(id: CrashlogId, log: CrashlogEntry) {
//        expectThat(getForTest(id)).isNotNull().and {
//            get(CrashlogEntry::copyLog).isEqualTo(log.copyLog())
//            get(CrashlogEntry::deletionKey).isEqualTo(log.deletionKey)
//        }
//    }

//    context (CrashlogStorage, TestClock, Path)
//            private suspend fun getForTest(id: CrashlogId): CrashlogEntry? {
//        val bytes = get(id)
//        if (bytes != null) {
//            alignFileWithTestTime(id)
//        }
//        return bytes
//    }

    context (CrashlogStorage, TestClock, Path)
            private fun testStore(id: CrashlogId, log: CrashlogEntry) {
        store(id, log)
        alignFileWithTestTime(id)
    }

    context (CrashlogStorage, TestClock, Path)
            private fun testDelete(id: CrashlogId, deletionKey: DeletionKey): DeleteCrashResult {
        val res = delete(id, deletionKey)
       alignFileWithTestTime(id)
        return res
    }

    context (CrashlogStorage, TestClock, Path)
            private fun alignFileWithTestTime(id: CrashlogId) {
        val crashFile = resolve("cache/crashlogs").resolve(id.value.toString() + ".crash")
        val newTime = FileTime.from(now().toInstant())
        // Update the lastAccessTime to match with the time we've advanced on the TestClock
       if(crashFile.exists()) crashFile.setAttribute("lastAccessTime", newTime)
    }


    private fun createLog() = CrashlogEntry.createRandom()
}