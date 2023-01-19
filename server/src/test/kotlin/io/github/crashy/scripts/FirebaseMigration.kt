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
import io.github.crashy.crashlogs.storage.putObjectSuspend
import io.github.crashy.utils.decompressGzip
import io.ktor.util.date.*
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.runBlocking
import kotlinx.coroutines.withContext
import software.amazon.awssdk.regions.Region
import software.amazon.awssdk.services.s3.S3AsyncClient
import strikt.api.expectThat
import strikt.assertions.isNotEqualTo
import java.time.Instant
import kotlin.test.Test


class FirebaseMigration {
    //TODO: myxeNwqvlfrE7SQ9biWx is not parsing
    //TODO: parsing errors should be more clear to the user

    class FirebaseMigrator {
        private var currentCrashIndex by savedInt(0, "Test_FireBaseMigrator_currentCrashIndex2")

        suspend fun migrate() {
            val serviceAccount = FirebaseMigration::class.java
                .getResourceAsStream("/secrets/crashy-9dd87-firebase-adminsdk-xhp2d-50a8861df9.json")

            val options: FirebaseOptions = FirebaseOptions.builder()
                .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                .build()

            FirebaseApp.initializeApp(options)

            val db = FirestoreClient.getFirestore()

            while (true) {
                val future = db.collection("crashes").orderBy("uploadDate").offset(currentCrashIndex).limit(10).get()
                val crashes = withContext(Dispatchers.IO) {
                    future.get()
                }.documents

                if (crashes.isEmpty()) break

                val s3Client = S3AsyncClient.builder().region(Region.EU_CENTRAL_1).build()

                for (crash in crashes) {
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

                    println("Migrating crash log from $uploadDate [${crash.id} -> $crashlogId]")
                    s3Client.putObjectSuspend(Crashy.json.encodeToString(CrashlogEntry.serializer(), entry)) {
                        bucket("crashy-crashlogs")
                        key(crashlogId.s3Key())
                    }
                    println("Migration complete")
                }
                currentCrashIndex += crashes.size
                val firstCrashTime = GMTDate(0,0,0,2,Month.OCTOBER,2021).toJvmDate()
                    .toInstant().toEpochMilli()
                val oldestCrashTimestampOfBatch = crashes.last().data["uploadDate"] as Timestamp
                val batchTime = oldestCrashTimestampOfBatch.toDate().toInstant().toEpochMilli()
                val millisPassedSinceFirstCrash = Instant.now().toEpochMilli() - firstCrashTime
                val millisPassedSinceFirstCrashToBatch = batchTime - firstCrashTime
                val percentDone = millisPassedSinceFirstCrashToBatch.toDouble() / millisPassedSinceFirstCrash
                println("Total migrated: $currentCrashIndex (about ${percentDone * 100}% done)" )
            }


        }
    }
//myxeNwqvlfrE7SQ9biWx
    @Test
    fun migrateFirebase() = runBlocking {
        FirebaseMigrator().migrate()

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


