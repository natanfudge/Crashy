import com.sshtools.client.SessionChannelNG
import com.sshtools.client.SshClient
import com.sshtools.client.scp.ScpClient
import com.sshtools.client.tasks.AbstractCommandTask
import com.sshtools.client.tasks.FileTransferProgress
import me.tongfei.progressbar.ProgressBarBuilder
import java.nio.charset.Charset
import kotlin.math.absoluteValue
import kotlin.random.Random
import java.nio.file.*

buildscript {
    repositories {
        maven(
            url = ("https://oss.sonatype.org/content/repositories/snapshots")
        )
    }

    dependencies {
        classpath("com.sshtools:maverick-synergy-client:3.0.9")
        classpath("me.tongfei:progressbar:0.9.4")
    }
}
plugins {
    application
    alias(libs.plugins.kotlin)
    alias(libs.plugins.kotlin.serialization)
    alias(libs.plugins.test.logger)
    alias(libs.plugins.shadow)
}
application {
    mainClass.set("io.github.crashy.ApplicationKt")
}
group = "io.github.crashy"
version = "0.0.2"
java {
    toolchain {
        languageVersion.set(JavaLanguageVersion.of(17))
    }
}
tasks.withType<org.jetbrains.kotlin.gradle.tasks.KotlinCompile> {
    kotlinOptions {
        freeCompilerArgs += "-Xcontext-receivers"
    }
}
repositories {
    mavenCentral()
    maven(
        url = ("https://oss.sonatype.org/content/repositories/snapshots")
    )


}

val invoker = configurations.create("invoker")

dependencies {
    implementation(libs.bundles.main)
    implementation(libs.bundles.test)
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


    // SSH into ec2
    // stop process
    // delete everything
    // scp new file
    // start process

    register("testServer") {
        doLast {
//            runCommand("echo starting && ssh -i C:\\Users\\natan\\Desktop\\GoogleDriveBackup\\aws_secret\\AcEC2Pair.pem ec2-user@ec2-18-195-90-15.eu-central-1.compute.amazonaws.com \"nohup sudo java -jar ~/ac/2325446946910435587/AntiCancerServer-0.0.2-all.jar >~/ac/2325446946910435587/output.txt 2>~/ac/2325446946910435587/output.txt <~/ac/2325446946910435587/output.txt &\"")
            runCommand("echo starting && ssh -i C:\\Users\\natan\\Desktop\\GoogleDriveBackup\\aws_secret\\AcEC2Pair.pem ec2-user@ec2-18-195-90-15.eu-central-1.compute.amazonaws.com \"sudo killall java ; sudo find ./ac -type f -not -path \"./ac/5388493444252912057/*\" -delete && sudo find ~/ac -empty -type d -delete && nohup sudo java -jar ~/ac/5388493444252912057/AntiCancerServer-0.0.2-all.jar >~/ac/5388493444252912057/output.txt 2>~/ac/5388493444252912057/output.txt <~/ac/5388493444252912057/output.txt &\"")
        }
    }

    afterEvaluate {

        val shadowJarFiles = shadowJar.get().outputs.files
        val serverJar = shadowJarFiles.singleFile

        register<Exec>("runServerJar") {
            group = "server"
            dependsOn(shadowJar)

            workingDir(serverJar.parent)
            commandLine("java", "-jar", serverJar.name)
        }

        /**
         * Name: Upload to EC2
         *
         * Operation: Replaces the server jar in the EC2 instance with the output of shadowJar.
         *  Specifically, it copies the shadowJar into the EC2 instance using SCP, it then SSHs into the EC2, stops the running java process,
         *  deletes the old jar, and starts the new shadowJar.
         *
         * Requirements:
         * - EC2 instance:
         *  - Configured to accept SSH
         *  - Has java installed
         *  - Has directory ~/jars
         * - Project property **ec2_domain** set to the domain name of the EC2 instance.
         * - Environment variable **EC2_KEYPAIR** set to the fully qualified path to a keypair file that can access the EC2.
         * - Using Shadow.
         */
        val uploadToEc2 = register("uploadToEc2") {
            group = "ec2"
            dependsOn(shadowJar)

            // We put it in a directory with a random id so it won't clash with the previous one.
            val randomId = Random.nextLong().absoluteValue.toString()
            // SCP doesn't support creating parent directories as needed, so we create the desired directory structure in this computer and copy
            // it wholesale to the ec2 instance.
            val serverDir = serverJar.toPath().parent.resolve(randomId)

            inputs.files(shadowJarFiles)
            outputs.dir(serverDir)

            val keyPair = System.getenv("EC2_KEYPAIR")
            val serverJarPath = serverJar.absolutePath
            val domain = project.property("ec2_domain")?.toString()
            val sshTarget = "ec2-user@$domain"
            val serverDirPath = serverDir.toFile().absolutePath
            val jarName = serverJar.name


            val sshCommandPrefix = "ssh -i $keyPair $sshTarget"
            val killCommand = "sudo killall java"

            val allJarsDir = "jars"
            val fullJarsDir = "~/$allJarsDir"

//            val scpCommand = "scp -r -i $keyPair $serverDirPath $sshTarget:$fullJarsDir/"
            val relativeJarsDir = "./$allJarsDir"
            val removeCommand = "sudo find $relativeJarsDir -type f -not -path \"$relativeJarsDir/$randomId/*\" -delete"
            val cleanDirsCommand = "sudo find $fullJarsDir -empty -type d -delete"
            val jarDir = "$fullJarsDir/$randomId"
            val logFile = "$jarDir/output.txt"
            val javaCommand = "nohup sudo java -jar $jarDir/$jarName >$logFile 2>$logFile <$logFile &"

            // Kill old java process, remove all old files, delete empty directories
            val remoteCleanupCommand = "$killCommand ; $removeCommand && $cleanDirsCommand"

            // Split cleanup command and java -jar command so the task will exit properly
//            val sshCommand1 = "$sshCommandPrefix \"$remoteCleanupCommand\""
//            val sshCommand2 = "$sshCommandPrefix \"$javaCommand\""

            doFirst {
                if (keyPair == null) error("Environment variable EC2_KEYPAIR is not set!")
                if (domain == null) error("Project variable ec2_domain is not set!")

                // Create the server jar directory that will be transferred to the server
                serverDir.toFile().mkdirs()
                serverJar.copyTo(serverDir.resolve(serverJar.name).toFile())

                ssh(host = domain, username = "ec2-user", keyPair = File(keyPair)) {
                    scp(from = serverDir, to = fullJarsDir)
                    execute(remoteCleanupCommand)
                    execute(javaCommand)
                }

//                val ssh = SshClient("")
//                ScpClient()

//                runCommandToStd("testscript2.cmd")
//                ByteArrayOutputStream().use { baos ->
////                    runBlocking {
////                        val job = launch {
//                            exec {
//                                commandLine = "scp -r -i C:\\Users\\natan\\Desktop\\GoogleDrivedSynced\\GoogleDriveBackup\\aws_secret\\AcEC2Pair.pem C:\\Users\\natan\\Desktop\\Crashy\\server\\build\\libs\\4872830908762331994 ec2-user@ec2-35-157-64-36.eu-central-1.compute.amazonaws.com:~/ac/".split(" ")
//                                standardOutput = baos
//                            }
////                        }
//
//                    println ("Output:\n$baos")
//
////                        while(job.isActive){
////                            println(baos.toString())
////                            delay(500)
////                        }
////                    }
//
//                }
//                println("done running command")

//                runCommandToStd()

//                println("Uploading server jar $serverJarPath to EC2 instance at $domain with id $randomId...")

//
////                runCommandToStd("amar")
//
//                println("Running '$scpCommand'")
//                runCommandToStd(scpCommand)
//                println("Uploaded server to $fullJarsDir in the EC2 instance, Running '$sshCommand1'")
//                runCommandToStd( sshCommand1)
//                println("Cleanup done, Running '$sshCommand2'")
//                runCommandToStd( sshCommand2)
//                println("Update successful.")
            }

        }
    }

}

