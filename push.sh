#!/bin/bash
git add .
git commit -m "$1"
git push
#It will always push to main which is not optimal but works for now
git submodule foreach git add .
git submodule foreach git commit -am "$1"
git submodule foreach git push origin HEAD:main