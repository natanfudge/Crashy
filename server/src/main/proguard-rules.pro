-keepattributes SourceFile, LineNumberTable
-dontobfuscate
-dontoptimize
-dontwarn **


# Our own app
-keep class io.github.crashy.ApplicationKt {
	public static void main(java.lang.String[]);
}

# Netty uses a bunch of reflection here
-keep class io.netty.util.internal.shaded.org.jctools.queues.*{
    private <fields>;
}
# Netty uses a bunch of reflection here
-keep class io.netty.channel.socket.nio.NioServerSocketChannel {
    public <init>();
}

-keepclassmembers class kotlinx.** {
    volatile <fields>;
}

-keep class ** {*;}
# Not needed
#-keep class io.** { *; }
# Not needed
#-keep class com.** { *; }

#-keep class kotlinx.** {*;}
#-keep class kotlin.** {*;}
#-keep class org.** {*;}

#-keep class ch.** {*;}
#-keep class javassist.** {*;}

#'io.ktor.server.netty.EngineMain',
 #            'kotlin.reflect.jvm.internal.**',
 #            'io.ktor.samples.hello.HelloApplicationKt',
 #            'kotlin.text.RegexOption'

# Required ktor classes
-keep class io.ktor.server.netty.EngineMain {
    public <methods>;
    private <methods>;
}
-keep class kotlin.reflect.jvm.internal.** {
    public <methods>;
    private <methods>;
}
-keep class kotlin.text.RegexOption {
    public <methods>;
    private <methods>;
}
-keep class org.fusesource.jansi.** {
    public *;
 }

# Ignore a bunch of unused server stuff that ktor references
-dontwarn reactor.blockhound.integration.BlockHoundIntegration
-dontwarn jakarta.servlet.ServletContainerInitializer
-dontwarn io.netty.internal.tcnative.*
-dontwarn org.apache.log4j.*
-dontwarn org.apache.logging.**
-dontwarn org.codehaus.janino.**
-dontwarn org.conscrypt.**
-dontwarn org.eclipse.jetty.**
-dontwarn org.jboss.**
-dontwarn org.jetbrains.annotations.Async**