#!/bin/bash
if [ $1 == "dev" ]
then
  if [ $2 == "noauth" ]
  then
    echo "4"
    supervisor ./server.noauth.js
  else
    echo "3"
    supervisor ./server.js
  fi
elif [ $1 == "noauth" ]
then
  echo "2"
  node ./server.noauth.js
else
  echo "1"
  node ./server.js
fi