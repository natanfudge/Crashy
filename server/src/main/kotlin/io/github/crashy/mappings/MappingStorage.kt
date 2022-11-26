package io.github.crashy.mappings

import com.github.benmanes.caffeine.cache.Caffeine

class MappingStorage {
    val x = Caffeine.newBuilder().evictionListener { key, value, cause ->

    }
}