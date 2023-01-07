package io.github.crashy

import io.github.crashy.Crashy.StaticDir
import io.github.crashy.crashlogs.*
import io.github.crashy.crashlogs.api.*
import io.github.crashy.crashlogs.storage.CrashlogStorage
import io.github.crashy.crashlogs.storage.RealClock
import io.github.crashy.mappings.MappingsProvider
import io.github.crashy.utils.decompressGzip
import io.github.crashy.utils.log.CrashyLogger
import io.github.crashy.utils.log.LogContext
import io.ktor.client.utils.*
import io.ktor.http.*
import io.ktor.http.content.*
import io.ktor.server.application.*
import io.ktor.server.http.content.*
import io.ktor.server.plugins.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.util.pipeline.*
import io.ktor.utils.io.core.*
import kotlinx.coroutines.runBlocking
import kotlinx.serialization.ExperimentalSerializationApi
import kotlinx.serialization.json.Json
import kotlinx.serialization.json.decodeFromStream
import java.nio.file.Paths
import kotlin.io.use



