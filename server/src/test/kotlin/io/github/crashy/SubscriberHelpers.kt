/*
 * Copyright 2015 MongoDB, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package io.github.crashy

import com.mongodb.MongoTimeoutException
import org.bson.Document
import org.reactivestreams.Subscriber
import org.reactivestreams.Subscription
import java.util.concurrent.CountDownLatch
import java.util.concurrent.TimeUnit

/**
 * Subscriber helper implementations for the Quick Tour.
 */
class SubscriberHelpers private constructor() {
    /**
     * A Subscriber that stores the publishers results and provides a latch so can block on completion.
     *
     * @param <T> The publishers result type
    </T> */
    open class ObservableSubscriber<T> internal constructor() : Subscriber<T> {
        private val received: MutableList<T>
        private val errors: MutableList<Throwable>
        private val latch: CountDownLatch

        @Volatile
        var subscription: Subscription? = null
            private set

        @Volatile
        var isCompleted = false
            private set

        init {
            received = ArrayList()
            errors = ArrayList()
            latch = CountDownLatch(1)
        }

        override fun onSubscribe(s: Subscription) {
            subscription = s
        }

        override fun onNext(t: T) {
            received.add(t)
        }

        override fun onError(t: Throwable) {
            errors.add(t)
            onComplete()
        }

        override fun onComplete() {
            isCompleted = true
            latch.countDown()
        }

        fun getReceived(): List<T> {
            return received
        }

        val error: Throwable?
            get() = if (errors.size > 0) {
                errors[0]
            } else null

        @Throws(Throwable::class)
        operator fun get(timeout: Long, unit: TimeUnit?): List<T> {
            return await(timeout, unit).getReceived()
        }

        @JvmOverloads
        @Throws(Throwable::class)
        fun await(timeout: Long = Long.MAX_VALUE, unit: TimeUnit? = TimeUnit.MILLISECONDS): ObservableSubscriber<T> {
            subscription!!.request(Int.MAX_VALUE.toLong())
            if (!latch.await(timeout, unit)) {
                throw MongoTimeoutException("Publisher onComplete timed out")
            }
            if (!errors.isEmpty()) {
                throw errors[0]
            }
            return this
        }
    }

    /**
     * A Subscriber that immediately requests Integer.MAX_VALUE onSubscribe
     *
     * @param <T> The publishers result type
    </T> */
    open class OperationSubscriber<T> : ObservableSubscriber<T>() {
        override fun onSubscribe(s: Subscription) {
            super.onSubscribe(s)
            s.request(Int.MAX_VALUE.toLong())
        }
    }

    /**
     * A Subscriber that prints a message including the received items on completion
     *
     * @param <T> The publishers result type
    </T> */
    class PrintSubscriber<T>
    /**
     * A Subscriber that outputs a message onComplete.
     *
     * @param message the message to output onComplete
     */(private val message: String) : OperationSubscriber<T>() {
        override fun onComplete() {
            println(String.format(message, getReceived()))
            super.onComplete()
        }
    }

    /**
     * A Subscriber that prints the json version of each document
     */
    class PrintDocumentSubscriber : OperationSubscriber<Document>() {
        override fun onNext(t: Document) {
            super.onNext(t)
            println(t.toJson())
        }
    }
}