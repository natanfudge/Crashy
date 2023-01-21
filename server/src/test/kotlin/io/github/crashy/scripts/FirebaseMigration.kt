package io.github.crashy.scripts

import com.google.auth.oauth2.GoogleCredentials
import com.google.cloud.Timestamp
import com.google.cloud.firestore.Blob
import com.google.firebase.FirebaseApp
import com.google.firebase.FirebaseOptions
import com.google.firebase.cloud.FirestoreClient
import io.github.crashy.Crashy
import io.github.crashy.api.utils.savedInt
import io.github.crashy.compat.firestoreIdToUUID
import io.github.crashy.crashlogs.*
import io.github.crashy.utils.decompressGzip
import io.github.crashy.utils.listAllObjectsFlow
import io.github.crashy.utils.putObjectsFlow
import io.ktor.util.date.*
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.flow.onEach
import kotlinx.coroutines.flow.toList
import kotlinx.coroutines.runBlocking
import kotlinx.coroutines.withContext
import kotlinx.serialization.ExperimentalSerializationApi
import software.amazon.awssdk.regions.Region
import software.amazon.awssdk.services.s3.S3AsyncClient
import strikt.api.expectThat
import strikt.assertions.isNotEqualTo
import java.nio.file.Paths
import java.time.Instant
import kotlin.io.path.*
import kotlin.test.Test

val firestoreExportDir = Paths.get("C:/users/natan/desktop/Crashy/server/FirestoreMigration")
val s3ExportDir = Paths.get("C:/users/natan/desktop/Crashy/server/S3Export")

fun main() = runBlocking{
//    FirebaseMigration.FirebaseExporter().export()
//    FirebaseMigration.S3Importer().import()
    FirebaseMigration.S3Exporter().getIdList()

}

class FirebaseMigration {

    private val indexBackedUp = 72780

    //TODO: I think I'm being very inefficient by using json...


    class FirebaseExporter {
        private var currentCrashIndex by savedInt(72780, "Test_FireBaseMigrator_currentCrashIndex3")
        private var currentBatchIndex by savedInt(0, "Test_FireBaseMigrator_currentBatchIndex")

        @OptIn(ExperimentalSerializationApi::class)
        suspend fun export() {
            val serviceAccount = FirebaseMigration::class.java
                .getResourceAsStream("/secrets/crashy-9dd87-firebase-adminsdk-xhp2d-50a8861df9.json")

            val options: FirebaseOptions = FirebaseOptions.builder()
                .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                .build()

            FirebaseApp.initializeApp(options)

            val db = FirestoreClient.getFirestore()

//            while (true) {
            val future = db.collection("crashes").orderBy("uploadDate").offset(currentCrashIndex).limit(1000).get()
            val crashes = withContext(Dispatchers.IO) {
                future.get()
            }.documents

//                if (crashes.isEmpty()) break

//                val s3Client = S3AsyncClient.builder().region(Region.EU_CENTRAL_1).build()


            val objectKeys = crashes.associate { crash ->
                val gzipCompressed = crash.data["log"] as Blob
                val deletionKey = crash.data["key"] as String
                val uploadDate = crash.data["uploadDate"] as Timestamp
                val decompressed = gzipCompressed.toBytes().decompressGzip()
                val decompressedLog = UncompressedLog(decompressed)
                val brotliCompressed = CompressedLog.compress(decompressed)
                val header = CrashlogHeader.readFromLog(decompressedLog) ?: kotlin.run {
                    println("Failed to run header of crash log with ID ${crash.id}, it will be given a stub header")
                    CrashlogHeader(title = "Some Crash", exceptionDescription = "Something wrong happened")
                }
                val metadata = CrashlogMetadata(
                    DeletionKey.fromExisting(deletionKey),
                    uploadDate = uploadDate.toDate().toInstant(),
                    header
                )

                val entry = CrashlogEntry(brotliCompressed, metadata)
                val crashlogId = CrashlogId.parse(crash.id).getOrThrow()


                println("Exporting crash log from $uploadDate [${crash.id} -> $crashlogId]")
                crashlogId.s3Key() to Crashy.protobuf.encodeToByteArray(CrashlogEntry.serializer(), entry)
            }


            val destinationDir = firestoreExportDir
                .resolve(currentBatchIndex.toString())
                .createDirectories()
            for ((key, body) in objectKeys) {
                destinationDir.resolve("$key.proto").writeBytes(body)
            }
            currentBatchIndex++


//                s3Client.putObjectsSuspend(objectKeys, "crashy-crashlogs")

            currentCrashIndex += crashes.size
            val firstCrashTime = GMTDate(0, 0, 0, 2, Month.OCTOBER, 2021).toJvmDate()
                .toInstant().toEpochMilli()
            val oldestCrashTimestampOfBatch = crashes.last().data["uploadDate"] as Timestamp
            val batchTime = oldestCrashTimestampOfBatch.toDate().toInstant().toEpochMilli()
            val millisPassedSinceFirstCrash = Instant.now().toEpochMilli() - firstCrashTime
            val millisPassedSinceFirstCrashToBatch = batchTime - firstCrashTime
            val percentDone = millisPassedSinceFirstCrashToBatch.toDouble() / millisPassedSinceFirstCrash
            println("Total exported: $currentCrashIndex (about ${percentDone * 100}% done)")
//            }


        }
    }

    class S3Importer {
        fun import() = runBlocking {
            val s3Client = S3AsyncClient.builder().region(Region.EU_CENTRAL_1).build()
            val files = firestoreExportDir.resolve("0").listDirectoryEntries()
            val objects = files.associate { it.toFile().nameWithoutExtension to it.readBytes() }
            println("Putting ${objects.size} objects...")
            s3Client.putObjectsFlow(objects, Crashy.S3CrashlogBucket).collect { (_, key, body) ->
                println("Imported log with id $key of ${body.size} bytes compressed." )
            }
            println("Put complete")
        }
    }
    class S3Exporter {
        var progressIndex by savedInt(0, "FirebaseMigration_S3Exporter_progressIndex")
        fun import() = runBlocking {
            val s3Client = S3AsyncClient.builder().region(Region.EU_CENTRAL_1).build()
            val objects = s3Client.listObjectsV2Paginator {
                it.bucket(Crashy.S3CrashlogBucket)
            }

//            val files = s3ExportDir.resolve(progressIndex.toString()).listDirectoryEntries()
//            val objects = files.associate { it.toFile().nameWithoutExtension to it.readBytes() }
//            println("Putting ${objects.size} objects...")
//            s3Client.putObjectsSuspend(objects, "crashy-crashlogs").collect { (_, key, body) ->
//                println("Imported log with id $key of ${body.size} bytes compressed." )
//            }
//            println("Put complete")
        }

        fun getIdList() = runBlocking {
            val file = s3ExportDir.resolve("ids").apply { createDirectories() }.resolve("ids.txt")
            val s3Client = S3AsyncClient.builder().region(Region.EU_CENTRAL_1).build()
            val ids = s3Client.listAllObjectsFlow(Crashy.S3CrashlogBucket)
                .onEach {
                    println("Received ${it.size} objects")
                }
                .toList()
                .flatten()
                .map { it.key() }
            file.writeText(ids.joinToString("\n"))

        }
    }

    @Test
    fun testIdConversion() {
        val id1 = "001hsUWaLr9dk3tPzKCt"
        val id2 = "12BNXMNpcG9PS8R78EQZ"
        val converted1 = firestoreIdToUUID(id1)
        val converted2 = firestoreIdToUUID(id2)

        expectThat(converted1).isNotEqualTo(converted2)
        println(converted1)
        println(converted2)
    }
}


