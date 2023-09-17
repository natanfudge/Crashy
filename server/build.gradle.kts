import com.aayushatharva.brotli4j.Brotli4jLoader
import com.aayushatharva.brotli4j.encoder.Encoder
import com.github.gradle.node.npm.task.NpmTask
import com.github.jengelman.gradle.plugins.shadow.tasks.ShadowJar
import com.sshtools.client.SessionChannelNG
import com.sshtools.client.SshClient
import com.sshtools.client.scp.ScpClient
import com.sshtools.client.tasks.AbstractCommandTask
import com.sshtools.client.tasks.FileTransferProgress
import org.jetbrains.kotlin.gradle.plugin.mpp.pm20.util.libsDirectory
import java.nio.charset.Charset
import java.nio.file.Files
import kotlin.math.absoluteValue
import kotlin.random.Random

buildscript {
    repositories {
        maven(
            url = ("https://oss.sonatype.org/content/repositories/snapshots")
        )
    }
    dependencies {
        classpath(libs.ssh)
        classpath(libs.brotli)
        classpath("com.aayushatharva.brotli4j:native-windows-x86_64:${libs.versions.brotli.get()}")
    }
}
plugins {
    application
    alias(libs.plugins.kotlin)
    alias(libs.plugins.kotlin.serialization)
    alias(libs.plugins.test.logger)
    alias(libs.plugins.shadow)
    alias(libs.plugins.gradle.node)
    id ("com.dorongold.task-tree") version "2.1.1"
}
val mainClassName = "io.github.crashy.AppKt"

application {
    mainClass.set(mainClassName)
}
group = "io.github.crashy"
version = "1.0.1"
kotlin {
    jvmToolchain(17)
}
tasks.withType<org.jetbrains.kotlin.gradle.tasks.KotlinCompile> {
    kotlinOptions {
        freeCompilerArgs += "-Xcontext-receivers"
    }
}
repositories {
    mavenLocal()
    mavenCentral()
    maven(
        url = ("https://oss.sonatype.org/content/repositories/snapshots")
    )
    maven {
        url = uri("https://maven.pkg.jetbrains.space/public/p/ktor/eap")
    }

}

//TODO: see if we need @mui/lab
val linuxOnly = configurations.create("linux")
val windowsOnly = configurations.create("windows")
val brotliVersion = libs.versions.brotli.get()

val brotliWindowsNatives = "com.aayushatharva.brotli4j:native-windows-x86_64:$brotliVersion"
val objectBoxVersion = "3.5.1"
val objectboxWindowsNatives = "io.objectbox:objectbox-windows:$objectBoxVersion"
val objectboxLinuxNatives = "io.objectbox:objectbox-linux:$objectBoxVersion"
dependencies {
    implementation(libs.bundles.main)
    testImplementation(libs.bundles.test)
    runtimeOnly(brotliWindowsNatives)
    windowsOnly(brotliWindowsNatives)
    windowsOnly(objectboxWindowsNatives)
    // Use the linux natives when packaging because we run the server on a linux EC2 instance
    linuxOnly("com.aayushatharva.brotli4j:native-linux-x86_64:$brotliVersion")
    linuxOnly(objectboxLinuxNatives)
    implementation("io.github.natanfudge:loggy:0.3.1")
}


val clientDir = projectDir.parentFile.resolve("client")
node {
    nodeProjectDir.set(clientDir)
}


