package io.github.crashy.api

import io.github.crashy.Crashy

object ApiTesting {
    val TestingBuild = Crashy.Build.Beta
    fun domain() = when(TestingBuild){
        Crashy.Build.Local -> "localhost:80"
        Crashy.Build.Beta -> "crashy.net:4433"
        Crashy.Build.Release -> "crashy.net"
    }

    fun isLocal() = TestingBuild == Crashy.Build.Local

}