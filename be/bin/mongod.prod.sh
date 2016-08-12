#!/bin/sh
cd /root/program/mongodb-linux-x86_64-ubuntu1404-3.0.3/bin
nohup ./mongod --dbpath="/root/program/mongodb-linux-x86_64-ubuntu1404-3.0.3/data" --logpath="/root/program/mongodb-linux-x86_64-ubuntu1404-3.0.3/logs/mongodb.log" &