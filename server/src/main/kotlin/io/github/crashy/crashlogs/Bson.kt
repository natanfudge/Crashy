//package io.github.crashy.crashlogs
//
//import org.bson.BsonBinary
//import org.bson.BsonDocument
//import org.bson.BsonInt64
//import org.bson.BsonString
//import java.time.Instant
//
//
//fun CrashlogEntry.toBson(): BsonDocument = BsonDocument().also {
////    it[crashlogEntryCompressedLogField] = BsonBinary(compressedLog.bytes)
//    it[crashlogEntryMetadataField] = metadata.toBson()
//}
//
//private fun CrashlogMetadata.toBson(): BsonDocument = BsonDocument().also {
//    it[crashlogMetadataDeletionKeyField] = BsonString(deletionKey.toString())
//    it[crashlogMetadataUploadDateField] = BsonInt64(uploadDate.toEpochMilli())
//    it[crashlogMetadataHeaderField] = header.toBson()
//}
//
////class CrashlogEntry(val compressedLog: CompressedLog, val metadata: CrashlogMetadata) {
//
//
//private fun CrashlogHeader.toBson(): BsonDocument = BsonDocument().also {
//    it[crashlogHeaderTitleField] = BsonString(title)
//    it[crashlogHeaderExceptionDescriptionField] = BsonString(exceptionDescription)
//}
//
//
//fun CrashlogEntry.Companion.fromBson(bsonDocument: BsonDocument): CrashlogEntry {
//    return CrashlogEntry(
//        CompressedLog.fromBson(bsonDocument.getBinary(crashlogEntryCompressedLogField)),
//        CrashlogMetadata.fromBson(bsonDocument.getDocument(crashlogEntryMetadataField))
//    )
//}
//
//private fun CrashlogMetadata.Companion.fromBson(bson: BsonDocument): CrashlogMetadata {
//    return CrashlogMetadata(
//        DeletionKey.fromExisting(bson.string(crashlogMetadataDeletionKeyField)),
//        Instant.ofEpochMilli(bson.getInt64(crashlogMetadataUploadDateField).value),
//        CrashlogHeader.fromBson(bson.getDocument(crashlogMetadataHeaderField))
//    )
//}
//
//private fun CrashlogHeader.Companion.fromBson(bson: BsonDocument): CrashlogHeader {
//    return CrashlogHeader(bson.string(crashlogHeaderTitleField), bson.string(crashlogHeaderExceptionDescriptionField))
//}
//
//private fun BsonDocument.string(key: String) = getString(key).value
//
//private val crashlogHeaderTitleField = CrashlogHeader::title.name
//private val crashlogHeaderExceptionDescriptionField = CrashlogHeader::exceptionDescription.name
//
//private val crashlogMetadataDeletionKeyField = CrashlogMetadata::deletionKey.name
//private val crashlogMetadataUploadDateField = CrashlogMetadata::uploadDate.name
//private val crashlogMetadataHeaderField = CrashlogMetadata::header.name
//
//private val crashlogEntryCompressedLogField = CrashlogEntry::compressedLog.name
//private val crashlogEntryMetadataField = CrashlogEntry::metadata.name
//
////class CrashlogEntry(val compressedLog: CompressedLog, val metadata: CrashlogMetadata