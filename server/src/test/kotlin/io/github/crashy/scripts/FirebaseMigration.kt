package io.github.crashy.scripts

import com.google.auth.oauth2.GoogleCredentials
import com.google.cloud.Timestamp
import com.google.cloud.firestore.Blob
import com.google.firebase.FirebaseApp
import com.google.firebase.FirebaseOptions
import com.google.firebase.cloud.FirestoreClient
import io.github.crashy.Crashy
import io.github.crashy.api.utils.savedInt
import io.github.crashy.api.utils.savedTimestamp
import io.github.crashy.compat.firestoreIdToUUID
import io.github.crashy.crashlogs.*
import io.github.crashy.utils.*
import io.ktor.util.date.*
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.onEach
import kotlinx.coroutines.flow.toList
import kotlinx.coroutines.runBlocking
import kotlinx.coroutines.withContext
import kotlinx.serialization.ExperimentalSerializationApi
import kotlinx.serialization.SerializationException
import software.amazon.awssdk.regions.Region
import software.amazon.awssdk.services.s3.S3AsyncClient
import strikt.api.expectThat
import strikt.assertions.isNotEqualTo
import java.nio.file.Paths
import java.time.Instant
import kotlin.io.path.*
import kotlin.test.Test

private val firestoreExportDir = Paths.get("C:/users/natan/desktop/Crashy/server/FirestoreMigration")
private val s3ExportDir = Paths.get("C:/users/natan/desktop/Crashy/server/S3Export")
private val s3KeysFile = s3ExportDir.resolve("ids").apply { createDirectories() }.resolve("ids.txt")
private val s3UnconvertedFilesDir = s3ExportDir.resolve("crashes").createDirectories()
private val s3ConvertedFilesDir = s3ExportDir.resolve("converted").createDirectories()
fun main() = runBlocking {
    FirebaseMigration.FirebaseExporter().export()
//    FirebaseMigration.S3Importer().import()
//    FirebaseMigration.S3Exporter().getIdList()
//    FirebaseMigration.S3Exporter().export()
//        FirebaseMigration().convertCrashlogs()
}

class FirebaseMigration {

    private val indexBackedUp = 72780


    class FirebaseExporter {
        //        private var currentCrashIndex by savedInt(72780, "Test_FireBaseMigrator_currentCrashIndex4")
        private var lastExportedDate by savedTimestamp(
            Timestamp.parseTimestamp("2021-10-02T10:53:32.044000000Z"),
            "FuckYouFirebase123"
        )
//        private var currentBatchIndex by savedInt(0, "Test_FireBaseMigrator_currentBatchIndex")

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
            val future = db.collection("crashes").orderBy("uploadDate").startAfter(lastExportedDate).limit(100).get()
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
//                .resolve(currentBatchIndex.toString())
                .createDirectories()
            for ((key, body) in objectKeys) {
                destinationDir.resolve("$key.proto").writeBytes(body)
            }


//                s3Client.putObjectsSuspend(objectKeys, "crashy-crashlogs")
            val oldestCrashTimestampOfBatch = crashes.last().data["uploadDate"] as Timestamp

