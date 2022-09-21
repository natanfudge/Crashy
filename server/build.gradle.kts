import java.lang.ProcessBuilder.Redirect
import java.lang.Thread
import kotlin.math.absoluteValue
import kotlin.random.Random
import java.util.Scanner


plugins {
    application
    kotlin("jvm") version "1.7.0-Beta"
    id("org.jetbrains.kotlin.plugin.serialization") version "1.6.20"
    id ("com.adarshr.test-logger") version "3.2.0"
    id("com.github.johnrengelman.shadow") version "7.0.0"
}

group = "il.co.nocancer"
version = "0.0.2"
java {
    toolchain {
        languageVersion.set(JavaLanguageVersion.of(11))
    }
}
tasks.withType<org.jetbrains.kotlin.gradle.tasks.KotlinCompile> {
    kotlinOptions {
        freeCompilerArgs += "-Xcontext-receivers"
    }
}
repositories {
    mavenCentral()
}

val invoker = configurations.create("invoker")

val ktor_version = "2.1.1"
val kotlin_version = "1.7.0-Beta"
val logback_version = "1.4.1"


dependencies {
    implementation("io.ktor:ktor-server-core-jvm:$ktor_version")
    implementation("io.ktor:ktor-server-auth-jvm:$ktor_version")
    implementation("io.ktor:ktor-server-auto-head-response-jvm:$ktor_version")
    implementation("io.ktor:ktor-server-locations-jvm:$ktor_version")
    implementation("io.ktor:ktor-server-host-common-jvm:$ktor_version")
    implementation("io.ktor:ktor-server-status-pages-jvm:$ktor_version")
    implementation("io.ktor:ktor-server-caching-headers-jvm:$ktor_version")
    implementation("io.ktor:ktor-server-compression-jvm:$ktor_version")
    implementation("io.ktor:ktor-server-conditional-headers-jvm:$ktor_version")
    implementation("io.ktor:ktor-server-content-negotiation-jvm:$ktor_version")
    implementation("io.ktor:ktor-server-cors-jvm:$ktor_version")
    implementation("io.ktor:ktor-server-default-headers-jvm:$ktor_version")
    implementation("io.ktor:ktor-server-http-redirect-jvm:$ktor_version")
    implementation("io.ktor:ktor-server-call-logging-jvm:$ktor_version")
    implementation("io.ktor:ktor-server-metrics-jvm:$ktor_version")
    implementation("io.ktor:ktor-server-metrics-micrometer-jvm:$ktor_version")
    implementation("io.micrometer:micrometer-registry-prometheus:1.9.3")
    implementation("io.ktor:ktor-serialization-kotlinx-json-jvm:$ktor_version")
    implementation("io.ktor:ktor-server-netty-jvm:$ktor_version")
    implementation("ch.qos.logback:logback-classic:$logback_version")
    testImplementation("io.ktor:ktor-server-tests-jvm:$ktor_version")
    testImplementation("org.jetbrains.kotlin:kotlin-test-junit:$kotlin_version")

    implementation("org.reflections:reflections:0.10.2")
}


