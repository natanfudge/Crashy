package io.github.crashy.api.utils

import io.github.crashy.Crashy
import kotlin.io.path.createDirectories
import kotlin.io.path.exists
import kotlin.io.path.readText
import kotlin.io.path.writeText
import kotlin.properties.ReadWriteProperty
import kotlin.reflect.KProperty

class SavedValue<T>(initialValue: () -> T, uniqueName: String, constructor: (String) -> T) :
    ReadWriteProperty<Any?, T> {
    private val file = Crashy.HomeDir.resolve("savedValues").resolve("$uniqueName.txt")
        .also { it.parent.createDirectories() }
    private var value = if (file.exists()) constructor(file.readText()) else initialValue()
    override fun getValue(thisRef: Any?, property: KProperty<*>): T {
        return value
    }

    override fun setValue(thisRef: Any?, property: KProperty<*>, value: T) {
        this.value = value
        file.writeText(value.toString())
    }
}

/**
 * Writes the value to disk whenever it is changed
 */
fun savedInt(initial: Int, uniqueName: String) = SavedValue({ initial }, uniqueName) { it.toInt() }