            lastExportedDate = oldestCrashTimestampOfBatch
            val firstCrashTime = GMTDate(0, 0, 0, 2, Month.OCTOBER, 2021).toJvmDate()
                .toInstant().toEpochMilli()
            val batchTime = oldestCrashTimestampOfBatch.toDate().toInstant().toEpochMilli()
            val millisPassedSinceFirstCrash = Instant.now().toEpochMilli() - firstCrashTime
            val millisPassedSinceFirstCrashToBatch = batchTime - firstCrashTime
            val percentDone = millisPassedSinceFirstCrashToBatch.toDouble() / millisPassedSinceFirstCrash
            println("About ${percentDone * 100}% done")
//            }


        }
    }

    class S3Importer {
        private var fromFirestoreProgressIndex by savedInt(0, "FirebaseMigration_S3Importer_fromFirestoreProgressIndex")

        fun importFromFirestore() = runBlocking {
            val s3Client = S3AsyncClient.builder().region(Region.EU_CENTRAL_1).build()
            while (true) {
                val dir = firestoreExportDir.resolve(fromFirestoreProgressIndex.toString())
                if (!dir.exists()) {
                    println("Firestore import complete")
                    break
                }
                val files = dir.listDirectoryEntries()
                val objects = files.associate { it.toFile().nameWithoutExtension to it.readBytes() }
                println("Putting ${objects.size} objects...")
                s3Client.putObjectsFlow(objects, Crashy.S3CrashlogBucket).collect { (_, key, body) ->
                    println("Imported log with id $key of ${body.size} bytes compressed.")
                }
                println("Put complete")
                fromFirestoreProgressIndex++
            }

        }

        private var fromS3ProgressIndex by savedInt(0, "FirebaseMigration_S3Importer_fromS3ProgressIndex")

        fun importFromS3() = runBlocking {
            val s3Client = S3AsyncClient.builder().region(Region.EU_CENTRAL_1).build()
            val files = s3ConvertedFilesDir.listDirectoryEntries()
            while (true) {
                val batch = files.drop(fromS3ProgressIndex).take(100)
                if (batch.isEmpty()) {
                    println("S3 import complete")
                    break
                }
                val objects = files.associate { it.toFile().nameWithoutExtension to it.readBytes() }
                println("Putting ${objects.size} objects...")
                s3Client.putObjectsFlow(objects, Crashy.S3CrashlogBucket).collect { (_, key, body) ->
                    println("Imported log with id $key of ${body.size} bytes compressed.")
                }
                println("Put complete")
                fromS3ProgressIndex++
            }

        }
    }


    class S3Exporter {
        private var progressIndex by savedInt(0, "FirebaseMigration_S3Exporter_progressIndex")

        //        private var batchIndex by savedInt()


        fun export() = runBlocking {
            val s3Client = S3AsyncClient.builder().region(Region.EU_CENTRAL_1).build()
            val keys = s3KeysFile.readText().split("\n")

            while (true) {
                val handled = keys.drop(progressIndex).take(100)

                if (handled.isEmpty()) {
                    println("Importing complete")
                    break
                }

                println("Importing ${handled.size} objects...")

                val objects = s3Client.getObjectsFlow(handled, bucket = Crashy.S3CrashlogBucket, concurrency = 50)
                    .onEach { (key, body) ->
                        require(body is AnyGetObjectResponse.Success)
                        println("Got object with id $key of ${body.bytes.asByteArrayUnsafe().size} bytes")
                    }
                    .toList()

                println("Got objects, writing to file...")


                for (obj in objects) {
                    s3UnconvertedFilesDir.resolve("${obj.first}.proto")
                        .writeBytes((obj.second as AnyGetObjectResponse.Success).bytes.asByteArrayUnsafe())
                }

                println("Wrote objects")

                progressIndex += objects.size

            }
        }

        fun getIdList() = runBlocking {
            val s3Client = S3AsyncClient.builder().region(Region.EU_CENTRAL_1).build()
            val ids = s3Client.listAllObjectsFlow(Crashy.S3CrashlogBucket)
                .onEach {
                    println("Received ${it.size} objects")
                }
                .toList()
                .flatten()
                .map { it.key() }
            s3KeysFile.writeText(ids.joinToString("\n"))

        }
    }

    fun convertCrashlogs() {
        val files = s3UnconvertedFilesDir.listDirectoryEntries()
        println("Converting logs...")
        for (file in files) {
            val bytes = file.readBytes()
            try {
                val asProto = Crashy.protobuf.decodeFromByteArray(CrashlogEntry.serializer(), bytes)
                println("Copying ${file.fileName} as-is as it is already proto")
                // Got here: already proto
                s3ConvertedFilesDir.resolve(file.fileName).writeBytes(bytes)
            } catch (e: SerializationException) {
                println("${file.fileName} is json, converting...")
                // Got here: not proto but json
                val asJson = Crashy.json.decodeFromString(CrashlogEntry.serializer(), bytes.decodeToString())
                val toProto = Crashy.protobuf.encodeToByteArray(CrashlogEntry.serializer(), asJson)
                s3ConvertedFilesDir.resolve(file.fileName).writeBytes(toProto)
                println("Converted")
            }

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


