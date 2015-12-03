#!/bin/sh
cd /root/program/mongodb-linux-x86_64-ubuntu1404-3.0.3/bin
./mongorestore -h localhost:27017 -d blog "/root/website/blog/be/data/blog"