fun String.trimNewlines() = replace("\n", "").replace("\r", "")

//fun runCommandToStd(command: String) {
//    println(command)
//    val proc = Runtime.getRuntime().exec(command)
//
//    val inputStream: InputStream = proc.inputStream
//    val inputStreamReader = InputStreamReader(inputStream)
//    val bufferedReader = BufferedReader(inputStreamReader)
//
//    var line: String?
//    while (bufferedReader.readLine().also { line = it } != null) {
//        println(line) // it prints all at once after command has been executed.
//    }
//    proc.waitFor()
//
////    val proc = ProcessBuilder(*command.split(" ").toTypedArray())
////        .inheritIO()
////        .redirectOutput(Redirect.PIPE)
////        .redirectError(Redirect.PIPE)
////        .start()
//
////    inheritIO(proc.inputStream,System.out)
////    inheritIO(proc.errorStream,System.err)
////
////    proc.waitFor(60, TimeUnit.MINUTES)
//}
//
//fun inheritIO(src: java.io.InputStream, dest: java.io.PrintStream) {
//    Thread {
//        val sc = Scanner(src)
//        while (sc.hasNextLine()) {
//            dest.println(sc.nextLine())
//        }
//    }.start()
//}

fun runCommand(command: String): String {
    val parts = command.split("\\s".toRegex())
    val proc = ProcessBuilder(*parts.toTypedArray())
        .redirectOutput(ProcessBuilder.Redirect.PIPE)
        .redirectError(ProcessBuilder.Redirect.PIPE)
        .start()
    proc.waitFor(60, TimeUnit.MINUTES)
    return proc.inputStream.bufferedReader().readText()
}


fun ssh(host: String, username: String, keyPair: File, session: SSHSession.() -> Unit) {
    println("SSHing to $host...")
    SshClient(host, 22, username, keyPair).use {
        println("SSH successful")
        SSHSession(it).apply(session)
    }
}

class SSHSession(private val ssh: SshClient) {
    fun scp(from: java.nio.file.Path, to: String) {
        println("Uploading ${from.toAbsolutePath()} to $to")
        ProgressBarBuilder().setTaskName("Upload").setUpdateIntervalMillis(200).build().use { progressBar ->
            ScpClient(ssh).put(from.toAbsolutePath().toString(), to, true, object : FileTransferProgress {
                override fun started(bytesTotal: Long, remoteFile: String?) {
                    progressBar.maxHint(bytesTotal)
                }

                override fun isCancelled(): Boolean {
                    return false
                }

                override fun progressed(bytesSoFar: Long) {
                    progressBar.stepTo(bytesSoFar)
                }

                override fun completed() {
                }
            })
        }
        println("Upload successful")
    }

    fun execute(command: String) {
        println("Executing $command")
        val task: AbstractCommandTask = object : AbstractCommandTask(ssh.connection, command) {
            override fun onOpenSession(session: SessionChannelNG) {
                val stdOutput = session.inputStream.readAllBytes().toString(Charset.defaultCharset())
                val errOutput = session.stderrStream.readAllBytes().toString(Charset.defaultCharset())
                if (stdOutput.isNotBlank()) {
                    println("SSH: $stdOutput")
                }
                if (errOutput.isNotBlank()) {
                    println("SSH ERR: $errOutput")
                }
            }
        }

        ssh.runTask(task)
    }
}