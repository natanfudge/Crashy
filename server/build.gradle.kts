import com.sshtools.client.SessionChannelNG
import com.sshtools.client.SshClient
import com.sshtools.client.scp.ScpClient
import com.sshtools.client.tasks.AbstractCommandTask
import com.sshtools.client.tasks.FileTransferProgress
import java.nio.charset.Charset
import kotlin.math.absoluteValue
import kotlin.random.Random

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
val r8 = configurations.create("r8")

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




    afterEvaluate {

        val shadowJarFiles = shadowJar.get().outputs.files
        val shadowJarFile = shadowJarFiles.singleFile

        register<Exec>("runFatServerJar") {
            group = "server"
            dependsOn(shadowJar)

            workingDir(shadowJarFile.parent)
            commandLine("java", "-jar", shadowJarFile.name)
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

            // We put it in a directory with a random id, so it won't clash with the previous one.
            val randomId = Random.nextLong().absoluteValue.toString()
            // SCP doesn't support creating parent directories as needed, so we create the desired directory structure in this computer and copy
            // it wholesale to the ec2 instance.
            val serverDir = shadowJarFile.toPath().parent.resolve(randomId)

            inputs.files(shadowJarFiles)
            outputs.dir(serverDir)

            val keyPair = System.getenv("EC2_KEYPAIR")
            val domain = project.property("ec2_domain")?.toString()
            val jarName = shadowJarFile.name


            val killCommand = "sudo killall java"

            val allJarsDir = "jars"
            val fullJarsDir = "~/$allJarsDir"

            val relativeJarsDir = "./$allJarsDir"
            val removeCommand = "sudo find $relativeJarsDir -type f -not -path \"$relativeJarsDir/$randomId/*\" -delete"
            val cleanDirsCommand = "sudo find $fullJarsDir -empty -type d -delete"
            val jarDir = "$fullJarsDir/$randomId"
            val logFile = "$jarDir/output.txt"
            val javaCommand = "nohup sudo java -jar $jarDir/$jarName >$logFile 2>$logFile <$logFile &"

            // Kill old java process, remove all old files, delete empty directories
            val remoteCleanupCommand = "$killCommand ; $removeCommand && $cleanDirsCommand"

            doFirst {
                if (keyPair == null) error("Environment variable EC2_KEYPAIR is not set!")
                if (domain == null) error("Project variable ec2_domain is not set!")

                // Create the server jar directory that will be transferred to the server
                serverDir.toFile().mkdirs()
                shadowJarFile.copyTo(serverDir.resolve(shadowJarFile.name).toFile())

                // SSH into ec2
                // stop process
                // delete everything
                // scp new file
                // start process
                ssh(host = domain, username = "ec2-user", keyPair = File(keyPair)) {
                    scp(from = serverDir, to = fullJarsDir)
                    execute(remoteCleanupCommand)
                    execute(javaCommand)
                }
            }

        }
    }

}

fun String.trimNewlines() = replace("\n", "").replace("\r", "")

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
//        ProgressBarBuilder().setTaskName("Upload").setUpdateIntervalMillis(200).build().use { progressBar ->
        ScpClient(ssh).put(from.toAbsolutePath().toString(), to, true, object : FileTransferProgress {
            var bytesTotal = 0L
            override fun started(bytesTotal: Long, remoteFile: String?) {
                this.bytesTotal = bytesTotal
//                    progressBar.maxHint(bytesTotal)
            }

            override fun isCancelled(): Boolean {
                return false
            }

            override fun progressed(bytesSoFar: Long) {
                println(
                    "Uploaded $bytesSoFar/$bytesTotal bytes " +
                            if (bytesTotal == 0L) "" else "(${bytesSoFar.toDouble() / bytesTotal}%)"
                )
//                    progressBar.stepTo(bytesSoFar)
            }

            override fun completed() {
            }
        })
//        }
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