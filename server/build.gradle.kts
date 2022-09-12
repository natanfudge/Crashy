import java.lang.ProcessBuilder.Redirect
import java.io.InputStream
import java.io.PrintStream
import java.lang.Thread
import java.lang.Runnable
import java.util.Scanner
val kotlin_version: String by project
val logback_version: String by project

plugins {
    application
    kotlin("jvm") version "1.7.0-Beta"
    id("org.jetbrains.kotlin.plugin.serialization") version "1.6.20"
    id ("com.adarshr.test-logger") version "3.2.0"
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

dependencies {
    implementation("ch.qos.logback:logback-classic:$logback_version")
    implementation("org.mongodb:mongodb-driver-reactivestreams:4.6.0")
    implementation("org.litote.kmongo:kmongo-coroutine-serialization:4.5.1")
    implementation("org.litote.kmongo:kmongo-id-serialization:4.5.1")
    implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.3.3")

    val awsVersion = "2.17.188"
    implementation(platform("software.amazon.awssdk:bom:$awsVersion"))
    implementation("software.amazon.awssdk:lambda:$awsVersion")
    implementation("com.amazonaws:aws-lambda-java-core:1.2.1")
    implementation("com.amazonaws:aws-lambda-java-events:3.11.0")

    testImplementation("org.jetbrains.kotlin:kotlin-test-junit:$kotlin_version")
    testImplementation("com.squareup.moshi:moshi:1.13.0")
    testImplementation("de.bwaldvogel","mongo-java-server","1.39.0")
    testImplementation("com.squareup.okhttp3:okhttp:5.0.0-alpha.7")
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


    val stackName = project.name.toLowerCase()
    val artifactBucketName = "lambda-artifacts-$stackName"
    val awsDir = file("aws").apply { mkdir() }

    val awsGeneratedDir = awsDir.resolve("generated").apply { mkdir() }
    val processedTemplateFile = awsGeneratedDir.resolve("template.yml")
    val outputTemplateFile = awsGeneratedDir.resolve("out.yml")
    val lambdaFile = jar.get().archiveFile.get()

    val createArtifactBucket = task("createArtifactBucket") {
        group = "aws"

        val bucketMadeMarker = awsDir.resolve(".$artifactBucketName-bucket-made")
        inputs.properties("bucket_name" to artifactBucketName)
        outputs.file(bucketMadeMarker)

        doFirst {
            // Make sure bucket is only made once
            if (!bucketMadeMarker.exists()) {
                runCommand("aws s3 mb s3://$artifactBucketName")
                bucketMadeMarker.writeText("Save this to VCS")
            }
        }
    }


    val packageLibs = task<Zip>("packageLibs") {
        group = "aws"
        from(configurations.runtimeClasspath)
        into("java/lib")
        archiveBaseName.set("${project.name}-libs")
    }
    val libraryZip = packageLibs.archiveFile.get()


    val generateCloudFormationTemplate = register<Copy>("generateCloudFormationTemplate") {
        group = "aws"
        from("template.yml")
        into(awsGeneratedDir)

        expand("lambda_code" to lambdaFile, "library_code" to libraryZip, "project_name" to stackName)
    }

    // Doesn't work very well, I can't stop the process, use sam local start-api -t aws/generated/template.yml
//    task<Exec>("runServerLocally") {
//        group = "aws"
//        dependsOn(packageLibs, jar,generateCloudFormationTemplate)
//        inputs.files(libraryZip, lambdaFile, processedTemplateFile)
//        outputs.upToDateWhen { false }
//
//        commandLine("sam.cmd" ,"local" ,"start-api" ,"-t" ,
//            processedTemplateFile.relativeTo(projectDir).toString().replace("\\","/"))
//    }

    register("prepRunLocal"){
        dependsOn(packageLibs, jar,generateCloudFormationTemplate,)
    }

    register("uploadToAws") {
        group = "aws"
        dependsOn(packageLibs, jar, generateCloudFormationTemplate, createArtifactBucket)

        inputs.files(libraryZip, lambdaFile, processedTemplateFile)
        outputs.upToDateWhen { true }
        doFirst {
            runCommandToStd("aws cloudformation package --template-file $processedTemplateFile" +
                    " --s3-bucket $artifactBucketName --output-template-file $outputTemplateFile")
            runCommandToStd("aws cloudformation deploy --template-file $outputTemplateFile" +
                    " --stack-name $stackName --capabilities CAPABILITY_NAMED_IAM")
        }
    }

    register("giveApiUrl") {
        group = "aws"
        doFirst {
            val apiId = runCommand(
                "aws cloudformation describe-stack-resource --stack-name $stackName" +
                        " --logical-resource-id api --query StackResourceDetail.PhysicalResourceId --output text"
            ).trimNewlines()
            val region = runCommand("aws configure get region").trimNewlines()
            println("https://$apiId.execute-api.$region.amazonaws.com/api/")
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

