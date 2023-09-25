#!/bin/bash
# 1. Update submodule
git submodule foreach git add .
git submodule foreach git commit -m "$1"
#It will always push to main which is not optimal but works for now
git submodule foreach git push origin HEAD:main
# 2. Update reference to submodule so that git uses the latest version
git submodule update --remote client/src/fudge-lib
# 3. Update this project, including new reference to submodule
git add .
git commit -m "$1"
git push
