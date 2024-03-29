package io.github.crashy.crashlogs

import io.github.crashy.utils.getResource

object Blacklist {
    private val items = getResource("/secrets/blacklist.txt")!!.split("\n").map { it.trim() }.toHashSet()
    fun isBlacklisted(ip: String): Boolean {
        return ip in items
    }
}