package io.github.crashy.crashlogs

import com.github.benmanes.caffeine.cache.Cache
import com.github.benmanes.caffeine.cache.Caffeine
import com.github.benmanes.caffeine.cache.Expiry
import java.time.Duration

private val UploadLimitExpirationNano = Duration.ofDays(1).toNanos()
private const val UploadLimit = 1_000_000 // 1 MB

class UploadLimiter {
    private val recentClientUploadAmount: Cache<String, Int> = Caffeine.newBuilder()
        // Expire after 1 day since creating an entry.
        // This technically allows a client to upload just under 2MB in one day, but that's okay. He can't go over that.
        .expireAfter(object : Expiry<String, Int> {
            override fun expireAfterCreate(key: String?, value: Int?, currentTime: Long): Long {
                return UploadLimitExpirationNano
            }

            override fun expireAfterUpdate(key: String?, value: Int?, currentTime: Long, currentDuration: Long): Long {
                return Long.MAX_VALUE
            }

            override fun expireAfterRead(key: String?, value: Int?, currentTime: Long, currentDuration: Long): Long {
                return Long.MAX_VALUE
            }
        }).build()

    /**
     * If client with IP [ip] is allowed to upload [size] bytes, mark that the client has uploaded [size] bytes
     * and return true.
     * If he is not allowed (he went over the limit), return false and do nothing.
     */
    fun requestUpload(ip: String, size: Int): Boolean {
        val uploadedAlready = recentClientUploadAmount.getIfPresent(ip) ?: 0
        val newUploadSize = uploadedAlready + size
        if (newUploadSize > UploadLimit) return false
        else {
            recentClientUploadAmount.put(ip, newUploadSize)
            return true
        }
    }
}