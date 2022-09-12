

Set KEY_PAIR=%1
Set SERVER_DIR=%2
Set SSH_TARGET=%3
Set VERSION_ID=%4
Set JAR_NAME=%5

ssh -i C:\Users\natan\Desktop\GoogleDriveBackup\aws_secret\AcEC2Pair.pem ec2-user@ec2-3-127-245-215.eu-central-1.compute.amazonaws.com << EOF
    ls
EOF