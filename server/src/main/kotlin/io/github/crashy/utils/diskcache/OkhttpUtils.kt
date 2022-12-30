//package io.github.crashy.utils.diskcache
//
///*
// * Copyright (C) 2012 The Android Open Source Project
// *
// * Licensed under the Apache License, Version 2.0 (the "License");
// * you may not use this file except in compliance with the License.
// * You may obtain a copy of the License at
// *
// *      http://www.apache.org/licenses/LICENSE-2.0
// *
// * Unless required by applicable law or agreed to in writing, software
// * distributed under the License is distributed on an "AS IS" BASIS,
// * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// * See the License for the specific language governing permissions and
// * limitations under the License.
// */
//
//import okhttp3.OkHttpClient
//import okio.*
//import java.util.*
//
//
//@JvmField
//internal val assertionsEnabled: Boolean = OkHttpClient::class.java.desiredAssertionStatus()
//
///**
// * Returns the string "OkHttp" unless the library has been shaded for inclusion in another library,
// * or obfuscated with tools like R8 or ProGuard. In such cases it'll return a longer string like
// * "com.example.shaded.okhttp3.OkHttp". In large applications it's possible to have multiple OkHttp
// * instances; this makes it clear which is which.
// */
//@JvmField
//internal val okHttpName: String =
//    OkHttpClient::class.java.name.removePrefix("okhttp3.").removeSuffix("Client")
//
//@Suppress("NOTHING_TO_INLINE")
//internal inline fun Any.assertThreadHoldsLock() {
//    if (assertionsEnabled && !Thread.holdsLock(this)) {
//        throw AssertionError("Thread ${Thread.currentThread().name} MUST hold lock on $this")
//    }
//}
//
//
///** Tolerant delete, try to clear as many files as possible even after a failure. */
//internal fun FileSystem.deleteContents(directory: Path) {
//    var exception: IOException? = null
//    val files = try {
//        list(directory)
//    } catch (fnfe: FileNotFoundException) {
//        return
//    }
//    for (file in files) {
//        try {
//            if (metadata(file).isDirectory) {
//                deleteContents(file)
//            }
//
//            delete(file)
//        } catch (ioe: IOException) {
//            if (exception == null) {
//                exception = ioe
//            }
//        }
//    }
//    if (exception != null) {
//        throw exception
//    }
//}
//
///**
// * Returns true if file streams can be manipulated independently of their paths. This is typically
// * true for systems like Mac, Unix, and Linux that use inodes in their file system interface. It is
// * typically false on Windows.
// *
// * If this returns false we won't permit simultaneous reads and writes. When writes commit we need
// * to delete the previous snapshots, and that won't succeed if the file is open. (We do permit
// * multiple simultaneous reads.)
// *
// * @param file a file in the directory to check. This file shouldn't already exist!
// */
//internal fun FileSystem.isCivilized(file: Path): Boolean {
//    sink(file).use {
//        try {
//            delete(file)
//            return true
//        } catch (_: java.io.IOException) {
//        }
//    }
//    delete(file)
//    return false
//}
//
///** Delete file we expect but don't require to exist. */
//internal fun FileSystem.deleteIfExists(path: Path) {
//    try {
//        delete(path)
//    } catch (fnfe: FileNotFoundException) {
//        return
//    }
//}
//
//
//
