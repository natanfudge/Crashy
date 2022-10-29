import kotlinx.serialization.Serializable

@Serializable
data class UploadCrashResponse(
    val crashId: String,
    val key: String,
    val crashUrl: String
)