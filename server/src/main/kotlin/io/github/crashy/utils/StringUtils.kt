package io.github.crashy.utils

/**
 * Replaces occurrences of first of each element with the second.
 * Assumes every element occurs once and in order that it appears in the list.
 */
fun String.replaceSequentially(replacements: List<Pair<String, String>>): String {
    val result = StringBuilder()
    var currentReplacementIndex = 0
    var currentKey: String? = replacements[currentReplacementIndex].first

    var i = 0
    while (i < length) {
        // If currentKey is null it means we are done with all the replacements
        if (currentKey != null && peekAheadEquals(i, currentKey)) {
            // Found something matching the current replacement, add the replacement and skip forward.
            i += currentKey.length
            result.append(replacements[currentReplacementIndex].second)
            currentReplacementIndex++
            currentKey = replacements.getOrNull(currentReplacementIndex)?.first
        } else {
            // There isn't anything at the current index, just add the next char normally
            result.append(this[i])
            i++
        }
    }

    return result.toString()
}

private fun String.peekAheadEquals(index: Int, substring: String): Boolean {
    var i = index
    val end = index + substring.length
    while (i < end) {
        if (this[i] != substring[i - index]) return false
        i++
    }
    return true
}