tasks {
    val clientBuildDir = clientDir.resolve("dist")
    val clientCompressedDir = Files.createDirectories(clientBuildDir.resolve("compressed").toPath())

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
    val buildClient by registering(NpmTask::class) {
        group = "crashy setup"

        inputs.dir("../client/src")
        inputs.dir("../client/public")
        inputs.files(
            "../client/package.json", "../client/tsconfig.json",
            "../client/vite.config.ts", "../client/tsconfig.node.json"
        )

        outputs.dir(clientBuildDir)

        args.set(listOf("run", "build"))
    }


    val compressClient by registering {
        dependsOn(buildClient)
        group = "crashy setup"
        inputs.dir(clientBuildDir)
        outputs.dir(clientCompressedDir)

        doFirst {
            val source = clientBuildDir.toPath()

            // Delete everything so we won't have old files
            clientCompressedDir.toFile().deleteRecursively()

            Files.walk(source).forEach { path ->
                val fileName = path.fileName.toString()

                if (!Files.isDirectory(path) && !path.startsWith(clientCompressedDir) && !fileName.endsWith(".map")) {
                    val relativePath = source.relativize(path)
                    val compress = fileName.endsWith(".css") || fileName.endsWith(".js")
                    val destPath = clientCompressedDir.resolve("$relativePath${if (compress) ".br" else ""}")
                    val bytes = Files.readAllBytes(path)
                    val compressed = if (compress) Utils.compressFile(bytes) else bytes

                    Files.createDirectories(destPath.parent)
                    Files.write(destPath, compressed)
                }
            }
        }
    }

    val syncClient by registering(Sync::class) {
        group = "crashy setup"
        dependsOn(compressClient)
        from(clientCompressedDir)
        into(sourceSets.main.get().output.resourcesDir!!.resolve("static"))
    }

    withType<ShadowJar> {
        dependsOn(syncClient)
    }

    withType<ProcessResources> {
        mustRunAfter(syncClient)
    }


    withType<ShadowJar> {
        inputs.property("main", mainClassName)
        manifest.attributes(mapOf("Main-Class" to mainClassName))
    }

    fun ShadowJar.configureLinuxJarTask() {
        from(sourceSets.main.get().output)
        // Exclude linux deps
        configurations = shadowJar.get().configurations
        configurations += linuxOnly

        dependencies {
            // Don't include windows natives because we run on linux
            exclude(dependency(brotliWindowsNatives))
            exclude(dependency(objectboxWindowsNatives))
        }

        group = "crashy setup"
    }

    val releaseJar by registering(ShadowJar::class) {
        configureLinuxJarTask()
        archiveClassifier.set("release")
        from("release.txt")
    }

    val betaJar by registering(ShadowJar::class) {
        configureLinuxJarTask()
        archiveClassifier.set("beta")
        from("beta.txt")
    }

    fun windowsLocalJarTask(classifier: String, additionalConfig: ShadowJar.() -> Unit = {}) = registering(ShadowJar::class) {
        archiveClassifier.set(classifier)
        from(sourceSets.main.get().output)

        // Put the different jars in different directories so they won't clash
        destinationDirectory.set(libsDirectory.get().dir(classifier))

        // Exclude linux deps
        configurations = shadowJar.get().configurations.filter { it != linuxOnly }
        // Include windows deps
        configurations += windowsOnly
        group = "crashy setup"
        additionalConfig()
    }


    // Windows jar for testing
    val windowsLocalJar by windowsLocalJarTask("windows-1")

    // Second jar for testing running two servers at once
    val secondWindowsLocalJar by windowsLocalJarTask("windows-2") {
        from("secondLocal.txt")
    }

    afterEvaluate {

        fun registerRunWindowsJar(name: String, jarTask: Provider<ShadowJar>) {
            val windowsShadowJarFiles = jarTask.get().outputs.files
            val windowsShadowJarFile = windowsShadowJarFiles.singleFile

            register<Exec>(name) {
                group = "crashy"
                dependsOn(jarTask)

                workingDir(windowsShadowJarFile.parent)
                commandLine("java", "-jar", windowsShadowJarFile.name)
            }
        }

        registerRunWindowsJar("runJarWindows", windowsLocalJar)
        registerRunWindowsJar("runSecondJarWindows", secondWindowsLocalJar)


        fun Task.configureEc2Upload(release: Boolean) {
            configureEc2Upload(crashyJarTask = if (release) releaseJar.get() else betaJar.get(), release)
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
        register("uploadToEc2Release") {
            configureEc2Upload(release = true)
        }

        register("uploadToEc2Beta") {
            configureEc2Upload(release = false)
        }

        register("stopBetaProcess") {
            group = "crashy"
            val domain = project.property("ec2_domain")
            doFirst {
                Utils.sshToCrashyEc2(domain) {
                    execute("sudo ./crashy_utils/scripts/kill_java.sh beta")
                }
            }
        }

    }

}



fun Task.configureEc2Upload(crashyJarTask: Task, release: Boolean) {
    val shadowJarFiles = crashyJarTask.outputs.files
    val shadowJarFile = shadowJarFiles.singleFile

    group = "crashy"
    dependsOn(crashyJarTask)

    // We put it in a directory with a random id, so it won't clash with the previous one.
    val randomId = Random.nextLong().absoluteValue.toString()
    // SCP doesn't support creating parent directories as needed, so we create the desired directory structure in this computer and copy
    // it wholesale to the ec2 instance.
    val serverDir = shadowJarFile.toPath().parent.resolve(randomId)

    inputs.files(shadowJarFiles)
    outputs.dir(serverDir)

    val domain = project.property("ec2_domain")

    doFirst {
        val jarName = shadowJarFile.name


        val killCommand = "sudo ./crashy_utils/scripts/kill_java.sh $jarName"

        val allJarsDir = "jars/${if (release) "release" else "beta"}"
        val fullJarsDir = "~/$allJarsDir"

        val relativeJarsDir = "./$allJarsDir"
        val removeCommand = "sudo find $relativeJarsDir -type f -not -path \"$relativeJarsDir/$randomId/*\" -delete"
        val cleanDirsCommand = "sudo find $fullJarsDir -empty -type d -delete"
        val jarDir = "$fullJarsDir/$randomId"
        val logFile = "$jarDir/output.txt"
        val javaCommand = "nohup sudo java -jar $jarDir/$jarName >$logFile 2>$logFile <$logFile &"
//        val javaCommand = "nohup sudo java -jar $jarDir/$jarName &"

        // Kill old java process, remove all old files, delete empty directories
        val remoteCleanupCommand = "$killCommand ; $removeCommand && $cleanDirsCommand"


        // Create the server jar directory that will be transferred to the server
        serverDir.toFile().mkdirs()
        shadowJarFile.copyTo(serverDir.resolve(shadowJarFile.name).toFile(), overwrite = true)

        // SSH into ec2
        // stop process
        // delete everything
        // scp new file
        // start process
        Utils.sshToCrashyEc2(domain) {
            scp(from = serverDir, to = fullJarsDir)
            execute(remoteCleanupCommand)
            execute(javaCommand)
        }
    }


}




object Utils {
    fun sshToCrashyEc2(domain: Any?, session: SSHSession.() -> Unit) {
        val keyPair = System.getenv("EC2_KEYPAIR") ?: error("Environment variable EC2_KEYPAIR is not set!")
        if (domain == null) error("Project variable ec2_domain is not set!")
        Utils.ssh(host = domain.toString(), username = "ec2-user", keyPair = File(keyPair), session)
    }

    fun ssh(host: String, username: String, keyPair: File, session: SSHSession.() -> Unit) {
        println("SSHing to $host...")
        SshClient(host, 22, username, keyPair).use {
            println("SSH successful")
            SSHSession(it).apply(session)
        }
    }

    fun compressFile(content: ByteArray): ByteArray {
        if (!Brotli4jLoader.isAvailable()) {
            Brotli4jLoader.ensureAvailability()
        }
        return Encoder.compress(content)
    }
}


class SSHSession(private val ssh: SshClient) {
    fun scp(from: java.nio.file.Path, to: String) {
        println("Uploading ${from.toAbsolutePath()} to $to")
        ScpClient(ssh).put(from.toAbsolutePath().toString(), to, true, object : FileTransferProgress {
            var bytesTotal = 0L
            override fun started(bytesTotal: Long, remoteFile: String?) {
                this.bytesTotal = bytesTotal
            }

            override fun isCancelled(): Boolean {
                return false
            }

            override fun progressed(bytesSoFar: Long) {
                println(
                    "Uploaded $bytesSoFar/$bytesTotal bytes " +
                            if (bytesTotal == 0L) "" else "(${bytesSoFar.toDouble() / bytesTotal * 100}%)"
                )
            }

            override fun completed() {
            }
        })
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