// This script transfers the dev dependencies of eslint-config-crashy to client, common, and server
// and transfers the normal dependencies of common to client and server
// This script should be run whenever the dependencies of eslint-config-crashy or common change.
// This is because I have not found a better way to inherit dependencies.
// If you read this and found a better way let me know.
const fs = require("fs").promises;
const commonPackageJson = fs.readFile("/")