package io.github.crashy

import com.sshtools.client.SshClient
import com.sshtools.client.scp.ScpClient
import com.sshtools.client.tasks.FileTransferProgress
import com.sshtools.common.publickey.SshKeyUtils
import com.sshtools.common.ssh.components.SshKeyPair
import java.io.File

////
// commandLine =
// "scp -r -i C:\\Users\\natan\\Desktop\\GoogleDrivedSynced\\GoogleDriveBackup\\aws_secret\\AcEC2Pair.pem
// C:\\Users\\natan\\Desktop\\Crashy\\server\\build\\libs\\4872830908762331994 ec2-user@ec2-35-157-64-36.eu-central-1.compute.amazonaws.com:~/ac/".split(" ")
fun main(){
    //TODO:
    // Goals:
    // - Show all host machine CMD output and errors at real time
    // - Improve speed



    val keyPair = File("C:\\Users\\natan\\Desktop\\GoogleDrivedSynced\\GoogleDriveBackup\\aws_secret\\AcEC2Pair.pem")
    val dns = "ec2-35-157-64-36.eu-central-1.compute.amazonaws.com"
    val file = File("C:\\Users\\natan\\Desktop\\Crashy\\server\\build\\libs\\4872830908762331994")
//    ScpClient()
    SshClient(dns,22,"ec2-user",keyPair).use {ssh ->
        val scp = ScpClient(ssh).put(file.absolutePath,"~/test2/",true,object: FileTransferProgress {
            var totalBytes = 0L
            override fun started(bytesTotal: Long, remoteFile: String?) {
                println("Started uploading file $remoteFile of $bytesTotal bytes.")
                totalBytes = bytesTotal
            }

            override fun isCancelled(): Boolean {
                return false
            }

            override fun progressed(bytesSoFar: Long) {
                println("Progress: " + bytesSoFar.toDouble() / totalBytes)
            }

            override fun completed() {
                println("Upload complete")
            }

        })
//        println(ssh.executeCommand("mkdir haloo2"))
    }
}