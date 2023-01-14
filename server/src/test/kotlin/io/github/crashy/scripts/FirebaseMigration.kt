package io.github.crashy.scripts

import aws.sdk.kotlin.services.s3.S3Client
import aws.sdk.kotlin.services.s3.putObject
import aws.smithy.kotlin.runtime.content.ByteStream
import com.google.auth.oauth2.GoogleCredentials
import com.google.cloud.Timestamp
import com.google.cloud.firestore.Blob
import com.google.firebase.FirebaseApp
import com.google.firebase.FirebaseOptions
import com.google.firebase.cloud.FirestoreClient
import io.github.crashy.Crashy
import io.github.crashy.compat.firestoreIdToUUID
import io.github.crashy.crashlogs.*
import io.github.crashy.utils.decompressGzip
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.runBlocking
import kotlinx.coroutines.withContext
import strikt.api.expectThat
import strikt.assertions.isNotEqualTo
import kotlin.test.Test


class FirebaseMigration {
    @Test
    fun migrateFirebase() = runBlocking {
        val serviceAccount =
            FirebaseMigration::class.java.getResourceAsStream("/secrets/crashy-9dd87-firebase-adminsdk-xhp2d-50a8861df9.json")

        val options: FirebaseOptions = FirebaseOptions.builder()
            .setCredentials(GoogleCredentials.fromStream(serviceAccount))
            .build()

        FirebaseApp.initializeApp(options)

        val db = FirestoreClient.getFirestore()

        val future = db.collection("crashes").orderBy("uploadDate").limit(3).get()
        val docs = withContext(Dispatchers.IO) {
            future.get()
        }.documents

        val s3Client = S3Client.fromEnvironment {
            region = "eu-central-1"
        }


        for (doc in docs) {
            val gzipCompressed = doc.data["log"] as Blob
            val deletionKey = doc.data["key"] as String
            val uploadDate = doc.data["uploadDate"] as Timestamp
            val decompressed = gzipCompressed.toBytes().decompressGzip()
            val decompressedLog = UncompressedLog(decompressed)
            val brotliCompressed = CompressedLog.compress(decompressed)
            val header = CrashlogHeader.readFromLog(decompressedLog) ?: kotlin.run {
                println("Failed to run header of crash log with ID ${doc.id}, it will be given a stub header")
                CrashlogHeader(title = "Some Crash", exceptionDescription = "Something wrong happened")
            }
            val metadata = CrashlogMetadata(
                DeletionKey.fromExisting(deletionKey),
                uploadDate = uploadDate.toDate().toInstant(),
                header
            )

            val entry = CrashlogEntry(brotliCompressed, metadata)
            val crashlogId = CrashlogId.parse(doc.id).getOrThrow()

            println("Migrating crash log [${doc.id} -> $crashlogId]")
            s3Client.putObject {
                bucket = "crashy-crashlogs"
                key = crashlogId.s3Key()
                body = ByteStream.fromString(Crashy.json.encodeToString(CrashlogEntry.serializer(), entry))
            }
            println("Migration complete")
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


