#!/bin/sh
cd /Users/hbmu/program/mongodb-osx-x86_64-3.0.3/bin
./mongorestore -h localhost:27017 -d blog "/Users/hbmu/workspace/github/blog/data/blog"