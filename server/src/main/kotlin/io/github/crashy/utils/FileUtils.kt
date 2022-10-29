package io.github.crashy.utils

import java.nio.channels.Channels
import java.nio.file.Files
import java.nio.file.Path




fun Path.readNBytes(bytes: Int): ByteArray = Files.newByteChannel(this).use { sbc ->
    Channels.newInputStream(sbc).use { inputStream ->
        inputStream.readNBytes(bytes)
    }
}