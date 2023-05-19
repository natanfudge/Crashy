package io.github.crashy.api

import io.github.crashy.Crashy

object ApiTesting {
    val TestingBuild = when(val value = System.getenv("testTarget")){
        "local".trim() -> Crashy.Build.Local
        "beta" -> Crashy.Build.Beta
        "release" -> Crashy.Build.Release
        else -> error("test-target must be specified as local, beta, or release via -Dtest-target=XXX. Got: $value")
    }
    fun domain() = when(TestingBuild){
        Crashy.Build.Local -> "localhost:80"
        Crashy.Build.Beta -> "crashy.net:4433"
        Crashy.Build.Release -> "crashy.net"
    }

    fun isLocal() = TestingBuild == Crashy.Build.Local

}