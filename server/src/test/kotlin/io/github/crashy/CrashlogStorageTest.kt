package io.github.crashy

import io.github.crashy.crashlogs.*
import io.github.crashy.crashlogs.storage.CrashlogStorage
import io.github.crashy.crashlogs.storage.GetCrashlogResult
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.runBlocking
import kotlinx.coroutines.withContext
import strikt.api.expectThat
import strikt.assertions.isA
import strikt.assertions.isEqualTo
import java.nio.file.Files
import java.nio.file.Path
import kotlin.test.Test


class CrashlogStorageTest {
    @Test
    fun testStorage() = testScope {
        testBody()
    }

    context (CrashlogStorage, TestClock, Path)
            private suspend fun testBody() {
        val id1 = CrashlogId.generate()
        expectThat(getLog(id1)).isEqualTo(GetCrashlogResult.DoesNotExist)

        val log1 = createRandomLog()
        testStore(id1, log1)

        checkBytes(id1, log1)

        val id2 = CrashlogId.generate()
        expectThat(getLog(id2)).isEqualTo(GetCrashlogResult.DoesNotExist)

        val log2 = createRandomLog()
        testStore(id2, log2)
        checkBytes(id2, log2)

        advanceDays(10)
        evictOld()

        // LastAccess
        checkBytes(id1, log1)
        checkBytes(id2, log2)


        val id3 = CrashlogId.generate()
        val log3 = createRandomLog()
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
        expectThat(testDelete(id1, log2.metadata.deletionKey)).isEqualTo(DeleteCrashResult.IncorrectDeletionKey)
        expectThat(testDelete(id2, log1.metadata.deletionKey)).isEqualTo(DeleteCrashResult.IncorrectDeletionKey)
        expectThat(testDelete(id1, log1.metadata.deletionKey)).isEqualTo(DeleteCrashResult.Success)
        expectThat(testDelete(id2, log2.metadata.deletionKey)).isEqualTo(DeleteCrashResult.Success)
        expectThat(testDelete(id3, log3.metadata.deletionKey)).isEqualTo(DeleteCrashResult.Success)
        expectThat(testDelete(id1, log1.metadata.deletionKey)).isEqualTo(DeleteCrashResult.NoSuchId)
        expectThat(testDelete(id2, log2.metadata.deletionKey)).isEqualTo(DeleteCrashResult.NoSuchId)
        expectThat(testDelete(id3, log3.metadata.deletionKey)).isEqualTo(DeleteCrashResult.NoSuchId)
        expectThat(getLog(id1)).isEqualTo(GetCrashlogResult.DoesNotExist)
        expectThat(getLog(id2)).isEqualTo(GetCrashlogResult.DoesNotExist)
        expectThat(getLog(id3)).isEqualTo(GetCrashlogResult.DoesNotExist)

    }

    @Test
    fun testArchived() = testScope {
        expectThat(getLog(CrashlogId.parse("7fc76c2f-5dc0-402f-bec8-4869d86ef3f3").getOrThrow())).isEqualTo(
            GetCrashlogResult.Archived
        )
    }

    private inline fun testScope(crossinline test: suspend context (CrashlogStorage, TestClock, Path) () -> Unit) {
        runBlocking {
            val clock = TestClock()
            val dir = withContext(Dispatchers.IO) {
                Files.createTempDirectory("test")
            }
            val cache = CrashlogStorage.create(bucket = "crashy-test-crashlogs", clock, dir)
            test(cache, clock, dir.resolve("cache"))
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
        val result = getLog(id)
        if (result is GetCrashlogResult.Success) {
            alignFileWithTestTime(id)
        }
        expectThat(result)
            .isA<GetCrashlogResult.Success>()
            .get(GetCrashlogResult.Success::log)
            .and {
                get(CrashlogEntry::compressedLog).get(CompressedLog::bytes).isEqualTo(log.compressedLog.bytes)
                get(CrashlogEntry::metadata).isEqualTo(log.metadata)
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


}