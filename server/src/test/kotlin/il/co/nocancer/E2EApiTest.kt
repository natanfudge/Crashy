package il.co.nocancer

import il.co.nocancer.functions.GatheringDataResponse
import il.co.nocancer.functions.json
import il.co.nocancer.model.*
import il.co.nocancer.mongodb.AntiCancerMongo.SecretLocalMongoDbHeaderKey
import il.co.nocancer.mongodb.AntiCancerMongo.TestKey
import il.co.nocancer.util.IdSerializer
import il.co.nocancer.utils.createTestCentre
import il.co.nocancer.utils.createTestGathering
import il.co.nocancer.utils.createTestStore
import kotlinx.coroutines.runBlocking
import kotlinx.coroutines.suspendCancellableCoroutine
import kotlinx.serialization.KSerializer
import kotlinx.serialization.encodeToString
import kotlinx.serialization.serializer
import okhttp3.*
import okhttp3.HttpUrl.Companion.toHttpUrl
import okhttp3.RequestBody.Companion.toRequestBody
import okio.IOException
import org.junit.Ignore
import org.junit.Test
import org.litote.kmongo.Id
import java.time.Duration
import kotlin.coroutines.resume
import kotlin.coroutines.resumeWithException
import kotlin.test.assertEquals

class E2EApiTest {
    private val useLocalApi = false
    private val useLocalDb = useLocalApi
    private val client =
        OkHttpClient.Builder().readTimeout(Duration.ofMinutes(1)).callTimeout(Duration.ofMinutes(1)).build()
    private val url = if (useLocalApi) "http://127.0.0.1:3000" else "https://c59z8zzr15.execute-api.eu-central-1.amazonaws.com/api"

    private var localMongoServerPort: String? = null

    private fun headers() = if (useLocalDb) {
        if (localMongoServerPort == null) {
            localMongoServerPort = EmulatedMongoServer.start().substringAfter(":")
            println("Opened mongo server at $localMongoServerPort")
        }
        Headers.headersOf(SecretLocalMongoDbHeaderKey, localMongoServerPort!!, TestKey, "true")
    } else {
        Headers.headersOf(TestKey, "true")
    }

    @Test
    fun `Test table editing flow`(): Unit = runBlocking {
        val centre1 = createTestCentre()
        val centre2 = createTestCentre()
        val store1 = createTestStore(centre1.name)
        val store2 = createTestStore(centre1.name)
        val store3 = createTestStore(centre2.name)

        val gathering1 = createTestGathering(store1)
        val gathering2 = createTestGathering(store2)
        val gathering3 = createTestGathering(store3)
        val gathering4 = createTestGathering(store3)
        val gathering5 = createTestGathering(store3)

        with(client) {
            val cid1 = put(centre1)
            val cid2 = put(centre2)
            val sid1 = put(store1)
            val sid2 = put(store2)
            val sid3 = put(store3)
            val gid1 = put(gathering1)
            val gid2 = put(gathering2)
            val gid3 = put(gathering3)
            val gid4 = put(gathering4)
            val gid5 = put(gathering5)

            val expectedData = GatheringDataResponse(
                listOf(gathering1, gathering2, gathering3, gathering4, gathering5),
                listOf(store1, store2, store3),
                listOf(centre1, centre2)
            )

            assertEquals(expectedData, getData())

            deleteCentre(cid1)

            val expectedData2 = GatheringDataResponse(
                listOf(gathering1, gathering2, gathering3, gathering4, gathering5),
                listOf(store1, store2, store3),
                listOf(centre2)
            )

            assertEquals(expectedData2, getData())

            deleteStore(sid1)
            deleteStore(sid3)

            deleteGathering(gid2)
            deleteGathering(gid4)


            val expectedData3 = GatheringDataResponse(
                listOf(gathering1, gathering3, gathering5),
                listOf(store2),
                listOf(centre2)
            )

            assertEquals(expectedData3, getData())

            deleteCentre(cid2)

            deleteStore(sid2)

            deleteGathering(gid1)
            deleteGathering(gid3)
            deleteGathering(gid5)

            assertEquals(GatheringDataResponse(listOf(), listOf(), listOf()), getData())
        }

        EmulatedMongoServer.shutdown()
    }

    @Test
    @Ignore
    fun `Test Gathering Data`() = runBlocking {
        val response = getData()
        println(response)
    }


    @Test
    @Ignore
    fun `Test Put`() = runBlocking {
        val response1 = client.put<DonationGathering, Id<DonationGathering>>(
            "$url/put/gathering", createTestGathering(),
            headers(), IdSerializer(false)
        )
        val response2 = client.put<Store, Id<Store>>(
            "$url/put/store",
            Store(
                centreName = CentreName("great centre"),
                name = StoreName("shit store"),
                phoneNumber = PhoneNumber(8492013310)
            ), headers(), IdSerializer(false)
        )
        val response3 = client.put<Centre, Id<Centre>>(
            "$url/put/centre",
            testCentre(), headers(), IdSerializer(false)
        )
        println(response1)
        println(response2)
        println(response3)
    }

    private suspend fun getData(): GatheringDataResponse = client.get("$url/data", headers())
    private suspend fun OkHttpClient.deleteCentre(id: Id<Centre>) = get<Boolean>("$url/delete/centre?id=$id", headers())
    private suspend fun OkHttpClient.deleteStore(id: Id<Store>) = get<Boolean>("$url/delete/store?id=$id", headers())
    private suspend fun OkHttpClient.deleteGathering(id: Id<DonationGathering>) = get<Boolean>("$url/delete/gathering?id=$id", headers())

    private suspend fun OkHttpClient.put(centre: Centre) =
        put<Centre, Id<Centre>>("$url/put/centre", centre, headers(), IdSerializer(false))

    private suspend fun OkHttpClient.put(store: Store) = put<Store, Id<Store>>("$url/put/store", store, headers(), IdSerializer(false))
    private suspend fun OkHttpClient.put(gathering: DonationGathering) =
        put<DonationGathering, Id<DonationGathering>>("$url/put/gathering", gathering, headers(), IdSerializer(false))

}


fun testCentre() = Centre(name = CentreName("booogie"), location = Location("greatest place ever"))

private suspend inline fun <reified T> OkHttpClient.get(url: String, headers: Headers): T {
    return put(url, body = null, headers, serializer())
}

private suspend inline fun <reified Req, reified Res> OkHttpClient.put(
    url: String, body: Req?,
    headers: Headers, resSerializer: KSerializer<Res>
): Res {
    return put(url, json.encodeToString(body), headers, resSerializer)
}

private suspend inline fun <reified Res> OkHttpClient.put(
    url: String, body: String,
    headers: Headers, resSerializer: KSerializer<Res>
): Res {
    return put(url, body.toRequestBody(), headers, resSerializer)
}

private suspend inline fun <reified T> OkHttpClient.put(
    url: String, body: RequestBody?,
    headers: Headers, resSerializer: KSerializer<T>
): T {
    val string = request(Request(url = url.toHttpUrl(), body = body, headers = headers)).body.string()
    return json.decodeFromString(resSerializer, string)
}


private suspend fun OkHttpClient.request(request: Request) = suspendCancellableCoroutine<Response> {
    this.newCall(request).enqueue(object : Callback {
        override fun onFailure(call: Call, e: IOException) {
            it.resumeWithException(e)
        }

        override fun onResponse(call: Call, response: Response) {
            it.resume(response)
        }

    })
}