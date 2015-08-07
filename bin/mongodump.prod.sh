#!/bin/sh
cd /Users/hbmu/program/mongodb-osx-x86_64-3.0.3/bin
./mongodump -h localhost:27017 -d blog -o "/root/website/blog/data/blog/data"