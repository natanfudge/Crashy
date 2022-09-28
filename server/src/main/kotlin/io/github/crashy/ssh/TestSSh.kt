//package io.github.crashy
//
//import com.sshtools.client.SessionChannelNG
//import com.sshtools.client.SshClient
//import com.sshtools.client.scp.ScpClient
//import com.sshtools.client.tasks.AbstractCommandTask
//import com.sshtools.client.tasks.FileTransferProgress
//import me.tongfei.progressbar.ProgressBarBuilder
//import java.io.File
//import java.io.IOException
//import java.nio.charset.Charset
//import java.util.*
//
//////
//// commandLine =
//// "scp -r -i C:\\Users\\natan\\Desktop\\GoogleDrivedSynced\\GoogleDriveBackup\\aws_secret\\AcEC2Pair.pem
//// C:\\Users\\natan\\Desktop\\Crashy\\server\\build\\libs\\4872830908762331994 ec2-user@ec2-35-157-64-36.eu-central-1.compute.amazonaws.com:~/ac/".split(" ")
//fun main() {
//    //TODO:
//    // Goals:
//    // - Show all host machine CMD output and errors at real time
//    // - Improve speed
//
//
//    val keyPair = File("C:\\Users\\natan\\Desktop\\GoogleDrivedSynced\\GoogleDriveBackup\\aws_secret\\AcEC2Pair.pem")
//    val dns = "ec2-35-157-64-36.eu-central-1.compute.amazonaws.com"
//    val file = File("C:\\Users\\natan\\Desktop\\Crashy\\server\\build\\libs\\4872830908762331994")
//    require(file.exists())
////    ScpClient()
////    ssh(dns, "ec2-user", keyPair) {
////        execute("amar")
//////        repeat(10){
//////            execute("mkdir m$it")
//////        }
//////        execute("mkdir t1")
//////        execute("mkdir t2")
//////        execute("mkdir t3")
//////        execute("mkdir t4")
//////        execute("mkdir t5")
//////        execute("mkdir t6")
////    }
//}
//