tasks {


    withType<Test> {
        useJUnit()
    }
    /**
     * Name: Build Client
     *
     * Operation: Invokes the client build system which builds its output into ../client/build
     *
     * Requirement: NPM client project present in ../client
     */
    val buildClient by register<Exec>("buildClient") {
        group = "client"

        inputs.dir("../client/src")
        inputs.dir("../client/public")
        inputs.file("../client/package.json")
        inputs.file("../client/tsconfig.json")

        outputs.dir("../client/build")

        workingDir("../client")
        commandLine("cmd", "/c", "npm run build")
    }


    val syncClient = register<Sync>("syncClientResources") {
        group = "client"
        dependsOn(buildClient)
        from("../client/build")
        into(sourceSets.main.get().output.resourcesDir!!.resolve("static"))
    }

    processResources.get().dependsOn(syncClient)

    shadowJar {
        manifest {
            attributes(Pair("Main-Class", "com.example.ApplicationKt"))
        }
    }

    // SSH into ec2
    // stop process
    // delete everything
    // scp new file
    // start process

    register("testServer"){
        doLast {
//            runCommand("echo starting && ssh -i C:\\Users\\natan\\Desktop\\GoogleDriveBackup\\aws_secret\\AcEC2Pair.pem ec2-user@ec2-18-195-90-15.eu-central-1.compute.amazonaws.com \"nohup sudo java -jar ~/ac/2325446946910435587/AntiCancerServer-0.0.2-all.jar >~/ac/2325446946910435587/output.txt 2>~/ac/2325446946910435587/output.txt <~/ac/2325446946910435587/output.txt &\"")
            runCommand("echo starting && ssh -i C:\\Users\\natan\\Desktop\\GoogleDriveBackup\\aws_secret\\AcEC2Pair.pem ec2-user@ec2-18-195-90-15.eu-central-1.compute.amazonaws.com \"sudo killall java ; sudo find ./ac -type f -not -path \"./ac/5388493444252912057/*\" -delete && sudo find ~/ac -empty -type d -delete && nohup sudo java -jar ~/ac/5388493444252912057/AntiCancerServer-0.0.2-all.jar >~/ac/5388493444252912057/output.txt 2>~/ac/5388493444252912057/output.txt <~/ac/5388493444252912057/output.txt &\"")
        }
    }

    afterEvaluate {

        val uploadToEc2 = register("uploadToEc2") {
            group = "ec2"
            dependsOn(shadowJar)

            val shadowJarFiles = shadowJar.get().outputs.files
            val serverJar = shadowJarFiles.singleFile

            // We put it in a directory with a random id so it won't clash with the previous one.
            val randomId = Random.nextLong().absoluteValue.toString()
            // SCP doesn't support creating parent directories as needed, so we create the desired directory structure in this computer and copy
            // it wholesale to the ec2 instance.
            val serverDir = serverJar.toPath().parent.resolve(randomId)

            inputs.files(shadowJarFiles)
            outputs.dir(serverDir)

            val keyPair = System.getenv("EC2_KEYPAIR")
            val serverJarPath = serverJar.absolutePath
            val domain = "ec2-18-195-90-15.eu-central-1.compute.amazonaws.com"
            val sshTarget = "ec2-user@$domain"
            val serverDirPath = serverDir.toFile().absolutePath
            val jarName = serverJar.name


            val sshCommandPrefix = "ssh -i $keyPair $sshTarget"
            val killCommand = "sudo killall java"

            val acDir = "ac"
            val fullAcDir = "~/$acDir"

            val scpCommand = "scp -r -i $keyPair $serverDirPath $sshTarget:$fullAcDir/"
            val relativeAcDir = "./$acDir"
            val removeCommand = "sudo find $relativeAcDir -type f -not -path \"$relativeAcDir/$randomId/*\" -delete"
            val cleanDirsCommand = "sudo find $fullAcDir -empty -type d -delete"
            val jarDir = "$fullAcDir/$randomId"
            val logFile = "$jarDir/output.txt"
            val javaCommand = "nohup sudo java -jar $jarDir/$jarName >$logFile 2>$logFile <$logFile &"

            // Kill old java process, remove all old files, delete empty directories
            val remoteCleanupCommand = "$killCommand ; $removeCommand && $cleanDirsCommand"

            // Split cleanup command and java -jar command so the task will exit properly
            val sshCommand1 = "$sshCommandPrefix \"$remoteCleanupCommand\""
            val sshCommand2 = "$sshCommandPrefix \"$javaCommand\""

            doFirst {
                println("Uploading server jar $serverJarPath to EC2 instance at $domain with id $randomId...")
                // Create the server jar directory that will be transferred to the server
                serverDir.toFile().mkdirs()
                serverJar.copyTo(serverDir.resolve(serverJar.name).toFile())

                println("Running '$scpCommand'")
                runCommand(scpCommand)
                println("Upload done, Running '$sshCommand1'")
                runCommand( sshCommand1)
                println("Cleanup done, Running '$sshCommand2'")
                runCommand( sshCommand2)
                println("Update successful.")
            }

        }
    }

}

fun String.trimNewlines() = replace("\n", "").replace("\r", "")

fun runCommandToStd(command: String) {
    val proc = ProcessBuilder(*command.split(" ").toTypedArray())
        .inheritIO()
        .redirectOutput(Redirect.PIPE)
        .redirectError(Redirect.PIPE)
        .start()

    inheritIO(proc.inputStream,System.out)
    inheritIO(proc.errorStream,System.err)

    proc.waitFor(60, TimeUnit.MINUTES)
}

fun inheritIO(src: java.io.InputStream, dest: java.io.PrintStream) {
    Thread {
        val sc = Scanner(src)
        while (sc.hasNextLine()) {
            dest.println(sc.nextLine())
        }
    }.start()
}

fun runCommand(command: String): String {
    val parts = command.split("\\s".toRegex())
    val proc = ProcessBuilder(*parts.toTypedArray())
        .redirectOutput(ProcessBuilder.Redirect.PIPE)
        .redirectError(ProcessBuilder.Redirect.PIPE)
        .start()
    proc.waitFor(60, TimeUnit.MINUTES)
    return proc.inputStream.bufferedReader().readText()
}

