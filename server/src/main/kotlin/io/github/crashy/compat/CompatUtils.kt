package io.github.crashy.compat

import io.github.crashy.crashlogs.storage.LastAccessDay
import java.nio.file.Files.readAttributes
import java.nio.file.Path
import java.nio.file.attribute.BasicFileAttributes
import java.time.Instant
import java.time.ZoneOffset
import java.time.ZonedDateTime
import java.util.*
import kotlin.io.path.readAttributes

object BackwardCompatibility {
    /**
     * We used to use Firebase storage for crashes, and use the firebase generated ID for them. Now we just use UUID.
     */
    fun firestoreIdToUUID(id: String): UUID {
        // Represent each char as 6 bytes, in total we need 120 bytes (UUID can store up to 128 so we're fine)
        require(id.length == 20)
        var firstHalf = 0L
        repeat(10) { i ->
            val indexValue = charMap[id[i]]?.toLong() ?: throw IllegalArgumentException("Illegal firestore ID character: ${id[i]} in id $id")
            firstHalf += indexValue shl (i * 6) // 6 bits for each char, total 64 options
        }
        var secondHalf = 0L
        repeat(10) { i ->
            val indexValue = charMap[id[i + 10]]?.toLong() ?: throw IllegalArgumentException("Illegal firestore ID character: ${id[i + 10]} in id $id")
            secondHalf += indexValue shl (i * 6) // 6 bits for each char, total 64 options
        }
        return UUID(firstHalf, secondHalf)
    }

    /**
     * Originally the last access day of a crash was determined by the file system lastAccessTime attribute, but it turns out it just doesn't work well.
     * Now we store the last access day explicitly in the json.
     */
    fun fileSystemLastAccessDay(file: Path): LastAccessDay {
        return LastAccessDay.fromDate(ZonedDateTime.ofInstant(file.lastAccessInstant(), ZoneOffset.UTC))
    }
}

private fun Path.lastAccessInstant(): Instant = readAttributes<BasicFileAttributes>().lastAccessTime().toInstant()


//               --8--   -4-  -4-  -4-    -- 12 --
// UUID format: cccccccc-cccc-cccc-cccc-cccccccccccc
// c - [0-9][a-f] (total 16)
// 16 ^ 32 = 3.4028237e+38

//                        -- 20 --
// Firestore format: CCCCCCCCCCCCCCCCCCCC
// C - [0-9][a-z][A-Z] (total 62)
// 62 ^ 20 = 7.0442343e+35

// Firestore ID has less available values than UUID, so we can reliably convert any ID to a UUID

private val charMap = mapOf(
    '0' to 0, '1' to 1, '2' to 2, '3' to 3, '4' to 4, '5' to 5, '6' to 6, '7' to 7, '8' to 8,
    '9' to 9, 'a' to 10, 'b' to 11, 'c' to 12, 'd' to 13, 'e' to 14, 'f' to 15, 'g' to 16, 'h' to 17, 'i' to 18,
    'j' to 19, 'k' to 20, 'l' to 21, 'm' to 22, 'n' to 23, 'o' to 24, 'p' to 25, 'q' to 26, 'r' to 27, 's' to 28,
    't' to 29, 'u' to 30, 'v' to 31, 'w' to 32, 'x' to 33, 'y' to 34, 'z' to 35, 'A' to 36, 'B' to 37, 'C' to 38,
    'D' to 39, 'E' to 40, 'F' to 41, 'G' to 42, 'H' to 43, 'I' to 44, 'J' to 45, 'K' to 46, 'L' to 47, 'M' to 48,
    'N' to 49, 'O' to 50, 'P' to 51, 'Q' to 52, 'R' to 53, 'S' to 54, 'T' to 55, 'U' to 56, 'V' to 57, 'W' to 58,
    'X' to 59, 'Y' to 60, 'Z' to 61, '-' to 62
)
