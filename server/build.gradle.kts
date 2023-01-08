import com.github.gradle.node.npm.task.NpmTask
import com.github.jengelman.gradle.plugins.shadow.tasks.ShadowJar
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
    }
}
plugins {
    application
    alias(libs.plugins.kotlin)
    alias(libs.plugins.kotlin.serialization)
    alias(libs.plugins.test.logger)
    alias(libs.plugins.shadow)
    alias(libs.plugins.gradle.node)

}

val mainClassName = "io.github.crashy.AppKt"

application {
    mainClass.set(mainClassName)
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
    maven {
        url = uri("https://maven.pkg.jetbrains.space/public/p/ktor/eap")
    }

}

val linuxOnly = configurations.create("linux")
val windowsOnly = configurations.create("windows")
val brotliVersion = libs.versions.brotli.get()

val brotliWindowsNatives = "com.aayushatharva.brotli4j:native-windows-x86_64:$brotliVersion"
dependencies {
    implementation(libs.bundles.main)
    implementation(libs.bundles.test)
    implementation("io.ktor:ktor-server-http-redirect:${libs.versions.ktor.get()}")
    implementation("org.fusesource.jansi:jansi:2.4.0")
    implementation("io.ktor:ktor-server-auth:${libs.versions.ktor.get()}")
    implementation("io.ktor:ktor-server-html-builder:${libs.versions.ktor.get()}")
    runtimeOnly(brotliWindowsNatives)
    windowsOnly(brotliWindowsNatives)
//    implementation("net.fabricmc:mapping-io:0.3.0")
    // Use the linux natives when packaging because we run the server on a linux EC2 instance
    linuxOnly("com.aayushatharva.brotli4j:native-linux-x86_64:$brotliVersion")
}


val clientDir = projectDir.parentFile.resolve("client")
node {
    nodeProjectDir.set(clientDir)
}


tasks {

    withType<Test> {
        useJUnit()
        jvmArgs("-Dfile.encoding=UTF-8")
    }
    /**
     * Name: Build Client
     *
     * Operation: Invokes the client build system which builds its output into ../client/build
     *
     * Requirement: NPM client project present in ../client
     */
    val buildClient by register<NpmTask>("buildClient") {
        group = "crashy setup"

//        dependsOn(npmInstall)

        inputs.dir("../client/src")
        inputs.dir("../client/public")
        inputs.file("../client/package.json")
        inputs.file("../client/tsconfig.json")

        outputs.dir("../client/build")

        args.set(listOf("run", "build"))
//        workingDir("../client")
//        commandLine("npm", "run", "build")
    }

    val resourcesDir = sourceSets.main.get().output.resourcesDir!!


    val syncClient = register<Sync>("syncClientResources") {
        group = "crashy setup"
        dependsOn(buildClient)
        from("../client/build")
        into(sourceSets.main.get().output.resourcesDir!!.resolve("static"))
    }

    processResources.get().dependsOn(syncClient)

    withType<ShadowJar> {
        inputs.property("main", mainClassName)
        manifest.attributes(mapOf("Main-Class" to mainClassName))
    }

    // Linux jar for EC2
    named<ShadowJar>("shadowJar") {
        configurations += linuxOnly
        dependencies {
            // Don't include windows natives because we run on linux
            exclude(dependency(brotliWindowsNatives))
        }

        from("build.txt")
    }

    // Windows jar for testing
    val windowsServerJar by registering(ShadowJar::class) {
        archiveClassifier.set("windows")
        from(sourceSets.main.get().output)
        // Exclude linux deps
        configurations = shadowJar.get().configurations.filter { it != linuxOnly }
        // Include windows deps
        configurations += windowsOnly
        group = "crashy setup"
    }

    afterEvaluate {

        val windowsShadowJarFiles = windowsServerJar.get().outputs.files
        val windowsShadowJarFile = windowsShadowJarFiles.singleFile

        register<Exec>("runWindowsServerJar") {
            group = "crashy"
            dependsOn(windowsServerJar)

            workingDir(windowsShadowJarFile.parent)
            commandLine("java", "-jar", windowsShadowJarFile.name)
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
            val shadowJarFiles = shadowJar.get().outputs.files
            val shadowJarFile = shadowJarFiles.singleFile

            group = "crashy"
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
                shadowJarFile.copyTo(serverDir.resolve(shadowJarFile.name).toFile(), overwrite = true)

                // SSH into ec2
                // stop process
                // delete everything
                // scp new file
                // start process
                Utils.ssh(host = domain, username = "ec2-user", keyPair = File(keyPair)) {
                    scp(from = serverDir, to = fullJarsDir)
                    execute(remoteCleanupCommand)
                    execute(javaCommand)
                }
            }

        }
    }

}

object Utils {
    fun ssh(host: String, username: String, keyPair: File, session: SSHSession.() -> Unit) {
        println("SSHing to $host...")
        SshClient(host, 22, username, keyPair).use {
            println("SSH successful")
            SSHSession(it).apply(session)
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
                            if (bytesTotal == 0L) "" else "(${bytesSoFar.toDouble() / bytesTotal * 100}%)"
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