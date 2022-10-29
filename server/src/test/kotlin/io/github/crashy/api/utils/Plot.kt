//@file:UseSerializers(ZonedDateTimeSerializer::class)
//
//import jetbrains.letsPlot.intern.GeomKind
//import kotlinx.serialization.KSerializer
//import kotlinx.serialization.Serializable
//import kotlinx.serialization.UseSerializers
//import kotlinx.serialization.builtins.ListSerializer
//import kotlinx.serialization.descriptors.PrimitiveKind
//import kotlinx.serialization.descriptors.PrimitiveSerialDescriptor
//import kotlinx.serialization.encoding.Decoder
//import kotlinx.serialization.encoding.Encoder
//import kotlinx.serialization.json.Json
//import java.nio.file.Path
//import java.nio.file.Paths
//import java.time.ZoneId
//import java.time.ZonedDateTime
//import java.time.temporal.ChronoUnit
//import kotlin.io.path.readText
//
//fun readDatabaseOverview(): DatabaseOverview {
//    val rawOverview = databaseOverviewFile.readText()
//    return Json.decodeFromString(ListSerializer(CrashEntry.serializer()), rawOverview)
//}
//
//@Serializable
//data class CrashEntry(val lastRead: ZonedDateTime, val uploadDate: ZonedDateTime, val size: Int)
//object ZonedDateTimeSerializer : KSerializer<ZonedDateTime> {
//    override val descriptor = PrimitiveSerialDescriptor("ZonedDateTime", PrimitiveKind.STRING)
//    override fun serialize(encoder: Encoder, value: ZonedDateTime) {
//        encoder.encodeString(value.toString())
//    }
//
//    override fun deserialize(decoder: Decoder): ZonedDateTime {
//        return ZonedDateTime.parse(decoder.decodeString())
//    }
//}
//typealias DatabaseOverview = List<CrashEntry>
//
//val databaseOverviewFile: Path = Paths.get("databaseOverview.json")
//
//private fun DatabaseOverview.countOld(oldDays: Int) =
//    filter { it.uploadDate.isBefore(ZonedDateTime.now().minusDays(oldDays.toLong())) }.size
//
//private fun DatabaseOverview.countInactive(days: Int) =
//    filter { it.lastRead.isBefore(ZonedDateTime.now().minusDays(days.toLong())) }.size
//
//private fun DatabaseOverview.getBefore(time: ZonedDateTime) =
//    filter { it.uploadDate.isBefore(time) }
//
//private fun daysBetween(start: ZonedDateTime, end: ZonedDateTime): Map<Int, ZonedDateTime> {
//    val daysDiff = ChronoUnit.DAYS.between(start, end)
//    return List(daysDiff.toInt()) { it to start.plusDays(it.toLong()) }.toMap()
//}
//
//fun main() {
//    val overview = readDatabaseOverview()
//
//    val sizePoints = buildPlot("Index", "Size", overview.mapIndexed { i, point -> i to point.size }, GeomKind.POINT)
//    val sizeDist = buildOneDimPlot("Index", overview.map { it.size }, GeomKind.DENSITY)
//    val timePoints = List(40) { it }
//    val age = buildPlot("Age", "Count", "Measurement") {
//        layer(GeomKind.AREA, "Upload Date", timePoints.map { it to overview.countOld(it) })
//        layer(GeomKind.AREA, "Last-Read Date", timePoints.map { it to overview.countInactive(it) })
//    }
//
//    val startDate = ZonedDateTime.of(2021, 10, 1, 0, 0, 0, 0, ZoneId.systemDefault())
//    val daysMeasured = daysBetween(startDate, ZonedDateTime.now())
//    val dataStored = buildPlot("Days From Start", "bytes", daysMeasured.map {(day, date) ->
//        day to overview.getBefore(date).sumOf { it.size }
//    }, GeomKind.AREA)
//
//    val plots = mapOf(
//        "Bytes Stored" to dataStored,
//        "Size Points" to sizePoints,
//        "Size Distribution" to sizeDist,
//        "Age" to age,
//    )
//
//    val maxSize = overview.maxOf { it.size }
//    val minSize = overview.minOf { it.size }
//    val averageSize = overview.sumOf { it.size } / overview.size
//    val medianSize = overview.sortedBy { it.size }[overview.size / 2].size
//    val totalSize = overview.sumOf { it.size }
//
//    println("Max size: $maxSize")
//    println("Min size: $minSize")
//    println("Average size: $averageSize")
//    println("Median size: $medianSize")
//    println("Total size: $totalSize")
//
//    val old = overview.filter {
//        it.uploadDate.isBefore(ZonedDateTime.now().minusMonths(1))
//    }.size
//
//    val inactive = overview.filter {
//        it.lastRead.isBefore(ZonedDateTime.now().minusMonths(1))
//    }.size
//
//    println("Old: $old")
//    println("Inactive: $inactive")
//
////    usePlots(plots)
//    usePlots(plots)
//}