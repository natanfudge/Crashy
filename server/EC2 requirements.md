- Java 17 installed
- Directory ~/jars/beta
- Directory ~/jars/release
- Script ~/crashy_utils/scripts with the following content:
```shell
#!/bin/bash

# Check if a JAR file name was provided
if [ $# -eq 0 ]; then
    echo "Error: JAR file name not provided."
    echo "Usage: $0 <jar_file_name>"
    exit 1
fi

# Get the PID of the Java process with the specified JAR file name
#| grep $1 | grep -v grep | awk '{print $2}'
pid=$(ps aux | grep java | grep $1 | grep -v $0 | awk '{print $2}')

echo $pid

# Check if the Java process with the specified JAR file name was found
if [ -z "$pid" ]; then
    echo "Error: Java process with JAR file name '$1' not found."
    exit 0
fi

# Kill the Java process with the specified PID
echo "Killing Java process with PID $pid and JAR file name '$1'..."
kill $pi
```

