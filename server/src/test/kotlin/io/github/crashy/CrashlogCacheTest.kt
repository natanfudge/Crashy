package io.github.crashy

import io.github.crashy.crashlogs.storage.CrashlogCache
import io.github.crashy.crashlogs.storage.NowProvider
import java.nio.file.Files
import java.time.ZonedDateTime
import kotlin.test.Test

object TestClock : NowProvider {
    override fun now(): ZonedDateTime {
        TODO("Not yet implemented")
    }
}

class CrashlogCacheTest {
    @Test
    fun testCache() {
        val cache = CrashlogCache(Files.createTempDirectory("test"), TestClock)
        TODO()
    }
}