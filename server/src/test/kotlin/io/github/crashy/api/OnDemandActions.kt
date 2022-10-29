import HttpTest.Companion.httpTest
import kotlinx.coroutines.runBlocking
import kotlin.io.path.writeText
import kotlin.test.Test

//interface CrashEntry {
//    lastRead: Date
//    uploadDate: Date
//    size: number
//}
//
//type DatabaseOverview = CrashEntry[]


class OnDemandActions : TestClass {
    override val useRealServer: Boolean = true

    @Test
    fun `Download Database Overview`() = runBlocking {
        with(httpTest(local = false)) {
            val response = downloadDatabaseOverview(System.getenv("AdminPassword"))
            databaseOverviewFile.writeText(response.body!!)
        }
    }

    //  Data A: {
    // Graph A: Date -> Size

    @Test
    fun `Analyze Database Overview`() {
        val overview = readDatabaseOverview()
        val totalSize = overview.sumOf { it.size }
        println(totalSize / 1024)
    }

//    @Test
//    fun `Show Database Overview Graphs`() {
//
//    }
}
